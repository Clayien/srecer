<script>
	import '../app.css';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main
	class="bg-black-900 text-grey-600 h-screen w-screen overflow-hidden p-4 font-sans leading-loose"
>
	<slot />
</main>
