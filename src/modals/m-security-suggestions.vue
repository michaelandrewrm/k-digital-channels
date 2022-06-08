<template>
	<l-modal stretch>
		<template v-slot:header>
			{{ $t('SECURITY_SUGGESTIONS.TITLE') }}
		</template>

		<article class="m-security-suggestions">
			<h2 class="text-l-medium">{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_PASSWORD.TITLE') }}</h2>
			<ul>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_PASSWORD.ITEMS.1') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_PASSWORD.ITEMS.2') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_PASSWORD.ITEMS.3') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_PASSWORD.ITEMS.4') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_PASSWORD.ITEMS.5') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_PASSWORD.ITEMS.6') }}</li>
			</ul>

			<h2 class="text-l-medium">{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_CONNECTIONS.TITLE') }}</h2>
			<ul>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_CONNECTIONS.ITEMS.1') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_CONNECTIONS.ITEMS.2') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_CONNECTIONS.ITEMS.3') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_CONNECTIONS.ITEMS.4') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_CONNECTIONS.ITEMS.5') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_CONNECTIONS.ITEMS.6') }}</li>
				<li>{{ $t('SECURITY_SUGGESTIONS.MODAL.SECURE_CONNECTIONS.ITEMS.7') }}</li>
			</ul>
		</article>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';

export default {
	name: 'm-security-suggestions',

	components: { LModal },
};
</script>

<style lang="scss" scoped>
.m-security-suggestions {
	text-align: left;
	padding-left: 24px;
	padding-right: 24px;

	h2 {
		margin-bottom: 10px;
	}

	p {
		margin-left: 10px;
	}
}

ul:not(:last-child) {
	margin-bottom: 40px;
}

li {
	list-style: disc;
	margin-left: 18px;
	margin-bottom: 1rem;
}

@media ($on-tablet) {
	.m-security-suggestions {
		padding-left: 34px;
		padding-right: 34px;
	}
}

@media ($on-desktop) {
	.m-security-suggestions {
		padding-left: 44px;
		padding-right: 44px;
	}
}
</style>
