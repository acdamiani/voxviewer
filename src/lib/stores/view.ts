import { writable } from 'svelte/store';
import type { Updater } from 'svelte/store';
import { ZOOM_FAC } from '$lib/util/constants';

const panStore = () => {
  const { set: storeSet, update: storeUpdate, subscribe } = writable(0);

  const set = (value: number) => {
    storeSet(Math.max(0, value));
  };

  const update = (updater: Updater<number>) => {
    const selfUpdater = (value: number): number => {
      return Math.max(0, updater(value));
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
  const fac = cz / lz;
  return point / fac + pan / fac - point;
};

const zoomStore = () => {
  const zoom = writable(1);

  const round = (zoom: number) => {
    return (1.0 / 16) * Math.floor(zoom * 16);
  };

  const zoomIn = (point: number) => {
    zoom.update((z) => {
      const lz = z;
      const cz = round(Math.max(1, z * ZOOM_FAC ** -1));

      pan.update(($pan) => panFromZoom($pan, point, lz, cz));

      return cz;
    });
  };

  const zoomOut = (point: number) => {
    zoom.update((z) => {
      const lz = z;
      const cz = round(Math.min(16777216, z * ZOOM_FAC));
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
