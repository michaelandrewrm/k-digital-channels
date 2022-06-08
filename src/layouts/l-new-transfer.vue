<template>
	<div class="l-new-transfer" :class="classNames">
		<nav class="l-new-transfer__nav">
			<button
				class="l-new-transfer__back"
				@click="$router.back()"
				:aria-label="$t('ACTIONS.GO_BACK')"
				data-testid="back-button"
			>
				<c-icon src="@icons/close" v-if="isDesktop" />
				<c-icon src="@icons/back" v-else />
			</button>
		</nav>

		<header class="l-new-transfer__header text-l-bold" ref="header">
			<div class="l-new-transfer__limit">
				<slot name="header" />
			</div>
		</header>

		<div class="l-new-transfer__bg">
			<div class="l-new-transfer__limit">
				<slot name="main-pre-content" />
			</div>
			<div class="l-new-transfer__scrolling" tabindex="-1">
				<div class="l-new-transfer__limit">
					<slot />
				</div>
				<slot name="sheet" />
			</div>
		</div>

		<transition name="l-new-transfer__transition_buttons">
			<div
				data-testid="page-buttons"
				class="l-new-transfer__buttons"
				ref="buttons"
				role="region"
				:aria-label="$t('ACTIONS.OPTIONS')"
				v-if="showButtons"
			>
				<div class="l-new-transfer__button-wrapper">
					<slot name="buttons" />
				</div>
			</div>
		</transition>

		<div v-if="$slots['state']" class="l-new-transfer__state">
			<slot name="state" />
		</div>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';

export default {
	name: 'l-new-transfer',

	components: { CIcon },

	props: {
		loading: { type: Boolean },
	},

	data() {
		return {
			hasButtons: null,
		};
	},

	computed: {
		isDesktop: mq(onDesktop),

		showButtons({ hasButtons }) {
			return hasButtons;
		},

		classNames({ showButtons, loading }) {
			return {
				'--has-buttons': showButtons,
				'--is-loading': loading,
			};
		},
	},

	updated() {
		this.hasButtons = Boolean(this.$slots.buttons);
	},

	mounted() {
		this.hasButtons = Boolean(this.$slots.buttons);
	},
};
</script>

<style lang="scss" scoped>
.l-new-transfer {
	position: relative;
	background: RGB(var(--color-primary));
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}

.l-new-transfer__header {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	height: 140px;
	padding: 0 16px 70px;
	background-image: var(--color-gradient-header);
	background-size: 100%;
	text-align: center;
	color: RGB(var(--color-text-primary-light));
	will-change: opacity;
}

.l-new-transfer__bg {
	background: RGB(var(--color-surface-dark));
	color: RGB(var(--color-text-primary));
	margin-top: -30px;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	overflow: hidden;
	flex-grow: 1;
	flex-shrink: 1;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding-top: 20px;
	will-change: opacity;
}

.l-new-transfer.--has-buttons {
	--bottom-safe-area-height: 70px;
}

@media ($on-desktop) {
	.l-new-transfer.--has-buttons {
		--bottom-safe-area-height: 90px;
	}
}

.l-new-transfer__nav {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 16px;
	left: 4px;
	z-index: 1;
	width: calc((1 - var(--l-main-layout-primary, 0)) * 30px);
	height: calc((1 - var(--l-main-layout-primary, 0)) * 40px);
	overflow: hidden;
}

.l-new-transfer__back {
	position: relative;
	background: transparent;
	color: white;
	font-size: 13px;
	padding: 10px 6px;
	border: none;
	outline: none;
	user-select: none;
	border-radius: 4px;
	appearance: none;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.l-new-transfer__sheet {
	background: RGB(var(--color-surface));
	color: RGB(var(--color-text-primary));
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	box-shadow: 0px -3px 12px -10px RGBA(0, 0, 0, 0.5);
	flex-grow: 1;
}

.l-new-transfer__sheet::after {
	content: '';
	background: inherit;
	height: var(--bottom-safe-area-height);
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
}

.l-new-transfer__limit {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: $theme-max-width;
	flex-grow: 0;
	flex-shrink: 0;
	margin: 0 auto;
}

.l-new-transfer__scrolling {
	overflow-y: auto;
	overflow-y: overlay;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
	overscroll-behavior-y: contain;
	flex-shrink: 1;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	margin-bottom: var(--bottom-safe-area-height);
}

.l-new-transfer__buttons {
	background: RGB(var(--color-surface-light));
	box-shadow: 0px -6px 20px -20px black;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	z-index: $layer-modal-z-index;
	position: absolute;
	min-height: var(--bottom-safe-area-height);
	bottom: 0;
	left: 0;
	right: 0;
	will-change: transform;
}

.l-new-transfer__button-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: var(--bottom-safe-area-height);
	transition: opacity 300ms;
	padding: 0 20px;
}

.l-new-transfer__button-wrapper /deep/ > * {
	width: 100%;
	max-width: 320px;
}

.l-new-transfer.--is-loading .l-new-transfer__buttons {
	height: 100%;
	bottom: auto;
	transform: translateY(calc(100% - var(--bottom-safe-area-height)));
	animation: leaveToTop 1s cubic-bezier(0.77, 0, 0.175, 1) 200ms forwards;
}

.l-new-transfer.--is-loading .l-new-transfer__button-wrapper {
	opacity: 0;
}

@keyframes leaveToTop {
	to {
		transform: translateY(0px);
	}
}

.l-new-transfer__state {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	z-index: $layer-modal-z-index;
}

.l-new-transfer__transition_buttons-enter-active,
.l-new-transfer__transition_buttons-leave-active {
	transition: transform 300ms ease-in-out;
}

.l-new-transfer__transition_buttons-enter,
.l-new-transfer__transition_buttons-leave-to {
	transform: translateY(100%);
}

@media ($on-desktop) {
	.l-new-transfer__bg {
		border-top-left-radius: 0;
	}

	.l-new-transfer__nav {
		left: auto;
		right: 10px;
	}

	.l-new-transfer__back {
		font-size: 15px;
	}
}
</style>
