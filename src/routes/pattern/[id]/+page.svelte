<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import Brand from '../../brand.svelte';
	import ChevronLeftIcon from '../../chevron-left-icon.svelte';

	const WEIGHTS = [
		'Lace (0)',
		'Super Fine (1)',
		'Fine (2)',
		'Light (3)',
		'Medium / Worsted (4)',
		'Bulky (5)',
		'Super Bulky (6)',
		'Jumbo (7)'
	];

	const STATUSES = [
		{ key: 'draft', label: 'Draft' },
		{ key: 'tested', label: 'Tested' },
		{ key: 'done', label: 'Done' }
	];

	function uid() {
		return Math.random().toString(36).slice(2, 10);
	}

	function emptyEntry(type, n) {
		return { id: uid(), label: `${type || 'Row'} ${n || 1}`, instructions: '', count: '' };
	}

	function emptySection(type = 'Row') {
		return {
			id: uid(),
			name: type === 'Rnd' ? 'Body' : 'New section',
			type,
			entries: [emptyEntry(type, 1)]
		};
	}

	// Working draft for a brand-new pattern. Nothing here is persisted yet —
	// the backend for creating/saving/deleting patterns isn't wired up.
	let pattern = $state({
		title: '',
		status: 'draft',
		yarnBrand: '',
		yarnColorway: '',
		yarnWeight: WEIGHTS[4],
		hook: '',
		gauge: '',
		finishedSize: '',
		tags: [],
		sections: [],
		notes: '',
		photos: []
	});

	// Treats null/undefined the same as '' before comparing. The API can
	// return null for an unset text field, but clearing that field's input
	// always writes back '' — without this, that'd read as a permanent
	// unsaved change even though the field is back to how it loaded.
	function normalize(value) {
		if (value === null || value === undefined) return '';
		if (Array.isArray(value)) return value.map(normalize);
		if (typeof value === 'object') {
			const out = {};
			for (const key of Object.keys(value).sort()) out[key] = normalize(value[key]);
			return out;
		}
		return value;
	}

	function snapshotOf(value) {
		return JSON.stringify(normalize(value));
	}

	// Snapshot of `pattern` as it exists on the server — set whenever we load
	// or successfully save. Comparing the live `pattern` against this is how
	// we know there are unsaved edits, instead of guessing from a flag.
	// svelte-ignore state_referenced_locally
	let savedSnapshot = $state(snapshotOf(pattern));

	onMount(() => {
		let data = $state({});
		if (browser) {
			const jwtToken = localStorage.getItem('token');
			if (jwtToken) {
				async function fetchData() {
					try {
						const patternId = page.params.id;
						const response = await fetch(`http://localhost:8000/api/patterns/${patternId}`, {
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								Authorization: 'Bearer ' + jwtToken
							}
						});

						data = await response.json();
						if (response.status === 404) {
							goto(resolve('/404'), { replaceState: true });
							return;
						}
					} catch (error) {
						console.error('Failed to fetch:', error);
					} finally {
						pattern = data;
						savedSnapshot = snapshotOf(data);
					}
				}

				fetchData();
			}
		}
	});

	let tagInput = $state('');
	let confirmingDelete = $state(false);
	let saveState = $state('idle'); // idle | saving | error
	let hasUnsavedChanges = $derived(snapshotOf(pattern) !== savedSnapshot);
	let saveStatusClass = $derived(
		saveState === 'saving'
			? 'saving'
			: saveState === 'error'
				? 'error'
				: hasUnsavedChanges
					? 'unsaved'
					: 'saved'
	);

	function addTag(e) {
		if (e.key !== 'Enter') return;
		e.preventDefault();
		const value = tagInput.trim();
		if (!value) return;
		pattern.tags.push(value);
		tagInput = '';
	}

	function removeTag(index) {
		pattern.tags.splice(index, 1);
	}

	function addSection() {
		pattern.sections.push(emptySection('Row'));
	}

	function removeSection(sectionIndex) {
		pattern.sections.splice(sectionIndex, 1);
	}

	function setSectionType(sectionIndex, type) {
		pattern.sections[sectionIndex].type = type;
	}

	function addEntry(sectionIndex) {
		const section = pattern.sections[sectionIndex];
		section.entries.push(emptyEntry(section.type, section.entries.length + 1));
	}

	function removeEntry(sectionIndex, entryIndex) {
		pattern.sections[sectionIndex].entries.splice(entryIndex, 1);
	}

	function addPhoto(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		pattern.photos.push({ id: uid(), url: URL.createObjectURL(file), caption: '' });
		e.target.value = '';
	}

	function removePhoto(index) {
		const [removed] = pattern.photos.splice(index, 1);
		if (removed) URL.revokeObjectURL(removed.url);
	}

	async function handleSave() {
		saveState = 'saving';
		try {
			let jwt = '';
			if (browser) {
				jwt = localStorage.getItem('token');
			}
			const payload = JSON.stringify(pattern);
			const response = await fetch(`http://localhost:8000/api/patterns/${pattern.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + jwt
				},
				body: payload
			});

			const resData = await response.json();
			if (response.ok) {
				saveState = 'idle';
				savedSnapshot = snapshotOf(pattern);
			} else {
				saveState = 'error';
				console.log('Error saving pattern: ', resData);
			}
		} catch (error) {
			console.error(error);
			saveState = 'error';
		}
	}

	async function handleDelete() {
		confirmingDelete = false;
		try {
			let jwt = '';
			if (browser) {
				jwt = localStorage.getItem('token');
			}
			const response = await fetch(`http://localhost:8000/api/patterns/${pattern.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + jwt
				}
			});

			if (response.ok) {
				// redirect user back to projects route
				goto(resolve('/projects'));
			} else {
				console.log('Response: ', response);
			}
		} catch (error) {
			console.error(error);
			saveState = 'error';
		}
	}
</script>

<div class="app pattern-page">
	<header class="top-bar mt-6 mb-4">
		<div class="brand flex justify-between">
			<Brand />
		</div>
	</header>

	<a class="back" href="/projects">
		<ChevronLeftIcon />
		All patterns
	</a>

	<div class="detail">
		<div class="sheet-head">
			<input
				class="title-input display"
				placeholder="Untitled pattern"
				bind:value={pattern.title}
			/>
			<div class="head-actions">
				<div class="status-seg">
					{#each STATUSES as s (s.key)}
						<button
							type="button"
							data-s={s.key}
							aria-pressed={pattern.status === s.key}
							onclick={() => (pattern.status = s.key)}
						>
							{s.label}
						</button>
					{/each}
				</div>
				{#if confirmingDelete}
					<div class="confirm-row">
						Delete this pattern?
						<button class="btn btn-sm btn-danger" onclick={handleDelete}>Delete</button>
						<button class="btn btn-sm btn-ghost" onclick={() => (confirmingDelete = false)}
							>Cancel</button
						>
					</div>
				{:else}
					<button class="btn btn-sm btn-ghost" onclick={() => (confirmingDelete = true)}
						>Delete</button
					>
				{/if}
			</div>
		</div>

		<div class="field-grid">
			<div class="field">
				<label for="yarnBrand">Yarn brand</label>
				<input
					id="yarnBrand"
					type="text"
					placeholder="e.g. Lion Brand"
					bind:value={pattern.yarnBrand}
				/>
			</div>
			<div class="field">
				<label for="yarnColorway">Colorway</label>
				<input
					id="yarnColorway"
					type="text"
					placeholder="e.g. Marigold"
					bind:value={pattern.yarnColorway}
				/>
			</div>
			<div class="field">
				<label for="yarnWeight">Weight</label>
				<select id="yarnWeight" bind:value={pattern.yarnWeight}>
					{#each WEIGHTS as w (w)}
						<option value={w}>{w}</option>
					{/each}
				</select>
			</div>
			<div class="field">
				<label for="hook">Hook size</label>
				<input id="hook" type="text" placeholder="e.g. H-8 (5.0 mm)" bind:value={pattern.hook} />
			</div>
			<div class="field">
				<label for="gauge">Gauge</label>
				<input
					id="gauge"
					type="text"
					placeholder={'e.g. 14 sc x 16 rows = 4"'}
					bind:value={pattern.gauge}
				/>
			</div>
			<div class="field">
				<label for="finishedSize">Finished size</label>
				<input
					id="finishedSize"
					type="text"
					placeholder={'e.g. 18" x 22"'}
					bind:value={pattern.finishedSize}
				/>
			</div>
		</div>

		<div class="tags-field">
			<h3 class="section-label">Tags</h3>
			<div class="tags-row">
				{#each pattern.tags as tag, i (tag + i)}
					<span class="tag-pill editable">
						{tag}
						<button type="button" aria-label="Remove tag" onclick={() => removeTag(i)}
							>&times;</button
						>
					</span>
				{/each}
				<input
					class="tag-add"
					placeholder="+ tag, Enter"
					bind:value={tagInput}
					onkeydown={addTag}
				/>
			</div>
		</div>

		<h3 class="section-label">Pattern</h3>
		<div class="sections-wrap">
			{#if pattern.sections.length === 0}
				<div class="banner">
					No sections yet — add one for each part of the pattern (body, sleeve, edging…).
				</div>
			{:else}
				{#each pattern.sections as section, si (section.id)}
					<div class="section-block">
						<div class="section-head">
							<input class="section-name" placeholder="Section name" bind:value={section.name} />
							<div class="type-toggle">
								<button
									type="button"
									aria-pressed={section.type === 'Row'}
									onclick={() => setSectionType(si, 'Row')}>Rows</button
								>
								<button
									type="button"
									aria-pressed={section.type === 'Rnd'}
									onclick={() => setSectionType(si, 'Rnd')}>Rounds</button
								>
							</div>
							<button class="btn btn-sm btn-ghost" onclick={() => removeSection(si)}>Remove</button>
						</div>
						<div class="entry-head">
							<span>Label</span><span>Instructions</span><span>Count</span><span></span>
						</div>
						<div class="entries">
							{#each section.entries as entry, ei (entry.id)}
								<div class="entry">
									<input class="label mono" bind:value={entry.label} />
									<textarea
										class="instr"
										rows="1"
										placeholder="sc in each st around…"
										bind:value={entry.instructions}></textarea>
									<div class="count-wrap">
										<input class="count mono" inputmode="numeric" bind:value={entry.count} />
									</div>
									<button class="rm" aria-label="Remove" onclick={() => removeEntry(si, ei)}
										>&times;</button
									>
								</div>
							{/each}
						</div>
						<div class="section-foot">
							<button class="btn btn-sm" onclick={() => addEntry(si)}
								>+ Add {section.type === 'Rnd' ? 'round' : 'row'}</button
							>
						</div>
					</div>
				{/each}
			{/if}
		</div>
		<button class="btn add-section" onclick={addSection}>+ Add section</button>

		<h3 class="section-label">Notes &amp; mods</h3>
		<textarea
			class="notes-area"
			placeholder="Anything that will help future-you: swap ideas, what went wrong, sizing tweaks, why round 8 has a decrease…"
			bind:value={pattern.notes}></textarea>

		<h3 class="section-label">Photos</h3>
		<div class="photos-grid">
			{#each pattern.photos as photo, i (photo.id)}
				<div class="photo-tile">
					<img src={photo.url} alt="" />
					<div class="cap-row">
						<input placeholder="Caption" bind:value={photo.caption} />
						<button class="rm" aria-label="Remove photo" onclick={() => removePhoto(i)}
							>&times;</button
						>
					</div>
				</div>
			{/each}
			<label class="add-photo">
				<svg viewBox="0 0 24 24" fill="none"
					><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"
					></path></svg
				>
				<span>Add photo</span>
				<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onchange={addPhoto} />
			</label>
		</div>
	</div>

	<div class="savebar">
		<div class="savebar-inner">
			<span class="save-status {saveStatusClass}">
				<span class="dot"></span>
				{#if saveState === 'saving'}
					Saving…
				{:else if saveState === 'error'}
					Couldn't save — try again
				{:else if hasUnsavedChanges}
					Unsaved changes
				{:else}
					Saved
				{/if}
			</span>
			<button class="btn btn-primary" onclick={handleSave}>Save</button>
		</div>
	</div>
</div>

<style>
	.pattern-page {
		max-width: 1080px;
		margin: 0 auto;
		padding-bottom: 100px;
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: none;
		border: none;
		color: var(--ink-soft);
		font-size: 0.88rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		padding: 8px 0 6px;
	}
	.back:hover {
		color: var(--ink);
	}
	.back :global(svg) {
		width: 15px;
		height: 15px;
	}

	.sheet-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--line);
		margin-bottom: 20px;
		margin-top: 8px;
		flex-wrap: wrap;
	}
	.title-input {
		font-family: 'Fraunces', Georgia, serif;
		font-weight: 600;
		font-size: 2rem;
		background: none;
		border: none;
		color: var(--ink);
		width: 100%;
		max-width: 520px;
		padding: 2px 0;
	}
	.title-input::placeholder {
		color: var(--ink-soft);
		opacity: 0.6;
		font-style: italic;
	}
	.head-actions {
		display: flex;
		gap: 8px;
		align-items: center;
		flex-shrink: 0;
	}

	.status-seg {
		display: flex;
		border: 1px solid var(--line);
		border-radius: 8px;
		overflow: hidden;
	}
	.status-seg button {
		border: none;
		background: var(--card);
		color: var(--ink-soft);
		padding: 8px 13px;
		font-size: 0.8rem;
		font-weight: 700;
		cursor: pointer;
		border-right: 1px solid var(--line);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}
	.status-seg button:last-child {
		border-right: none;
	}
	.status-seg button[aria-pressed='true'] {
		color: #fff;
	}
	.status-seg button[data-s='draft'][aria-pressed='true'] {
		background: var(--mustard);
	}
	.status-seg button[data-s='tested'][aria-pressed='true'] {
		background: var(--teal);
	}
	.status-seg button[data-s='done'][aria-pressed='true'] {
		background: var(--plum);
	}

	.confirm-row {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
	}

	.field-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px 20px;
		margin-bottom: 26px;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.field label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.field input,
	.field select {
		border: none;
		border-bottom: 1px solid var(--line);
		background: none;
		color: var(--ink);
		padding: 6px 2px;
		font-size: 0.95rem;
		font-family: 'IBM Plex Mono', monospace;
	}
	.field select {
		font-family: 'Karla', sans-serif;
	}
	.field input::placeholder {
		font-family: 'Karla', sans-serif;
		font-style: italic;
		color: var(--ink-soft);
		opacity: 0.7;
	}
	.field input:focus,
	.field select:focus {
		border-bottom-color: var(--focus);
		outline: none;
	}

	h3.section-label {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin: 0 0 10px;
	}

	.tags-field {
		margin-bottom: 28px;
	}
	.tags-row {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		align-items: center;
	}
	.tag-pill {
		font-size: 0.72rem;
		padding: 3px 9px;
		border-radius: 99px;
		border: 1px solid var(--line);
		color: var(--ink-soft);
	}
	.tag-pill.editable {
		display: flex;
		align-items: center;
		gap: 5px;
		padding-right: 5px;
	}
	.tag-pill.editable button {
		background: none;
		border: none;
		color: var(--ink-soft);
		cursor: pointer;
		font-size: 0.9rem;
		line-height: 1;
		padding: 0;
	}
	.tag-add {
		border: 1px dashed var(--line);
		background: none;
		color: var(--ink-soft);
		padding: 4px 10px;
		border-radius: 99px;
		font-size: 0.78rem;
		min-width: 90px;
	}

	.banner {
		border: 1px solid var(--line);
		background: var(--card);
		border-left: 4px solid var(--mustard);
		padding: 10px 14px;
		border-radius: 8px;
		font-size: 0.85rem;
		color: var(--ink-soft);
		margin-bottom: 16px;
	}

	.section-block {
		border: 1px solid var(--line);
		border-radius: 10px;
		background: var(--card);
		margin-bottom: 16px;
		overflow: hidden;
	}
	.section-head {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 14px;
		border-bottom: 1px solid var(--line);
		flex-wrap: wrap;
	}
	.section-name {
		font-family: 'Fraunces', serif;
		font-weight: 600;
		font-size: 1.05rem;
		background: none;
		border: none;
		color: var(--ink);
		flex: 1 1 140px;
		min-width: 100px;
	}
	.type-toggle {
		display: flex;
		border: 1px solid var(--line);
		border-radius: 7px;
		overflow: hidden;
		flex-shrink: 0;
	}
	.type-toggle button {
		border: none;
		background: none;
		color: var(--ink-soft);
		padding: 5px 10px;
		font-size: 0.72rem;
		font-weight: 700;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}
	.type-toggle button[aria-pressed='true'] {
		background: var(--ink);
		color: var(--paper);
	}

	.entry-head {
		display: grid;
		grid-template-columns: 76px 1fr 90px 30px;
		gap: 8px;
		padding: 0 14px;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.entries {
		padding: 6px 14px 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.entry {
		display: grid;
		grid-template-columns: 76px 1fr 90px 30px;
		gap: 8px;
		align-items: start;
	}
	.entry input.label {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.82rem;
		font-weight: 600;
		border: 1px solid var(--line);
		border-radius: 6px;
		background: var(--paper);
		color: var(--ink);
		padding: 7px 6px;
		text-align: center;
	}
	.entry textarea.instr {
		border: 1px solid var(--line);
		border-radius: 6px;
		background: var(--paper);
		color: var(--ink);
		padding: 7px 9px;
		font-size: 0.9rem;
		font-family: 'Karla', sans-serif;
		resize: vertical;
		min-height: 36px;
		line-height: 1.4;
	}
	.entry .count-wrap {
		position: relative;
	}
	.entry input.count {
		width: 100%;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.82rem;
		border: 1px solid var(--line);
		border-radius: 6px;
		background: var(--paper);
		color: var(--ink);
		padding: 7px 26px 7px 8px;
		text-align: right;
	}
	.entry .count-wrap::after {
		content: 'st';
		position: absolute;
		right: 7px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.68rem;
		color: var(--ink-soft);
		pointer-events: none;
	}
	.entry .rm {
		border: none;
		background: none;
		color: var(--ink-soft);
		cursor: pointer;
		font-size: 1rem;
		padding: 6px;
		line-height: 1;
	}
	.entry .rm:hover {
		color: var(--danger);
	}

	.section-foot {
		padding: 0 14px 12px;
	}
	.add-section {
		margin-bottom: 26px;
	}

	.notes-area {
		width: 100%;
		min-height: 150px;
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 16px 18px;
		font-family: 'Karla', sans-serif;
		font-size: 0.95rem;
		line-height: 26px;
		color: var(--ink);
		background:
			repeating-linear-gradient(
				to bottom,
				transparent 0,
				transparent 25px,
				var(--line-soft) 25px,
				var(--line-soft) 26px
			),
			var(--card);
		resize: vertical;
		margin-bottom: 28px;
	}
	.notes-area:focus {
		outline: none;
		border-color: var(--focus);
	}

	.photos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 12px;
		margin-bottom: 30px;
	}
	.photo-tile {
		border: 1px solid var(--line);
		border-radius: 10px;
		overflow: hidden;
		background: var(--card);
	}
	.photo-tile img {
		width: 100%;
		aspect-ratio: 4/3;
		object-fit: cover;
		display: block;
	}
	.photo-tile .cap-row {
		display: flex;
		gap: 4px;
		padding: 6px;
		align-items: center;
	}
	.photo-tile input {
		flex: 1;
		border: none;
		background: none;
		font-size: 0.76rem;
		color: var(--ink);
		padding: 2px;
	}
	.photo-tile .rm {
		background: none;
		border: none;
		color: var(--ink-soft);
		cursor: pointer;
		font-size: 0.85rem;
	}
	.photo-tile .rm:hover {
		color: var(--danger);
	}
	.add-photo {
		border: 1px dashed var(--line);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
		aspect-ratio: 4/3;
		color: var(--ink-soft);
		font-size: 0.78rem;
		cursor: pointer;
		background: none;
	}
	.add-photo:hover {
		border-color: var(--ink-soft);
		color: var(--ink);
	}
	.add-photo svg {
		width: 20px;
		height: 20px;
	}
	.add-photo input {
		display: none;
	}

	.savebar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--card);
		border-top: 1px solid var(--line);
		padding: 12px 20px;
		display: flex;
		justify-content: center;
		z-index: 10;
	}
	.savebar-inner {
		max-width: 1080px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.save-status {
		font-size: 0.82rem;
		color: var(--ink-soft);
		display: flex;
		align-items: center;
		gap: 7px;
	}
	.save-status .dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--ink-soft);
	}
	.save-status.saved .dot {
		background: var(--teal);
	}
	.save-status.saving .dot {
		background: var(--mustard);
	}
	.save-status.error .dot {
		background: var(--danger);
	}

	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr 1fr;
		}
		.entry {
			grid-template-columns: 1fr;
		}
		.entry-head {
			display: none;
		}
		.entry .count-wrap {
			max-width: 120px;
		}
		.title-input {
			font-size: 1.5rem;
		}
		.sheet-head {
			flex-direction: column;
			align-items: stretch;
		}
		.head-actions {
			justify-content: space-between;
		}
	}
	@media (max-width: 420px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
