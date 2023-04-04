import AudioFile from '$lib/audio/file';
import AudioPlayer from '$lib/audio/player';
import { zoom, pan } from './view';
import { WAVEFORM_BASE_SAMPLES_PER_PIXEL } from '$lib/util/constants';
import { writable, derived, type Readable } from 'svelte/store';

const audioStore = () => {
  const audio = writable<AudioFile | null>(null);

  const set = (value: AudioFile) => {
    audio.set(value);
  };

  const subscribe = audio.subscribe;

  const buffer: Readable<AudioBuffer> = derived(audio, ($audio, set) => {
    $audio?.load().then((b) => set(b));
  });

  const player: Readable<AudioPlayer> = derived(audio, ($audio, set) => {
    $audio?.load().then((b) => set(new AudioPlayer(AudioFile.context, b)));
  });

  const playerPosition: Readable<number> = derived(player, ($player, set) => {
    set(0);

    if (!$player) {
      return;
    }

    let id: number | null;

    const start = () => {
      if (!id) {
        id = window.requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      if (id) {
        window.cancelAnimationFrame(id);
        id = null;
      }
    };

    const loop = () => {
      id = null;
      set($player.position);
      console.log('going');
      start();
    };

    start();

    return stop;
  });

  const playerPositionPixels: Readable<number> = derived(
    [playerPosition, buffer, zoom, pan],
    ([$playerPosition, $buffer, $zoom, $pan]) =>
      $buffer
        ? ($playerPosition * $buffer.sampleRate) /
            ($zoom * WAVEFORM_BASE_SAMPLES_PER_PIXEL) -
          $pan
        : 0,
  );

  return {
    audio: { set, subscribe },
    buffer,
    player,
    playerPosition,
    playerPositionPixels,
  };
};

export const { audio, buffer, player, playerPosition, playerPositionPixels } =
  audioStore();
