<script lang="ts">
	export let title: string = '';
	export let disabled: boolean = false;
	export let selected: boolean = false;
</script>

<button
	on:click
	{title}
	{disabled}
	data-selected={selected}
	class="rounded-4xl border-black-800 text-grey-900 hover:bg-black-800 disabled:bg-black-800 disabled:text-black-700 data-selected:bg-black-700 grid aspect-square size-full place-content-center border transition-colors duration-300 disabled:cursor-not-allowed"
>
	<slot />
</button>
