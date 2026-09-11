<script>
	import favicon from '$lib/assets/favicon.svg';
	import '../../public/css/main.css';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
