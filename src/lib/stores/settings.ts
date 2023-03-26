import { writable } from 'svelte/store';
import {
  type SpectrogramOptions,
  defaultOptions,
} from '$lib/view/spectrogram/glue';

export const settings = writable<SpectrogramOptions>(defaultOptions({}));
