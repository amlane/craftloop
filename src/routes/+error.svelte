<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Brand from '../routes/brand.svelte';
	import BrandIcon from '../routes/brand-icon.svelte';
</script>

<div class="app error-container">
	<header class="top-bar mt-6 mb-4">
		<div class="brand flex justify-between">
			<Brand />
			<div class="flex items-center">
				<a class="btn btn-primary mr-2" id="newBtn" href={resolve('/projects')}>
					Back to Projects
				</a>
				<a class="btn btn-secondary" id="newBtn" href={resolve('/profile')}>Profile</a>
			</div>
		</div>
	</header>
	<div class="empty flex flex-col items-center justify-center py-16 text-center">
		<BrandIcon fill="gray" />
		{#if page.status === 404}
			<h2 class="title-text pb-4 text-2xl font-bold">404: Not Found.</h2>
			<p class="pb-6 text-sm leading-relaxed">Oops! The page you are looking for doesn't exist.</p>
		{:else}
			<h2 class="title-text pb-4 text-2xl font-bold">Error {page.status}</h2>
			<p class="pb-6 text-sm leading-relaxed">{page.error?.message || 'Something went wrong.'}</p>
		{/if}
	</div>
</div>
