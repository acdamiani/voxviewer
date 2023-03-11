use js_sys::{Float32Array, Function};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmSampleBuffer {
    buffer: Vec<f32>,
}

#[wasm_bindgen]
impl WasmSampleBuffer {
    #[wasm_bindgen(constructor)]
    pub fn new(buffer_length: u32, f: &Function) -> Self {
        let size = buffer_length as usize;
        let mut buffer = vec![0.0; size];

        unsafe {
            let array = Float32Array::view_mut_raw(buffer.as_mut_ptr(), size);
            f.call1(&JsValue::NULL, &JsValue::from(array))
                .expect("Callback function should not throw");
        }

        Self { buffer }
    }
}

impl WasmSampleBuffer {
    pub fn buffer(&self) -> Vec<f32> {
        self.buffer.clone()
    }
}
