<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Brand from './brand.svelte';
	import Login from './login.svelte';

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
	</div>
</header>
<Login />
