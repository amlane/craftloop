<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Brand from './brand.svelte';

	onMount(() => {
		// if valid session token, redirect user to projects page
		if (browser) {
			const jwtToken = localStorage.getItem('token');
			if (jwtToken) {
				goto(resolve('/projects'));
			}
		}
	});
</script>

<header class="top-bar mt-6 mb-4">
	<div class="brand flex justify-between">
		<Brand />
		<div class="flex items-center">
			<a class="btn btn-primary mr-2" id="login" href="/login">Login</a>
			<a class="btn btn-secondary" id="signup" href="/signup">Sign up</a>
		</div>
	</div>
</header>
<div class="landing-page flex flex-col items-center justify-items-center pb-16 text-center">
	<div class="display py-8">
		<p class="title-text text-3xl">Every pattern you make,</p>
		<p class="title-text text-3xl">actually written down.</p>
	</div>
	<div>
		<p class="max-w-100">
			craftloop is where you keep the yarn, the hook, the gauge, and every row, so the thing you
			made last winter isn't gone the moment you finish it.
		</p>
	</div>
	<div class="flex items-center py-8">
		<a class="btn btn-secondary mr-2" id="signup" href="/signup">Sign up Free</a>
		<a class="btn btn-primary" id="login" href="/login">Login</a>
	</div>
	<div>PLACEHOLDER FOR ASSETS</div>
	<div>
		<p class="display title-text text-xl">Built like a real pattern, not a sticky note.</p>
	</div>
	<div class="flex py-8">
		<div
			class="card border-primary container mx-2 flex flex-col items-start rounded-sm bg-white px-4 py-4"
		>
			<p class="icon">Card SVG</p>
			<p class="title font-bold">Card Title</p>
			<p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
		</div>
		<div
			class="card border-primary container mx-2 flex flex-col items-start rounded-sm bg-white px-4 py-4"
		>
			<p class="icon">Card SVG</p>
			<p class="title font-bold">Card Title</p>
			<p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
		</div>
	</div>
	<div class="flex">
		<div
			class="card border-primary container mx-2 flex flex-col items-start rounded-sm bg-white px-4 py-4"
		>
			<p class="icon">Card SVG</p>
			<p class="title font-bold">Card Title</p>
			<p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
		</div>
		<div
			class="card border-primary container mx-2 flex flex-col items-start rounded-sm bg-white px-4 py-4"
		>
			<p class="icon">Card SVG</p>
			<p class="title font-bold">Card Title</p>
			<p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
		</div>
	</div>
</div>
