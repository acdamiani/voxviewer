import { writable, type Updater } from 'svelte/store';

const playheadStore = () => {
  const playhead = writable(0);

  const set = (value: number) => {
    playhead.set(Math.max(0, value));
  };

  const update = (updater: Updater<number>) => {
    playhead.update(($playhead) => {
      return Math.max(0, updater($playhead));
    });
  };

  return {
    set,
    update,
    subscribe: playhead.subscribe,
  };
};

export const playhead = playheadStore();
