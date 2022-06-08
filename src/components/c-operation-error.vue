<template>
	<section class="c-operation-error">
		<header class="c-operation-error__header">
			<div class="c-operation-error__icon-wrapper">
				<c-icon src="@icons/modalExclamation" size="none" class="c-operation-error__icon" />
			</div>

			<h1 tabindex="-1" class="text-xl-bold"><slot name="title" /></h1>
		</header>

		<div class="c-operation-error__scrolling">
			<section class="c-operation-error__main">
				<slot />
				<p v-if="!$slots.default && contactUs" class="text-s-book">
					{{ $t('OPERATION_ERROR.DESC') }}
				</p>
				<c-contact-support-info v-if="contactUs" />
			</section>
		</div>

		<footer class="c-operation-error__footer">
			<div class="c-operation-error__footer-wrapper">
				<c-button raised @click="$emit('confirm')" data-testid="confirm">
					{{ $t('ACTIONS.ACCEPT') }}
				</c-button>

				<router-link
					:to="{ name: 'home', replace: true }"
					class="text-m-medium c-operation-error__link"
					data-testid="exit"
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
	name: 'c-operation-error',

	components: {
		CIcon,
		CButton,
		CContactSupportInfo,
	},

	props: {
		contactUs: { type: Boolean },
	},
};
</script>

<style lang="scss" scoped>
.c-operation-error {
	background-color: RGB(var(--color-surface-light));
	color: RGB(var(--color-text-primary));
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
	height: 100%;
}

.c-operation-error__header {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	max-width: 320px;
	padding: 30px 0;
	text-align: center;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.c-operation-error__header h1 {
	padding: 0 30px;
}

.c-operation-error__icon {
	font-size: 50px;
	color: RGB(var(--color-accent-error));
}

.c-operation-error__icon-wrapper {
	margin-bottom: 30px;
	position: relative;
	display: flex;
	flex-shrink: 0;
}

.c-operation-error__scrolling {
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

.c-operation-error__main {
	max-width: 320px;
	padding: 30px 20px;
	flex-grow: 1;
	width: 100%;
	text-align: center;
}

.c-operation-error__main > *:not(:last-child) {
	margin-bottom: 15px;
}

.c-operation-error__footer {
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

.c-operation-error__footer-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 320px;
	padding: 30px 0;
	text-align: center;
}

.c-operation-error__footer-wrapper /deep/ * {
	width: 100%;
}

.c-operation-error__link {
	margin-top: 30px;
}

.c-operation-error__contact-detail {
	text-align: center;
	margin-top: 30px;
	padding: 30px;
	border: 1px solid RGB(var(--color-surface-dark));
}

.c-operation-error__contact-detail:not(:last-of-type)::after {
	content: '';
	display: block;
	width: 125px;
	height: 2px;
	background: RGB(var(--color-primary));
	margin: 32px auto 0;
}

.c-operation-error__contact-detail p {
	margin-bottom: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.c-operation-error__icon-tel {
	margin-right: 10px;
	font-size: inherit;
}

.c-operation-error__telephone {
	width: 100%;
	line-height: 2;
	margin-bottom: 10px;
	border-bottom: 3px solid RGB(var(--color-secondary));
	display: inline-block;
	padding-bottom: 10px;
	outline: 0;
}
</style>
