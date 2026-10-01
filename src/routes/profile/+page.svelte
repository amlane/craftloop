<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_API_URL } from '$env/static/public';

	import Brand from '../brand.svelte';

	function getToken() {
		return browser ? localStorage.getItem('token') : '';
	}

	function logout() {
		localStorage.removeItem('token');
		goto(resolve('/'));
	}

	let loading = $state(true);
	let username = $state('');
	let email = $state('');
	let role = $state('user');

	onMount(() => {
		if (browser) {
			const jwtToken = getToken();
			if (jwtToken) {
				async function fetchData() {
					try {
						const response = await fetch(`${PUBLIC_API_URL}/api/users/me`, {
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								Authorization: 'Bearer ' + jwtToken
							}
						});
						const data = await response.json();
						username = data.username;
						email = data.email;
						role = data.role;
					} catch (error) {
						console.error('Failed to fetch:', error);
					} finally {
						loading = false;
					}
				}

				fetchData();
			} else {
				loading = false;
			}
		}
	});

	// ---------------- Change password ----------------

	let showPasswordForm = $state(false);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordError = $state('');
	let passwordSuccess = $state('');
	let passwordSaving = $state(false);

	function openPasswordForm() {
		showPasswordForm = true;
		passwordError = '';
		passwordSuccess = '';
	}

	function cancelPasswordForm() {
		showPasswordForm = false;
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
		passwordError = '';
	}

	async function submitPasswordChange() {
		passwordError = '';
		passwordSuccess = '';

		if (newPassword.length < 8) {
			passwordError = 'New password must be at least 8 characters.';
			return;
		}
		if (newPassword !== confirmPassword) {
			passwordError = "New passwords don't match.";
			return;
		}

		passwordSaving = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/api/users/me/password`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + getToken()
				},
				body: JSON.stringify({ currentPassword, newPassword })
			});
			const resData = await response.json();
			if (response.ok) {
				passwordSuccess = 'Password updated.';
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
				showPasswordForm = false;
			} else {
				passwordError = resData.message || "Couldn't update password.";
			}
		} catch (error) {
			console.error(error);
			passwordError = "Couldn't update password — try again.";
		} finally {
			passwordSaving = false;
		}
	}

	// ---------------- Delete account ----------------

	let confirmingDelete = $state(false);
	let deletePassword = $state('');
	let deleteError = $state('');
	let deleting = $state(false);

	function openDeleteConfirm() {
		confirmingDelete = true;
		deleteError = '';
	}

	function cancelDelete() {
		confirmingDelete = false;
		deletePassword = '';
		deleteError = '';
	}

	async function submitDeleteAccount() {
		deleteError = '';
		deleting = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/api/users/me`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + getToken()
				},
				body: JSON.stringify({ password: deletePassword })
			});
			if (response.ok) {
				localStorage.removeItem('token');
				goto(resolve('/'));
			} else {
				const resData = await response.json().catch(() => ({}));
				deleteError = resData.message || "Couldn't delete account.";
			}
		} catch (error) {
			console.error(error);
			deleteError = "Couldn't delete account — try again.";
		} finally {
			deleting = false;
		}
	}
</script>

<div class="app profile-page">
	<header class="top-bar mt-6 mb-4">
		<div class="brand flex justify-between">
			<Brand />
			<div class="flex items-center">
				<a class="btn btn-primary mr-2" id="newBtn" href={resolve('/projects')}>
					Back to Projects
				</a>
				<button onclick={logout} class="logout btn btn-secondary" id="logoutBtn">Logout</button>
			</div>
		</div>
	</header>

	{#if loading}
		<p class="loading-text">Loading…</p>
	{:else}
		<div class="profile-sheet">
			<div class="sheet-head">
				<h1 class="display">Profile</h1>
				{#if role === 'admin'}
					<span class="role-pip">Admin</span>
				{/if}
			</div>

			<div class="info-grid">
				<div class="info-field">
					<span class="info-label">Username</span>
					<span class="info-value mono">{username}</span>
				</div>
				<div class="info-field">
					<span class="info-label">Email</span>
					<span class="info-value mono">{email}</span>
				</div>
			</div>

			<div class="account-section">
				<h3 class="section-label">Password</h3>
				{#if !showPasswordForm}
					<button class="btn btn-secondary" onclick={openPasswordForm}>Change Password</button>
					{#if passwordSuccess}
						<p class="form-success">{passwordSuccess}</p>
					{/if}
				{:else}
					<div class="password-form">
						<div class="field">
							<label for="currentPassword">Current password</label>
							<input
								id="currentPassword"
								type="password"
								autocomplete="current-password"
								bind:value={currentPassword}
							/>
						</div>
						<div class="field">
							<label for="newPassword">New password</label>
							<input
								id="newPassword"
								type="password"
								autocomplete="new-password"
								bind:value={newPassword}
							/>
						</div>
						<div class="field">
							<label for="confirmPassword">Confirm new password</label>
							<input
								id="confirmPassword"
								type="password"
								autocomplete="new-password"
								bind:value={confirmPassword}
							/>
						</div>
						{#if passwordError}
							<p class="form-error">{passwordError}</p>
						{/if}
						<div class="form-actions">
							<button
								class="btn btn-primary"
								onclick={submitPasswordChange}
								disabled={passwordSaving}
							>
								{passwordSaving ? 'Saving…' : 'Save password'}
							</button>
							<button class="btn btn-ghost" onclick={cancelPasswordForm}>Cancel</button>
						</div>
					</div>
				{/if}
			</div>

			<div class="account-section danger-section">
				<h3 class="section-label">Danger zone</h3>
				{#if !confirmingDelete}
					<button class="btn btn-danger" onclick={openDeleteConfirm}>Delete Account</button>
				{:else}
					<div class="delete-confirm">
						<p class="delete-warning">
							This permanently deletes your account and every pattern you've created. This can't be
							undone.
						</p>
						<div class="field">
							<label for="deletePassword">Confirm your password</label>
							<input
								id="deletePassword"
								type="password"
								autocomplete="current-password"
								bind:value={deletePassword}
							/>
						</div>
						{#if deleteError}
							<p class="form-error">{deleteError}</p>
						{/if}
						<div class="form-actions">
							<button
								class="btn btn-danger"
								onclick={submitDeleteAccount}
								disabled={deleting || !deletePassword}
							>
								{deleting ? 'Deleting…' : 'Permanently delete my account'}
							</button>
							<button class="btn btn-ghost" onclick={cancelDelete}>Cancel</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.profile-page {
		/* max-width: 640px; */
		margin: 0 auto;
		padding-bottom: 60px;
	}

	.loading-text {
		padding: 10px 30px 40px;
		color: var(--ink-soft);
	}

	.profile-sheet {
		padding-inline: 30px;
		max-width: 640px;
		margin: 30px auto;
	}

	.sheet-head {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--line);
		margin-bottom: 24px;
	}

	.sheet-head h1 {
		font-size: 1.8rem;
		font-weight: 600;
		color: var(--ink);
		margin: 0;
	}

	.role-pip {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 4px 10px;
		border-radius: 99px;
		background: var(--plum);
		color: #fff;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px 20px;
		margin-bottom: 32px;
	}

	.info-field {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.info-label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.info-value {
		font-size: 0.95rem;
		color: var(--ink);
	}

	.account-section {
		padding-block: 20px;
		border-top: 1px solid var(--line);
	}

	.danger-section {
		border-bottom: 1px solid var(--line);
	}

	h3.section-label {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin: 0 0 12px;
	}

	.password-form,
	.delete-confirm {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 360px;
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

	.form-actions {
		display: flex;
		gap: 8px;
	}

	.form-error {
		font-size: 0.85rem;
		color: var(--danger);
		margin: 0;
	}

	.form-success {
		font-size: 0.85rem;
		color: var(--teal);
		margin: 10px 0 0;
	}

	.delete-warning {
		font-size: 0.88rem;
		color: var(--ink-soft);
		max-width: 420px;
		line-height: 1.5;
		margin: 0;
	}

	@media (max-width: 480px) {
		.info-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
