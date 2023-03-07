import { writable } from 'svelte/store';
import type AudioFile from './audio/audio';

export const audio = writable<AudioFile | null>(null);
