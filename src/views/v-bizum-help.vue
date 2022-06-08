<template>
	<l-view-modal @close="$router.back()">
		<h1 slot="header" class="text-l-medium">{{ $t('BIZUM.HELP.TITLE') }}</h1>

		<div class="v-bizum-help__wrapper">
			<p class="text-m-medium">{{ $t('BIZUM.HELP.SUBTITLE') }}</p>

			<ul>
				<li>{{ $t('BIZUM.HELP.STEPS.0') }}</li>
				<li>{{ $t('BIZUM.HELP.STEPS.1') }}</li>
				<li>{{ $t('BIZUM.HELP.STEPS.2') }}</li>
			</ul>

			<h2 class="text-m-medium">{{ $t('BIZUM.HELP.BENEFITS') }}</h2>

			<ol>
				<li>{{ $t('BIZUM.HELP.BENEFITS.0') }}</li>
				<li>{{ $t('BIZUM.HELP.BENEFITS.1') }}</li>
				<li>{{ $t('BIZUM.HELP.BENEFITS.2') }}</li>
				<li>{{ $t('BIZUM.HELP.BENEFITS.3') }}</li>
			</ol>
		</div>

		<div class="v-bizum-help__contact-detail">
			<p class="text-s-book">
				<c-icon class="v-bizum-help__inline-icon" src="@icons/phone" />
				{{ $t('INFO.REMEMBER_PASSWORD.TEL_BANK') }}
			</p>
			<a
				class="v-bizum-help__telephone-number text-m-book"
				:href="`tel:${$store.state.app.telephone}`"
				v-a11y-tel="$store.state.app.telephone"
			>
				{{ $store.state.app.telephone }}
			</a>
			<p class="text-s-book">{{ $t('BIZUM.HELP.CONTACT_US') }}</p>
		</div>
	</l-view-modal>
</template>

<script>
import LViewModal from '@layouts/l-view-modal';
import CIcon from '@components/c-icon';

export default {
	name: 'v-bizum-help',

	components: {
		LViewModal,
		CIcon,
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-help__wrapper {
	margin: 20px 0;
}

ul {
	counter-reset: section;
	list-style: none;
}

li {
	margin: 0 0 10px 0;
	@extend %typo-m-light;
	display: flex;
	align-items: center;
}

ul,
ol {
	margin: 30px 0 30px 15px;
}

ul li::before {
	content: counter(section);
	counter-increment: section;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 22px;
	height: 22px;
	margin: 0 10px 0 0;
	border: 1px solid RGBA(var(--color-text-primary-light), 0.5);
	border-radius: 50%;
	text-align: center;
}

h2 {
	padding-bottom: 10px;
	border-bottom: 1px solid RGBA(var(--color-text-primary-light), 0.2);
	margin-bottom: 10px;
}

ol {
	padding-bottom: 30px;
	border-bottom: 1px solid RGBA(var(--color-text-primary-light), 0.2);
}

ol li::before {
	content: '';
	display: inline-block;
	width: 4px;
	height: 4px;
	flex-shrink: 0;
	margin: 0 20px 0 0;
	background: RGBA(var(--color-text-primary-light), 0.5);
	border-radius: 50%;
}

.v-bizum-help__contact-detail {
	margin: 30px;
	padding: 30px;
	border: 1px solid RGBA(var(--color-text-primary-light), 0.2);
	border-radius: 2px;
	text-align: center;
}

.v-bizum-help__contact-detail p {
	margin-bottom: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.v-bizum-help__inline-icon {
	margin-right: 10px;
	font-size: inherit;
}

.v-bizum-help__telephone-number {
	width: 100%;
	line-height: 2;
	margin-bottom: 10px;
	border-bottom: 1px solid RGBA(var(--color-text-primary-light), 0.2);
	display: inline-block;
	padding-bottom: 10px;
	outline: 0;
}
</style>
