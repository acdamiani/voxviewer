use std::sync::Arc;

use realfft::{num_complex::Complex, RealFftPlanner, RealToComplex};
use wasm_bindgen::prelude::*;

use js_sys::Uint8Array;

use crate::{
    buf::WasmSampleBuffer,
    col::{eval_col, Colorscheme},
    win::{Window, WindowData},
};

struct SpectrogramComputationConfig {
    buffer: Vec<f32>,

    windows: usize,
    bins: usize,
    padding: usize,

    hop: usize,

    fft: Arc<dyn RealToComplex<f32>>,

    input: Box<[f32]>,
    output: Box<[Complex<f32>]>,

    window_data: WindowData,
}

impl SpectrogramComputationConfig {
    pub fn new(spectrogram: &mut Spectrogram, buffer: &WasmSampleBuffer) -> Self {
        let buffer_len = buffer.buffer().len();
        let win_size = spectrogram.win_size as usize;

        let fft_len = win_size * spectrogram.zero_pad_fac as usize;
        let padding = ((spectrogram.win_size * (spectrogram.zero_pad_fac - 1)) / 2) as usize;

        let hop = if spectrogram.overlap {
            win_size / 2
        } else {
            win_size
        };

        let bins = (fft_len / 2) as usize;
        let windows = (buffer_len - win_size) / hop + 1;

        let fft = spectrogram.planner.plan_fft_forward(fft_len);

        let mut input_vec = fft.make_input_vec();
        input_vec.fill(0.0);
        let input_slice = input_vec.as_slice();

        let output_vec = fft.make_output_vec();
        let output_slice = output_vec.as_slice();

        Self {
            fft,
            windows,
            bins,
            padding,
            hop,
            buffer: buffer.buffer(),
            input: input_slice.into(),
            output: output_slice.into(),
            window_data: WindowData::new(spectrogram.win_func, win_size),
        }
    }
}

#[wasm_bindgen]
pub struct Spectrogram {
    win_size: usize,
    zero_pad_fac: usize,
    win_func: Window,
    overlap: bool,

    offset: f32,
    range: f32,

    colorscheme: Colorscheme,

    planner: RealFftPlanner<f32>,

    config: Option<SpectrogramComputationConfig>,
}

#[wasm_bindgen]
impl Spectrogram {
    #[wasm_bindgen(constructor)]
    pub fn new(
        win_size: u32,
        zero_pad_fac: u32,
        win_func: Window,
        overlap: bool,
        offset: f32,
        range: f32,
        colorscheme: Colorscheme,
    ) -> Result<Spectrogram, JsError> {
        crate::utils::set_panic_hook();

        if !win_size.is_power_of_two() {
            return Err(JsError::new("win_size should be a power of two"));
        } else if !zero_pad_fac.is_power_of_two() {
            return Err(JsError::new("zero_pad_fac should be a power of two"));
        }

        Ok(Self {
            planner: RealFftPlanner::new(),
            win_size: win_size as usize,
            zero_pad_fac: zero_pad_fac as usize,
            win_func,
            overlap,
            offset,
            range,
            colorscheme,
            config: None,
        })
    }

    pub fn initialize(&mut self, buffer: &WasmSampleBuffer) -> () {
        self.config = Some(SpectrogramComputationConfig::new(self, buffer));
    }

    pub fn windows(&self) -> Result<u32, JsError> {
        match &self.config {
            Some(config) => Ok(config.windows as u32),
            None => Err(JsError::new(
                "a call to windows() should be preceded by an intialize() call",
            )),
        }
    }

    pub fn bins(&self) -> Result<u32, JsError> {
        match &self.config {
            Some(config) => Ok(config.bins as u32),
            None => Err(JsError::new(
                "a call to bins() should be preceded by an initialize() call",
            )),
        }
    }

    pub fn compute(&mut self, buffer: &Uint8Array) -> Result<(), JsError> {
        if self.config.is_none() {
            return Err(JsError::new(
                "a call to compute() should be preceded by an initialize() call",
            ));
        }

        let config = self.config.as_mut().unwrap();

        // TODO: use Uint8Array directly
        let mut vec: Vec<u8> = Vec::with_capacity(config.windows * config.bins * 3);

        for i in 0..config.windows {
            let start = i * config.hop;
            let frame = &config.buffer[start..(start + self.win_size)];

            config.window_data.apply(
                frame,
                &mut config.input[config.padding..(config.padding + frame.len())],
            );

            config.fft.process(&mut config.input, &mut config.output)?;

            vec.extend(
                config
                    .output
                    .iter()
                    .take(config.output.len() - 1)
                    // https://dsp.stackexchange.com/questions/32076/fft-to-spectrum-in-decibel
                    .map(|x| x.norm() * 2.0 / config.window_data.sum())
                    .map(|x| 20.0 * (x.log10()))
                    .map(|x| (x + self.offset) / -self.range)
                    .map(|x| {
                        let c = eval_col(self.colorscheme, x as f64);
                        [c.r, c.g, c.b]
                    })
                    .flatten(),
            );
        }

        buffer.copy_from(&vec);

        Ok(())
    }
}
