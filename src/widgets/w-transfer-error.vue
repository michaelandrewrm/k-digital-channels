<template>
	<section class="w-transfer-error">
		<header class="w-transfer-error__header">
			<div class="w-transfer-error__icon-wrapper">
				<c-icon src="@icons/modalExclamation" size="none" class="w-transfer-error__icon" />
			</div>

			<h1 tabindex="-1" class="text-xl-bold">{{ title }}</h1>
		</header>

		<div class="w-transfer-error__scrolling">
			<section class="w-transfer-error__main">
				<p v-if="!$slots.default" class="text-m-book">{{ $t('TRANSFERS.OPERATION.ERROR') }}</p>
				<slot />
				<c-contact-support-info />
			</section>
		</div>

		<footer class="w-transfer-error__footer">
			<div class="w-transfer-error__footer-wrapper">
				<c-button raised @click="$emit('confirm')" class="w-transfer-error__button">
					{{ $t('ACTIONS.ACCEPT') }}
				</c-button>

				<router-link
					:to="{ name: 'home', replace: true }"
					class="text-m-medium w-transfer-error__link"
				>
					{{ $t('ACTIONS.GO_TO_VIEW', { view: $t('GLOBAL_POSITION') }) }}
				</router-link>
			</div>
		</footer>
	</section>
</template>

<script>
import CIcon from '@components/c-icon';
import CButton from '@components/c-button';
import CContactSupportInfo from '@components/c-contact-support-info';

export default {
	name: 'w-transfer-error',

	components: {
		CIcon,
		CButton,
		CContactSupportInfo,
	},

	props: {
		title: { type: String },
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-error {
	background-color: RGB(var(--color-surface-light));
	color: RGB(var(--color-text-primary));
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
	height: 100%;
}

.w-transfer-error__header {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	max-width: 320px;
	padding: 30px 0;
	text-align: center;
	border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.w-transfer-error__header h1 {
	padding: 0 30px;
}

.w-transfer-error__icon {
	font-size: 50px;
	color: RGB(var(--color-accent-error));
}

.w-transfer-error__icon-wrapper {
	margin-bottom: 30px;
	position: relative;
	display: flex;
	flex-shrink: 0;
}

.w-transfer-error__scrolling {
	width: 100%;
	overflow-x: hidden;
	overflow-y: overlay;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-grow: 1;
	flex-shrink: 1;
}

.w-transfer-error__main {
	max-width: 320px;
	padding: 30px 20px;
	flex-grow: 1;
	width: 100%;
	text-align: center;
}

.w-transfer-error__main > *:not(:last-child) {
	margin-bottom: 15px;
}

.w-transfer-error__footer {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	flex-shrink: 0;
	background: RGB(var(--color-surface-light));
	box-shadow: 0px -6px 20px -20px black;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	will-change: transform;
	transition: transform 300ms ease-in-out;
}

.w-transfer-error__footer-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	max-width: 320px;
	padding: 30px 0;
	text-align: center;
}

.w-transfer-error__button {
	width: 280px;
}

.w-transfer-error__link {
	margin-top: 30px;
}

.w-transfer-error__contact-detail {
	text-align: center;
	margin-top: 30px;
	padding: 30px;
	border: 1px solid RGB(var(--color-surface-dark));
}

.w-transfer-error__contact-detail:not(:last-of-type)::after {
	content: '';
	display: block;
	width: 125px;
	height: 2px;
	background: RGB(var(--color-primary));
	margin: 32px auto 0;
}

.w-transfer-error__contact-detail p {
	margin-bottom: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.w-transfer-error__icon-tel {
	margin-right: 10px;
	font-size: inherit;
}

.w-transfer-error__telephone {
	width: 100%;
	line-height: 2;
	margin-bottom: 10px;
	border-bottom: 3px solid RGB(var(--color-secondary));
	display: inline-block;
	padding-bottom: 10px;
	outline: 0;
}
</style>
