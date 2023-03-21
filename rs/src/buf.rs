use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmSampleBuffer {
    buffer: Vec<f32>,
}

#[wasm_bindgen]
impl WasmSampleBuffer {
    #[wasm_bindgen(constructor)]
    pub fn new(raw_samples: Vec<f32>) -> Self {
        Self {
            buffer: raw_samples,
        }
    }
}

impl WasmSampleBuffer {
    pub fn buffer(&self) -> Vec<f32> {
        self.buffer.clone()
    }
}
