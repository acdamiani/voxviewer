use colorous::Color;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub enum Colorscheme {
    BlackWhite,
    Viridis,
    Inferno,
    Magma,
    Plasma,
    Cividis,
    Warm,
    Cool,
}

pub fn eval_col(colorscheme: Colorscheme, t: f64) -> Color {
    match colorscheme {
        Colorscheme::Viridis => colorous::VIRIDIS.eval_continuous(1.0 - t),
        Colorscheme::Inferno => colorous::INFERNO.eval_continuous(1.0 - t),
        Colorscheme::Magma => colorous::MAGMA.eval_continuous(1.0 - t),
        Colorscheme::Plasma => colorous::PLASMA.eval_continuous(1.0 - t),
        Colorscheme::Cividis => colorous::CIVIDIS.eval_continuous(1.0 - t),
        Colorscheme::Warm => colorous::WARM.eval_continuous(1.0 - t),
        Colorscheme::Cool => colorous::COOL.eval_continuous(1.0 - t),
        Colorscheme::BlackWhite => colorous::GREYS.eval_continuous(t),
    }
}
