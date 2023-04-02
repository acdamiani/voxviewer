import { writable } from 'svelte/store';
import type { Updater } from 'svelte/store';

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

export const pan = panStore();

const panFromZoom = (pan: number, point: number, lz: number, cz: number) => {
  const dp = point / cz - point / lz;
  return pan + dp;
};

const zoomStore = () => {
  const zoom = writable(1);

  const round = (zoom: number) => {
    return (1.0 / 16) * Math.floor(zoom * 16);
  };

  const zoomIn = (point: number) => {
    zoom.update((z) => {
      const lz = z;
      const cz = round(Math.max(1, z * (4 / 5)));

      pan.update(($pan) => panFromZoom($pan, point, lz, cz));

      return cz;
    });
  };

  const zoomOut = (point: number) => {
    zoom.update((z) => {
      const lz = z;
      const cz = round(Math.min(16777216, z * (5 / 4)));

      pan.update(($pan) => panFromZoom($pan, point, lz, cz));

      return cz;
    });
  };

  return {
    zoomIn,
    zoomOut,
    subscribe: zoom.subscribe,
  };
};

export const zoom = zoomStore();
