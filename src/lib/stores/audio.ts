import type { WasmAudioBuffer } from '$lib/audio/audio';
import type AudioFile from '$lib/audio/audio';
import { writable, derived, type Readable } from 'svelte/store';
import { initResult } from './wasm';

const audioStore = () => {
  const audio = writable<AudioFile | null>(null);

  const set = (value: AudioFile) => {
    audio.set(value);
  };

  const subscribe = audio.subscribe;

  const buffer: Readable<WasmAudioBuffer> = derived(
    [audio, initResult],
    ([$audio, $initResult], set) => {
      if ($initResult) {
        $audio?.load().then((b) => set(b));
      }
    },
  );

  return { audio: { set, subscribe }, buffer };
};

const store = audioStore();

export const audio = store.audio;
export const buffer = store.buffer;
