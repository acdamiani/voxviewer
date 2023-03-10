<script>
  import IconButton from '$lib/controls/IconButton.svelte';
  import IconStepBackwards from '~icons/fa6-solid/backward-step';
  import IconStepForwards from '~icons/fa6-solid/forward-step';
  import PlaybackButton from './PlaybackButton.svelte';
</script>

<div class="flex items-center gap-6">
  <span class="whitespace-nowrap font-semibold text-xl">00.00:00 s</span>
  <IconButton icon={IconStepBackwards} />
  <PlaybackButton />
  <IconButton icon={IconStepForwards} />
  <span class="whitespace-nowrap font-semibold text-xl">00.15:00 s</span>
</div>
