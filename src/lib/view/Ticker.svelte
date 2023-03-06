<script lang="ts">
  import decimal from 'decimal.js';

  // This is completely arbitrary
  const ZOOM_FAC = 10;
  const DEF_PAD = -32;

  export let zoom = new decimal(1);
  export let pan = new decimal(0);

  let container: HTMLDivElement;

  let step = new decimal(0);
  let t = new decimal(0);
  let cmin = new decimal(0);
  let cmax = new decimal(0);
  let count = 0;
  let pad = 0;
  let fStep = false;

  $: {
    let max = pan.add(zoom.mul(ZOOM_FAC));
    let min = pan;

    t = max.minus(min);
    let p = decimal.pow(10, decimal.floor(decimal.log10(t)).minus(1));

    if (decimal.abs(t.minus(p)) < decimal.abs(t.minus(p).times(5))) {
      step = p;
      fStep = false;
    } else {
      step = p.mul(5);
      fStep = true;
    }

    /* cmin = min.plus(step.minus(min.modulo(step))); */
    cmin = min.minus(min.modulo(step));
    cmax = max.plus(step.minus(max.modulo(step)));

    /* console.log( */
    /*   `${min.toNumber()} : ${cmin.toNumber()},`, */
    /*   `${max.toNumber()} : ${cmax.toNumber()}`, */
    /* ); */

    count =
      decimal.floor(cmax.minus(cmin)).div(step).toNumber() * (fStep ? 5 : 2) +
      1;

    pad = min.mod(step).div(t).toNumber();

    console.log(min.toNumber(), step.toNumber(), t.toNumber(), pad);
  }
</script>

<svelte:window
  on:wheel|nonpassive|preventDefault={(e) => {
    if (e.ctrlKey) {
      if (Math.sign(e.deltaY) === 1) {
        zoom = zoom.mul(2);
      } else {
        zoom = zoom.div(2);
      }
    } else {
      pan = decimal.max(0, pan.plus(zoom.times(e.deltaY / 1000)));
    }
  }}
/>
<div class="relative w-full h-full overflow-x-hidden" bind:this={container}>
  {#if container}
    <div class="absolute top-0 left-0 right-0" bind:this={container}>
      {#each Array(count) as _, i}
        {#if (fStep && i % 5 === 0) || (!fStep && i % 2 === 0)}
          <span
            class="absolute flex flex-col gap-[1px] items-center w-[2px]"
            style="left: {((container.clientWidth - pad) / t.toNumber()) * i -
              pad * container.clientWidth -
              DEF_PAD -
              1}px;"
          >
            <span class="w-[2px] h-6 bg-zinc-500 rounded-b-sm" />
            <span class="block">
              {step.times(i % 5 === 0 ? i / 5 : i / 2).plus(cmin)}
            </span>
          </span>
        {:else}
          <span
            class="absolute h-4 w-[2px] bg-zinc-600 rounded-b-sm"
            style="left: {((container.clientWidth - pad) / t.toNumber()) * i -
              pad * container.clientWidth -
              DEF_PAD -
              1}px;"
          />
        {/if}
      {/each}
    </div>
  {/if}
</div>
