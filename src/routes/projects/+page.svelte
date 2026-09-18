<script>
	import Brand from '../brand.svelte';
	import PlusIcon from '../plus-icon.svelte';
	import BrandIcon from '../brand-icon.svelte';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import SearchIcon from '../search-icon.svelte';
	let data = $state.snapshot(null);
	let allPatterns = $state([]);
	let patternData = $state([]);
	let loading = $state(true);
	onMount(() => {
		if (browser) {
			const jwtToken = localStorage.getItem('token');
			if (jwtToken) {
				async function fetchData() {
					try {
						const userId = JSON.parse(atob(jwtToken.split('.')[1]))['subject'];
						const response = await fetch(`http://localhost:8000/api/users/${userId}/patterns`, {
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
						patternData = data.user.patterns;
						allPatterns = data.user.patterns;
						loading = false;
					}
				}

				fetchData();
			}
		}
	});

	let searchText = $state('');

	function filterPatterns() {
		let q = event.target.value.toLowerCase().trim();
		patternData = allPatterns.filter((val) => {
			return [val.title, val.yarnWeight, ...(val.tags ?? [])].join(' ').toLowerCase().includes(q);
		});
	}

	function timeAgo(timestamp) {
		const now = new Date();
		const past = new Date(timestamp);
		const msPerDay = 24 * 60 * 60 * 1000;

		// Calculate the difference in days
		const diffInDays = Math.round((past - now) / msPerDay);

		// Format the output
		const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
		return rtf.format(diffInDays, 'day');
	}

	const STATUS_INFO = {
		draft: { label: 'Draft', color: 'var(--mustard)' },
		tested: { label: 'Tested', color: 'var(--teal)' },
		done: { label: 'Done', color: 'var(--plum)' }
	};

	function statusInfo(key) {
		return STATUS_INFO[key] ?? STATUS_INFO.draft;
	}

	// Deterministic placeholder gradient for patterns without a photo yet,
	// so cards don't all look identical while photos aren't wired up.
	function swatchGradient(seed) {
		const colors = ['#E1552F', '#1B7368', '#B9791A', '#7A3F68'];
		let h = 0;
		for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
		const a = colors[Math.abs(h) % colors.length];
		const b = colors[Math.abs(h >> 3) % colors.length];
		return `repeating-linear-gradient(45deg, ${a}22, ${a}22 10px, ${b}18 10px, ${b}18 20px)`;
	}

	async function createNewPattern() {
		try {
			let jwt = '';
			if (browser) {
				jwt = localStorage.getItem('token');
			}
			const response = await fetch('http://localhost:8000/api/patterns', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + jwt
				},
				body: JSON.stringify({}) // Create empty pattern with default values
			});

			const resData = await response.json();
			if (response.ok) {
				// Redirect to the pattern/:id route for edits
				goto(resolve(`/pattern/${resData.id}`));
			} else {
				console.log('Error saving pattern: ', resData);
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="app">
	<header class="top-bar mt-6 mb-4">
		<div class="brand flex justify-between">
			<Brand />
			<div class="flex items-center">
				<button class="btn btn-primary mr-2" id="newBtn" onclick={createNewPattern}>
					<PlusIcon />
					New pattern
				</button>
				<a class="btn btn-secondary" id="newBtn" href="/profile">Profile</a>
			</div>
		</div>
	</header>
	<div class="projects flex flex-col justify-center">
		<div class="filterbar">
			<div class="search">
				<SearchIcon />
				<input
					id="searchInput"
					type="text"
					placeholder="Search patterns, yarn, tags…"
					value={searchText}
					oninput={filterPatterns}
				/>
			</div>
			<div class="chips" id="filterChips">
				<button class="chip" data-key="all" aria-pressed="false">All</button><button
					class="chip"
					data-key="draft"
					aria-pressed="false"
					><span class="dot" style="background:var(--mustard)"></span>Draft</button
				><button class="chip" data-key="tested" aria-pressed="false"
					><span class="dot" style="background:var(--teal)"></span>Tested</button
				><button class="chip" data-key="done" aria-pressed="true"
					><span class="dot" style="background:var(--plum)"></span>Done</button
				>
			</div>
		</div>
		{#if loading || allPatterns.length === 0}
			<div class="empty flex flex-col items-center justify-center py-16 text-center">
				<BrandIcon fill="gray" />
				<h2 class="title-text pb-4 text-2xl font-bold">Your pattern box is empty</h2>
				<p class="pb-6 text-sm leading-relaxed">
					Every pattern you design — gauge, hook, row-by-row — kept in one place instead of a
					notebook you'll misplace. Start with your next project, or edit the example below.
				</p>
				<button class="btn btn-primary" id="newBtn" onclick={createNewPattern}
					>Start a Pattern</button
				>
			</div>
		{:else if patternData.length === 0}
			<div class="empty flex flex-col items-center justify-center py-16 text-center">
				<BrandIcon fill="gray" />
				<h2 class="title-text pb-4 text-2xl font-bold">No matches</h2>
				<p class="pb-6 text-sm leading-relaxed">Try a different search or filter.</p>
			</div>
		{:else}
			<div class="grid">
				{#each patternData as p (p.id)}
					<a class="card" href="/pattern/{p.id}">
						<div class="card-photo">
							{#if p.photos?.[0]?.url}
								<img src={p.photos[0].url} alt="" />
							{:else}
								<div
									class="swatch"
									style="background:{swatchGradient(String(p.id ?? p.title ?? ''))}"
								></div>
							{/if}
							<span class="status-pip" style="background:{statusInfo(p.status).color}"
								>{statusInfo(p.status).label}</span
							>
						</div>
						<div class="card-body">
							<p class="card-title display" class:untitled={!p.title}>
								{p.title || 'Untitled pattern'}
							</p>
							{#if p.hook || p.yarnWeight || p.gauge}
								<div class="card-meta mono">
									{#if p.hook}<span>{p.hook}</span>{/if}
									{#if p.yarnWeight}<span>{p.yarnWeight.replace(/\s*\(\d\)$/, '')}</span>{/if}
									{#if p.gauge}<span>{p.gauge}</span>{/if}
								</div>
							{/if}
							{#if p.tags?.length}
								<div class="card-tags">
									{#each p.tags.slice(0, 4) as tag (tag)}
										<span class="tag-pill">{tag}</span>
									{/each}
								</div>
							{/if}
							<div class="card-footer">
								<span>{timeAgo(p.updatedAt ?? p.createdAt)}</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 16px;
		padding-block: 4px 60px;
	}
	.card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition:
			border-color 0.15s ease,
			transform 0.1s ease;
	}
	.card:hover {
		border-color: var(--ink-soft);
		transform: translateY(-1px);
	}
	.card-photo {
		aspect-ratio: 16 / 10;
		background: var(--line-soft);
		position: relative;
		overflow: hidden;
	}
	.card-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.card-photo .swatch {
		width: 100%;
		height: 100%;
	}
	.status-pip {
		position: absolute;
		top: 10px;
		left: 10px;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 4px 9px;
		border-radius: 99px;
		color: #fff;
	}
	.card-body {
		padding: 13px 14px 14px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}
	.card-title {
		font-size: 1.15rem;
		line-height: 1.15;
		margin: 0;
	}
	.card-title.untitled {
		color: var(--ink-soft);
		font-style: italic;
		font-weight: 500;
	}
	.card-meta {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		font-size: 0.74rem;
		color: var(--ink-soft);
		margin: 0;
	}
	.card-meta span {
		background: var(--line-soft);
		padding: 3px 8px;
		border-radius: 6px;
	}
	.card-tags {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
		margin-top: auto;
	}
	.tag-pill {
		font-size: 0.72rem;
		padding: 3px 9px;
		border-radius: 99px;
		border: 1px solid var(--line);
		color: var(--ink-soft);
	}
	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.7rem;
		color: var(--ink-soft);
		margin-top: 2px;
	}
</style>
