<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Brand from './brand.svelte';
	import BrandIcon from './brand-icon.svelte';

	onMount(() => {
		// if valid session token, redirect user to projects page
		if (browser) {
			const jwtToken = localStorage.getItem('token');
			if (jwtToken) {
				goto(resolve('/projects'));
			}
		}
	});

	const SHOT_PATTERNS = [
		{
			title: 'Granny Square Coaster',
			statusLabel: 'Tested',
			statusColor: 'var(--teal)',
			gradient: 'shot-gradient-1',
			hook: 'I-9 (5.5 mm)',
			weight: 'Worsted',
			tags: ['coaster', 'granny-square']
		},
		{
			title: 'Ripple Baby Blanket',
			statusLabel: 'Draft',
			statusColor: 'var(--mustard)',
			gradient: 'shot-gradient-2',
			hook: 'H-8 (5.0 mm)',
			weight: 'DK',
			tags: ['blanket', 'baby']
		},
		{
			title: 'Amigurumi Fox',
			statusLabel: 'Done',
			statusColor: 'var(--plum)',
			gradient: 'shot-gradient-3',
			hook: 'D-3 (3.25 mm)',
			weight: 'Fine',
			tags: ['amigurumi', 'fox']
		}
	];

	const FEATURES = [
		{
			title: 'Every detail, not just the fun part',
			description:
				"Yarn, colorway, weight, hook size, gauge, finished size — the essential stuff gets its own field, so it's never buried in a paragraph you have to re-read."
		},
		{
			title: 'Row by row, round by round',
			description:
				'Write instructions the way a real pattern reads: numbered rows or rounds with a stitch count beside each one, grouped into sections like Body, Sleeve, or Edging.'
		},
		{
			title: 'See what you actually made',
			description:
				'Attach photos of the finished piece — or the WIP that went sideways — right next to the notes, so future-you remembers what "looks right" was supposed to look like.'
		},
		{
			title: 'Room for the messy parts',
			description:
				"A notes section for mods, mistakes, and the swaps you'll definitely make again next time — because half of designing is remembering what went wrong."
		}
	];
</script>

<header class="top-bar mt-6 mb-4">
	<div class="brand flex justify-between">
		<Brand />
		<div class="flex items-center">
			<a class="btn btn-primary mr-2" id="login" href={resolve('/login')}>Login</a>
			<a class="btn btn-secondary" id="signup" href={resolve('/signup')}>Sign up</a>
		</div>
	</div>
</header>

<div class="landing-page">
	<section class="hero">
		<h1 class="display hero-h1">Every pattern you make, actually written down.</h1>
		<p class="hero-sub">
			craftloop is where you keep the yarn, the hook, the gauge, and every row — so the thing you
			improvised last winter isn't gone the moment you finish it.
		</p>
		<div class="cta-row">
			<a class="btn btn-primary" href={resolve('/signup')}>Sign up free</a>
			<a class="btn btn-secondary" href={resolve('/login')}>Log in</a>
		</div>
	</section>

	<section class="product-shot section-pad">
		<div class="shot-frame">
			<div class="shot-titlebar">
				<span class="shot-dot"></span>
				<span class="shot-dot"></span>
				<span class="shot-dot"></span>
			</div>
			<div class="shot-body">
				<div class="shots-grid">
					{#each SHOT_PATTERNS as p (p.title)}
						<div class="shot-card">
							<div class="shot-photo {p.gradient}">
								<span class="shot-pill" style="background:{p.statusColor}">{p.statusLabel}</span>
							</div>
							<div class="shot-card-body">
								<p class="display shot-title">{p.title}</p>
								<div class="shot-meta mono">
									<span>{p.hook}</span><span>{p.weight}</span>
								</div>
								<div class="shot-tags">
									{#each p.tags as tag (tag)}
										<span class="tag-pill">{tag}</span>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="features section-pad">
		<h2 class="display features-heading">Built like a real pattern, not a sticky note</h2>
		<div class="feat-grid">
			<div class="feat-card">
				<svg width="26" height="26" viewBox="0 0 24 24" fill="none">
					<path
						d="M3 12.5V5a2 2 0 0 1 2-2h7.5L21 10.5a2 2 0 0 1 0 2.8l-6.7 6.7a2 2 0 0 1-2.8 0L3 12.5Z"
						stroke="var(--coral)"
						stroke-width="1.8"
						stroke-linejoin="round"
					/>
					<circle cx="8.2" cy="7.8" r="1.4" stroke="var(--coral)" stroke-width="1.8" />
				</svg>
				<h3>{FEATURES[0].title}</h3>
				<p>{FEATURES[0].description}</p>
			</div>
			<div class="feat-card">
				<svg width="26" height="26" viewBox="0 0 24 24" fill="none">
					<circle cx="4" cy="6" r="1.6" fill="var(--coral)" />
					<line
						x1="9"
						y1="6"
						x2="21"
						y2="6"
						stroke="var(--coral)"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
					<circle cx="4" cy="12" r="1.6" fill="var(--coral)" />
					<line
						x1="9"
						y1="12"
						x2="18"
						y2="12"
						stroke="var(--coral)"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
					<circle cx="4" cy="18" r="1.6" fill="var(--coral)" />
					<line
						x1="9"
						y1="18"
						x2="21"
						y2="18"
						stroke="var(--coral)"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
				<h3>{FEATURES[1].title}</h3>
				<p>{FEATURES[1].description}</p>
			</div>
			<div class="feat-card">
				<svg width="26" height="26" viewBox="0 0 24 24" fill="none">
					<path
						d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.4l1-1.6h6.2l1 1.6h2.4A1.5 1.5 0 0 1 20 8.5V17a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17V8.5Z"
						stroke="var(--coral)"
						stroke-width="1.8"
						stroke-linejoin="round"
					/>
					<circle cx="12" cy="12.5" r="3.2" stroke="var(--coral)" stroke-width="1.8" />
				</svg>
				<h3>{FEATURES[2].title}</h3>
				<p>{FEATURES[2].description}</p>
			</div>
			<div class="feat-card">
				<svg width="26" height="26" viewBox="0 0 24 24" fill="none">
					<rect
						x="4.5"
						y="3.5"
						width="15"
						height="17"
						rx="1.8"
						stroke="var(--coral)"
						stroke-width="1.8"
					/>
					<line
						x1="8"
						y1="8.2"
						x2="16"
						y2="8.2"
						stroke="var(--coral)"
						stroke-width="1.6"
						stroke-linecap="round"
					/>
					<line
						x1="8"
						y1="11.6"
						x2="16"
						y2="11.6"
						stroke="var(--coral)"
						stroke-width="1.6"
						stroke-linecap="round"
					/>
					<line
						x1="8"
						y1="15"
						x2="13"
						y2="15"
						stroke="var(--coral)"
						stroke-width="1.6"
						stroke-linecap="round"
					/>
				</svg>
				<h3>{FEATURES[3].title}</h3>
				<p>{FEATURES[3].description}</p>
			</div>
		</div>
	</section>

	<section class="why section-pad">
		<div class="why-rule"></div>
		<h2 class="display">Why this exists</h2>
		<p class="why-body">
			Every pattern I've ever designed either lived in a notebook I've since lost, or nowhere at
			all. craftloop is the place I wish I'd had from the start — so the next thing you make isn't
			the last time you remember how you made it.
		</p>
		<p class="display why-signature">— Amanda, maker of craftloop</p>
	</section>

	<section class="roadmap section-pad">
		<div class="roadmap-card">
			<span class="shot-pill roadmap-pill" style="background:var(--mustard)">On the hook</span>
			<p>
				Turning your written patterns into clean, sellable PDFs for your Etsy shop is next on the
				list.
			</p>
		</div>
	</section>

	<section class="final-cta">
		<div class="section-pad final-cta-inner">
			<h2 class="display final-h2">Start your pattern box</h2>
			<p class="final-sub">Free to use — sign up in seconds.</p>
			<div class="cta-row">
				<a class="btn btn-primary" href={resolve('/signup')}>Sign up free</a>
				<a class="btn btn-invert" href={resolve('/login')}>Log in</a>
			</div>
		</div>
	</section>

	<footer class="landing-footer section-pad">
		<div class="footer-brand">
			<BrandIcon fill="coral" />
			<span>craftloop — your pattern box</span>
		</div>
		<span class="footer-copyright">© 2026 craftloop</span>
	</footer>
</div>

<style>
	.landing-page {
		max-width: 1180px;
		margin: 0 auto;
	}

	.section-pad {
		padding-inline: 40px;
	}

	.hero {
		max-width: 900px;
		margin: 0 auto;
		padding: 54px 40px 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 22px;
	}
	.hero-h1 {
		font-size: 52px;
		line-height: 1.08;
		max-width: 760px;
	}
	.hero-sub {
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-soft);
		max-width: 560px;
	}
	.cta-row {
		display: flex;
		gap: 12px;
		align-items: center;
		margin-top: 6px;
	}

	.btn-invert {
		background: var(--paper);
		border-color: var(--paper);
		color: var(--ink);
	}

	.product-shot {
		max-width: 1040px;
		margin: 0 auto;
		padding-block: 36px 90px;
	}
	.shot-frame {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 14px;
		overflow: hidden;
	}
	.shot-titlebar {
		display: flex;
		gap: 6px;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 1px solid var(--line);
	}
	.shot-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--line);
	}
	.shot-body {
		padding: 26px 26px 30px;
		background: var(--paper);
	}
	.shots-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}
	.shot-card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 14px;
		overflow: hidden;
	}
	.shot-photo {
		aspect-ratio: 16 / 10;
		position: relative;
	}
	.shot-gradient-1 {
		background: repeating-linear-gradient(
			45deg,
			#e1552f22,
			#e1552f22 10px,
			#1b736818 10px,
			#1b736818 20px
		);
	}
	.shot-gradient-2 {
		background: repeating-linear-gradient(
			45deg,
			#b9791a22,
			#b9791a22 10px,
			#7a3f6818 10px,
			#7a3f6818 20px
		);
	}
	.shot-gradient-3 {
		background: repeating-linear-gradient(
			45deg,
			#7a3f6822,
			#7a3f6822 10px,
			#e1552f18 10px,
			#e1552f18 20px
		);
	}
	.shot-pill {
		position: absolute;
		top: 10px;
		left: 10px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 4px 10px;
		border-radius: 99px;
		color: #fff;
	}
	.shot-card-body {
		padding: 13px 14px 15px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.shot-title {
		font-size: 18px;
	}
	.shot-meta {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		font-size: 11px;
	}
	.shot-meta span {
		background: var(--line-soft);
		padding: 3px 9px;
		border-radius: 6px;
		color: var(--ink-soft);
	}
	.shot-tags {
		display: flex;
		gap: 5px;
	}
	.tag-pill {
		font-size: 12px;
		padding: 3px 10px;
		border-radius: 99px;
		border: 1px solid var(--line);
		color: var(--ink-soft);
	}

	.features {
		max-width: 1040px;
		margin: 0 auto;
		padding: 10px 40px 90px;
	}
	.features-heading {
		font-size: 32px;
		text-align: center;
		margin-bottom: 44px;
	}
	.feat-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}
	.feat-card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 26px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		text-align: left;
	}
	.feat-card h3 {
		font-size: 19px;
	}
	.feat-card p {
		color: var(--ink-soft);
		line-height: 1.55;
		font-size: 15px;
	}

	.why {
		max-width: 740px;
		margin: 0 auto;
		padding: 10px 40px 90px;
		text-align: center;
	}
	.why-rule {
		width: 34px;
		height: 2px;
		background: var(--coral);
		margin: 0 auto 22px;
	}
	.why-body {
		font-size: 17px;
		line-height: 1.65;
		color: var(--ink-soft);
		margin-top: 18px;
	}
	.why-signature {
		margin-top: 18px;
		font-size: 16px;
		color: var(--ink);
	}

	.roadmap {
		max-width: 1040px;
		margin: 0 auto 90px;
	}
	.roadmap-card {
		background: var(--card);
		border: 1px solid var(--mustard);
		border-radius: 14px;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 18px 24px;
	}
	.roadmap-card p {
		font-size: 15px;
		color: var(--ink-soft);
	}
	.roadmap-pill {
		position: static;
		flex-shrink: 0;
	}

	.final-cta {
		background: var(--ink);
		padding: 70px 40px;
	}
	.final-cta-inner {
		max-width: 640px;
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
	}
	.final-h2 {
		font-size: 34px;
		color: var(--paper);
	}
	.final-sub {
		font-size: 16px;
		color: var(--line);
	}

	.landing-footer {
		max-width: 1180px;
		margin: 0 auto;
		padding: 34px 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
	}
	.footer-brand {
		display: flex;
		align-items: center;
		gap: 9px;
		font-size: 14px;
		color: var(--ink-soft);
	}
	.footer-brand :global(svg) {
		width: 22px;
		height: 22px;
	}
	.footer-copyright {
		font-size: 13px;
		color: var(--ink-soft);
	}

	@media (max-width: 760px) {
		.hero-h1 {
			font-size: 38px;
		}
		.shots-grid,
		.feat-grid {
			grid-template-columns: 1fr;
		}
		.cta-row {
			flex-direction: column;
			align-items: stretch;
		}
		.section-pad {
			padding-left: 24px;
			padding-right: 24px;
		}
		.final-h2 {
			font-size: 30px;
		}
	}
</style>
