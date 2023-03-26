export const windowMap = {
  rectangular: 0, // Window.Rectangular
  bartlett: 1, // Window.Bartlett
  hamming: 2, // Window.Hamming
  hann: 3, // Window.Hann
  blackman: 4, // Window.Blackman
  welch: 6, // Window.Welch
  'blackman-harris': 5, // Window.BlackmanHarris
  'gaussian-2.5': 7, // Window.Gaussian25
  'gaussian-3.5': 8, // Window.Gaussian35
  'gaussian-4.5': 9, // Window.Gaussian45
} as const;

export type WindowFunction = keyof typeof windowMap;
export type WindowFunctionKinds =
  | Exclude<WindowFunction, 'gaussian-2.5' | 'gaussian-3.5' | 'gaussian-4.5'>
  | 'gaussian';

export type GaussianAlphas = '2.5' | '3.5' | '4.5';

export const colorschemeMap = {
  blackWhite: 0, // Colorscheme.BlackWhite
  viridis: 1, // Colorscheme.Viridis
  inferno: 2, // Colorscheme.Inferno
  magma: 3, // Colorscheme.Magma
  plasma: 4, // Colorscheme.Plasma
  cividis: 5, // Colorscheme.Cividis
  warm: 6, // Colorscheme.Warm
  cool: 7, // Colorscheme.Cool
};

export type Colorscheme = keyof typeof colorschemeMap;

export type SpectrogramOptions = {
  windowSize?: number;
  zeroPaddingFactor?: number;
  windowFunction?: WindowFunction;
  offset?: number;
  range?: number;
  colorscheme?: Colorscheme;
};

export function defaultOptions(
  options: SpectrogramOptions,
): Required<SpectrogramOptions> {
  return {
    windowSize: options.windowSize ?? 1024,
    zeroPaddingFactor: options.zeroPaddingFactor ?? 1,
    windowFunction: options.windowFunction ?? 'hann',
    offset: options.offset ?? 20,
    range: options.range ?? 80,
    colorscheme: options.colorscheme ?? 'magma',
  };
}
