use realfft::RealFftPlanner;
use wasm_bindgen::prelude::*;

use crate::{
    buf::WasmSampleBuffer,
    win::{Window, WindowData},
};

#[wasm_bindgen]
pub struct Spectrogram {
    buffer: Vec<f32>,
    data: Vec<f32>,
}

#[wasm_bindgen]
impl Spectrogram {
    #[wasm_bindgen(constructor)]
    pub fn new(buffer: &WasmSampleBuffer) -> Self {
        Self {
            buffer: buffer.buffer(),
            data: Vec::new(),
        }
    }

    pub fn compute(
        &mut self,
        win_size: u32,
        zero_pad_fac: u32,
        win_func: Window,
    ) -> Result<*const f32, JsError> {
        if !win_size.is_power_of_two() {
            return Err(JsError::new("win_size should be a power of two"));
        } else if zero_pad_fac.is_power_of_two() {
            return Err(JsError::new("zero_pad_fac should be a power of two"));
        }

        let win_usize = win_size as usize;

        let fft_len = win_size * zero_pad_fac;
        let padding = ((win_size * (zero_pad_fac - 1)) / 2) as usize;

        let num_bins = (fft_len / 2) as usize;
        let samples = self.buffer.len() + self.buffer.len() % win_usize;
        let windows = samples / win_usize;

        let mut vec: Vec<f32> = Vec::with_capacity(windows * num_bins);

        let mut planner: RealFftPlanner<f32> = RealFftPlanner::new();
        let fft = planner.plan_fft_forward(fft_len as usize);

        let mut input = fft.make_input_vec();
        let mut output = fft.make_output_vec();

        // Probably unnecessary
        input[..padding].fill(0.0);
        input[padding..].fill(0.0);

        let window = WindowData::new(win_func, win_usize);
        let mut consumer = SampleConsumer::new(win_usize);

        let mut sample: f32;
        let mut scratch: Option<&[f32]>;
        for i in 0..samples {
            sample = *self.buffer.get(i).unwrap_or(&0.0);
            scratch = consumer.consume(sample);

            match scratch {
                Some(s) => {
                    window.apply(s, &mut input[padding..s.len()]);
                    fft.process(&mut input, &mut output)?;
                    vec.extend(
                        output
                            .iter()
                            .map(|x| 10.0 * x.norm_sqr().log10())
                            .take(output.len() - 1),
                    );
                }
                None => {}
            }
        }

        self.data = vec;
        Ok(self.data.as_ptr())
    }
}

struct SampleConsumer {
    counter: usize,
    scratch: Vec<f32>,
}

impl SampleConsumer {
    pub fn new(scratch_len: usize) -> Self {
        Self {
            counter: 0,
            scratch: vec![0.0; scratch_len],
        }
    }

    pub fn consume(&mut self, sample: f32) -> Option<&[f32]> {
        let len = self.scratch.len();
        let mid = len / 2;
        let cmod = self.counter % mid;

        if self.counter < len {
            self.scratch[self.counter] = sample;
            self.counter += 1;
            return if self.counter % len == 0 {
                Some(&self.scratch)
            } else {
                None
            };
        } else if cmod == 0 {
            self.scratch.rotate_left(mid);
        }

        self.scratch[cmod + mid] = sample;
        self.counter += 1;

        if self.counter % mid == 0 {
            Some(&self.scratch)
        } else {
            None
        }
    }
}
