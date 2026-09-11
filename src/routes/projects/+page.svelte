<script>
	import Brand from '../brand.svelte';
	import PlusIcon from '../plus-icon.svelte';
</script>

<header class="top-bar mx-12 mt-8 mb-4">
	<div class="brand flex justify-between">
		<Brand />
		<button class="btn btn-primary" id="newBtn">
			<PlusIcon />
			New pattern
		</button>
	</div>
</header>
