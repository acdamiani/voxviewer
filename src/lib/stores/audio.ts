import type AudioFile from '$lib/audio/audio';
import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';

const audioStore = () => {
  const audio = writable<AudioFile | null>(null);

  const set = (value: AudioFile) => {
    audio.set(value);
  };

  const subscribe = audio.subscribe;

  const buffer = derived<Writable<AudioFile | null>, AudioBuffer | null>(
    audio,
    ($audio, set) => {
      $audio?.load().then((b) => set(b));
    },
  );

  return { audio: { set, subscribe }, buffer };
};

const store = audioStore();

export const audio = store.audio;
export const buffer = store.buffer;
