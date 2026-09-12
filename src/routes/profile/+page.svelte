<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Brand from '../brand.svelte';

	function logout() {
		localStorage.removeItem('token');
		goto(resolve('/'));
	}

	let data = $state(null);
	let loading = $state(true);
	let username = $state('');
	let email = $state('');

	onMount(() => {
		if (browser) {
			const jwtToken = localStorage.getItem('token');
			if (jwtToken) {
				async function fetchData() {
					try {
						// Pass headers in the configuration object
						const response = await fetch('http://localhost:8000/api/users/me', {
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								Authorization: 'Bearer ' + jwtToken
							}
						});

						data = await response.json();
					} catch (error) {
						console.error('Failed to fetch:', error);
					} finally {
						loading = false;
						username = data.username;
						email = data.email;
					}
				}

				fetchData();
			}
		}
	});
</script>

<header class="top-bar mt-6 mb-4">
	<div class="brand flex justify-between">
		<Brand />
		<div class="flex items-center">
			<a class="btn btn-primary mr-2" id="newBtn" href="/projects"> Back to Projects </a>
			<button onclick={logout} class="logout btn btn-secondary" id="logoutBtn">Logout</button>
		</div>
	</div>
</header>
<div class="pb-4">
	<p class="title-text">Username</p>
	<p>{username}</p>
</div>
<div class="pb-4">
	<p class="title-text">Email</p>
	<p>{email}</p>
</div>
<p class="title-text">Change Password</p>
