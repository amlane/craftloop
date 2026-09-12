<script>
	import Brand from '../brand.svelte';
	import PlusIcon from '../plus-icon.svelte';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	function logout() {
		localStorage.removeItem('token');
		goto(resolve('/'));
	}
</script>

<button onclick={logout} class="fixed top-0 right-0 pr-4 text-sm" id="logoutBtn">logout</button>
<header class="top-bar mx-12 mt-8 mb-4">
	<div class="brand flex justify-between">
		<Brand />
		<button class="btn btn-primary" id="newBtn">
			<PlusIcon />
			New pattern
		</button>
	</div>
</header>
