<script>
	let username = $state('');
	let password = $state('');

	function handleSubmit() {
		console.log('Logging in with:', { username, password });
		// update with request to node.js backend
		sendData();
	}

	let responseMessage = $state('Loading...');

	async function sendData() {
		try {
			const response = await fetch('http://localhost:8000/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: username, password: password }) // Must stringify the body
			});

			const data = await response.json();
			responseMessage = data.message;
			console.log(responseMessage);
		} catch (error) {
			responseMessage = 'Error sending data.';
			console.error(error);
		}
	}
</script>

<div class="flex justify-center bg-gray-50 p-4">
	<div class="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-md">
		<h2 class="mb-6 text-center text-xl font-bold text-gray-900">Sign In</h2>
		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<label
					for="username"
					class="mb-1 block text-xs font-medium tracking-wider text-gray-500 uppercase"
				>
					Username
				</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					required
					class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					placeholder="Enter your username"
				/>
			</div>
			<div>
				<label
					for="password"
					class="mb-1 block text-xs font-medium tracking-wider text-gray-500 uppercase"
				>
					Password
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					placeholder="••••••••"
				/>
			</div>
			<button
				type="submit"
				class="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700 active:scale-[0.98]"
			>
				Sign In
			</button>
		</form>
	</div>
</div>
