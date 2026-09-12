<script>
	import Brand from '../brand.svelte';
	import PlusIcon from '../plus-icon.svelte';
	import BrandIcon from '../brand-icon.svelte';

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
<div class="projects flex justify-center">
	<div class="empty flex flex-col items-center justify-center py-16 text-center">
		<BrandIcon fill="gray" />
		<h2 class="title-text pb-4 text-2xl font-bold">Your pattern box is empty</h2>
		<p class="pb-6 text-sm leading-relaxed">
			Every pattern you design — gauge, hook, row-by-row — kept in one place instead of a notebook
			you'll misplace. Start with your next project, or edit the example below.
		</p>
		<button class="btn btn-primary" id="newBtn">Start a Pattern</button>
	</div>
</div>
