import { readable } from 'svelte/store';
import init, { type InitOutput } from 'rs';
import { onMount } from 'svelte';

export const initResult = readable<InitOutput | null>(null, (set) => {
  // I can do this????
  onMount(() => {
    console.log('initializing');
    init().then((o: InitOutput) => set(o));
  });
});
