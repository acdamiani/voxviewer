import { writable } from 'svelte/store';
import type { Updater } from 'svelte/store';

const zoomStore = () => {
  const { update, subscribe } = writable(1);

  const zoomIn = () => {
    update((z) => (z <= 1 ? z : z / 2));
  };

  const zoomOut = () => {
    update((z) => {
      return z >= 32 ? z : z * 2;
    });
  };

  return {
    zoomIn,
    zoomOut,
    subscribe,
  };
};

const panStore = () => {
  const { set: storeSet, update: storeUpdate, subscribe } = writable(0);

  const set = (value: number) => {
    storeSet(Math.max(0, value));
  };

  const update = (updater: Updater<number>) => {
    const selfUpdater = (value: number): number => {
      const c = updater(value);
      return Math.max(0, c);
    };
    storeUpdate(selfUpdater);
  };

  return {
    set,
    update,
    subscribe,
  };
};

export const zoom = zoomStore();
export const pan = panStore();
