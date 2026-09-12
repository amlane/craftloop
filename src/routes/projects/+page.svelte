<script>
	import Brand from '../brand.svelte';
	import PlusIcon from '../plus-icon.svelte';
	import BrandIcon from '../brand-icon.svelte';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SearchIcon from '../search-icon.svelte';
</script>

<div class="app">
	<header class="top-bar mt-6 mb-4">
		<div class="brand flex justify-between">
			<Brand />
			<div class="flex items-center">
				<a class="btn btn-primary mr-2" id="newBtn" href="/pattern">
					<PlusIcon />
					New pattern
				</a>
				<a class="btn btn-secondary" id="newBtn" href="/profile">Profile</a>
			</div>
		</div>
	</header>
	<div class="projects flex flex-col justify-center">
		<div class="filterbar">
			<div class="search">
				<SearchIcon />
				<input id="searchInput" type="text" placeholder="Search patterns, yarn, tags…" value="" />
			</div>
			<div class="chips" id="filterChips">
				<button class="chip" data-key="all" aria-pressed="false">All</button><button
					class="chip"
					data-key="draft"
					aria-pressed="false"
					><span class="dot" style="background:var(--mustard)"></span>Draft</button
				><button class="chip" data-key="tested" aria-pressed="false"
					><span class="dot" style="background:var(--teal)"></span>Tested</button
				><button class="chip" data-key="etsy" aria-pressed="true"
					><span class="dot" style="background:var(--plum)"></span>Done</button
				>
			</div>
		</div>
		<div class="empty flex flex-col items-center justify-center py-16 text-center">
			<BrandIcon fill="gray" />
			<h2 class="title-text pb-4 text-2xl font-bold">Your pattern box is empty</h2>
			<p class="pb-6 text-sm leading-relaxed">
				Every pattern you design — gauge, hook, row-by-row — kept in one place instead of a notebook
				you'll misplace. Start with your next project, or edit the example below.
			</p>
			<a class="btn btn-primary" id="newBtn" href="/pattern">Start a Pattern</a>
		</div>
	</div>
</div>
