use std::{
    f32::consts::{PI, TAU},
    vec,
};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub enum Window {
    Rectangular,
    Bartlett,
    Hamming,
    Hann,
    Blackman,
    BlackmanHarris,
    Welch,
    Gaussian25,
    Gaussian35,
    Gaussian45,
}

pub struct WindowData {
    factors: Box<[f32]>,
}

impl WindowData {
    pub fn new(window_func: Window, len: usize) -> Self {
        Self {
            factors: WindowData::window(window_func, len).into_boxed_slice(),
        }
    }

    pub fn apply(&self, input: &[f32], output: &mut [f32]) {
        assert_eq!(input.len(), output.len());
        assert_eq!(self.factors.len(), output.len());

        for i in 0..output.len() {
            output[i] = input[i] * self.factors[i];
        }
    }

    fn window(window_func: Window, len: usize) -> Vec<f32> {
        match window_func {
            Window::Rectangular => vec![1.0; len],
            Window::Bartlett => bartlett(len),
            Window::Hamming => hamming(len),
            Window::Hann => hann(len),
            Window::Blackman => blackman(len),
            Window::BlackmanHarris => blackman_harris(len),
            Window::Welch => welch(len),
            Window::Gaussian25 => gaussian(len, 2.5),
            Window::Gaussian35 => gaussian(len, 3.5),
            Window::Gaussian45 => gaussian(len, 4.5),
        }
    }
}

fn bartlett(len: usize) -> Vec<f32> {
    let mut samples = vec![0.0; len];
    let slope = 2.0 / ((len - 1) as f32);
    for i in 0..len {
        let y = i as f32 * slope;
        samples[i] = if i < len / 2 { y } else { 2.0 - y }
    }

    samples
}

fn hamming(len: usize) -> Vec<f32> {
    let mut samples = vec![0.0; len];
    const A0: f32 = 25.0 / 46.0;
    const A1: f32 = 1.0 - A0;
    for i in 0..len {
        samples[i] = A0 - A1 * ((TAU * i as f32) / (len - 1) as f32).cos();
    }

    samples
}

fn hann(len: usize) -> Vec<f32> {
    let mut samples = vec![0.0; len];
    for i in 0..len {
        samples[i] = ((PI * i as f32) / (len - 1) as f32).sin().powi(2);
    }

    samples
}

fn blackman(len: usize) -> Vec<f32> {
    let mut samples = vec![0.0; len];
    const A0: f32 = 7938.0 / 18608.0;
    const A1: f32 = 9240.0 / 18608.0;
    const A2: f32 = 1430.0 / 18608.0;
    let w = (len - 1) as f32;
    for i in 0..len {
        let ntau = TAU * i as f32;
        samples[i] = A0 - A1 * (ntau / w).cos() + A2 * ((2.0 * ntau) / w).cos();
    }

    samples
}

fn blackman_harris(len: usize) -> Vec<f32> {
    let mut samples = vec![0.0; len];
    const A0: f32 = 0.35875;
    const A1: f32 = 0.48829;
    const A2: f32 = 0.14128;
    const A3: f32 = 0.01168;
    let w = (len - 1) as f32;
    for i in 0..len {
        let ntau = TAU * i as f32;
        samples[i] = A0 - A1 * (ntau / w).cos() + A2 * ((2.0 * ntau) / w).cos()
            - A3 * ((3.0 * ntau) / w).cos()
    }

    samples
}

fn welch(len: usize) -> Vec<f32> {
    let mut samples = vec![0.0; len];
    let half_w = ((len - 1) as f32) / 2.0;
    for i in 0..len {
        samples[i] = 1.0 - ((i as f32 - half_w) / half_w).powi(2);
    }

    samples
}

fn gaussian(len: usize, alpha: f32) -> Vec<f32> {
    let mut samples = vec![0.0; len];
    let one_half = -1.0 / 2.0;
    let half_w = ((len - 1) as f32) / 2.0;
    for i in 0..len {
        samples[i] = (one_half * ((alpha * (i as f32 - half_w)) / half_w).powi(2)).exp();
    }

    samples
}
