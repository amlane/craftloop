<script>
	import Brand from '../brand.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';

	let username = $state('');
	let password = $state('');
	let email = $state('');
	let responseMessage = $state('Loading...');
	let errorMessage = $state('');

	async function sendData() {
		try {
			const response = await fetch('http://localhost:8000/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: email, username: username, password: password }) // Must stringify the body
			});

			const data = await response.json();
			responseMessage = data.message;
			if (response.ok) {
				// Redirect to the dashboard route upon success
				if (browser) {
					localStorage.setItem('token', data.token);
				}
				goto(resolve('/projects'));
			} else {
				errorMessage = responseMessage;
				console.log(responseMessage);
			}
		} catch (error) {
			responseMessage = 'Error sending data.';
			console.error(error);
		}
	}
</script>

<header class="top-bar mx-12 mt-8 mb-4">
	<div class="brand flex justify-between">
		<Brand />
	</div>
</header>
<div class="flex justify-center p-4">
	<div class="border-primary w-full max-w-sm rounded-xl p-6 shadow-md">
		<h2 class="title-text mb-6 text-center text-xl font-bold">Sign Up</h2>
		<form onsubmit={sendData} class="space-y-4">
			<div>
				<label for="email" class="mb-1 block text-xs font-medium tracking-wider uppercase">
					Email
				</label>
				<input
					id="email"
					type="text"
					bind:value={email}
					required
					class="w-full"
					placeholder="Email"
				/>
			</div>
			<div>
				<label for="username" class="mb-1 block text-xs font-medium tracking-wider uppercase">
					Username
				</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					required
					class="w-full"
					placeholder="Choose a username"
				/>
			</div>
			<div>
				<label for="password" class="mb-1 block text-xs font-medium tracking-wider uppercase">
					Password
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="w-full"
					placeholder="••••••••"
				/>
			</div>
			<button type="submit" class="btn btn-primary mt-4 flex w-full justify-center">
				Create Account
			</button>
			{#if errorMessage}
				<span style="color:red;">{errorMessage}</span>
			{/if}
			<p>Already have an account? <a href="/">Sign in</a>.</p>
		</form>
	</div>
</div>
