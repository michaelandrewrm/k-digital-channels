<template>
	<div class="l-transfer-sheet" :class="classNames">
		<div class="l-transfer-sheet__content" @focusin="onInputFocusIn" @focusout="onInputFocusOut">
			<slot />
		</div>

		<div class="l-transfer-sheet__actions" v-if="hasButtons">
			<div
				data-testid="sheet-buttons"
				class="l-transfer-sheet__buttons"
				ref="buttons"
				role="region"
				:aria-label="$t('ACTIONS.OPTIONS')"
			>
				<slot name="buttons" />
			</div>
		</div>
	</div>
</template>

<script>
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import mq from '@utils/matchMedia';
import { onMobile } from '@theme';

const KEYBOARD_DELAY = 150;

export default {
	name: 'l-transfer-sheet',

	props: {
		collapsableButtons: { type: Boolean, default: true },
	},

	data() {
		return {
			hasButtons: null,
			isFocused: false,
			focusHandler: null,
			ignoreFocusEvent: false,
		};
	},

	computed: {
		isMobile: mq(onMobile),

		isSmallHeight: mq('(max-height: 800px)'),

		classNames({ hasButtons, collapseButtons }) {
			return {
				'--has-buttons': hasButtons && !collapseButtons,
			};
		},

		collapseButtons({ isMobile, isSmallHeight, isFocused, collapsableButtons }) {
			return isMobile && isSmallHeight && isFocused && collapsableButtons;
		},
	},

	methods: {
		onInputFocusIn(e) {
			if (e.target.nodeName !== 'INPUT' || e.target.type !== 'text') {
				return;
			}

			/* istanbul ignore next */
			if (this.ignoreFocusEvent) {
				return;
			}
			clearTimeout(this.focusHandler);
			this.focusHandler = setTimeout(() => {
				this.isFocused = true;

				// * Apply this hack only on Safari browsers
				const { userAgent } = window.navigator;
				/* istanbul ignore next */
				if (userAgent.includes('Safari') && !userAgent.includes('Chrome') && this.isSmallHeight) {
					const $animationDuration = 150;

					setTimeout(() => {
						this.ignoreFocusEvent = true;
						e.target.blur();
						clearTimeout(this.focusHandler);
						e.target.focus();
						this.ignoreFocusEvent = false;
					}, $animationDuration + 20);
				}
			}, KEYBOARD_DELAY);
		},

		onInputFocusOut(e) {
			if (e.target.nodeName !== 'INPUT' || e.target.type !== 'text') {
				return;
			}

			clearTimeout(this.focusHandler);
			this.focusHandler = setTimeout(() => {
				this.isFocused = false;
			}, KEYBOARD_DELAY);
		},

		setFocusToFirstTitle() {
			const focusableTitle = ['h1', 'h2', 'h3'].join(', ');
			const titles = this.$el.querySelectorAll(focusableTitle);

			if (titles.length) {
				titles[0].focus({ preventScroll: true });
				setTimeout(() => {
					elementScrollIntoView(titles[0], { behavior: 'smooth' });
				}, 1000);
			}
		},
	},

	updated() {
		this.hasButtons = Boolean(this.$slots.buttons);
	},

	mounted() {
		this.hasButtons = Boolean(this.$slots.buttons);
		this.$nextTick(this.setFocusToFirstTitle);
	},
};
</script>

<style lang="scss" scoped>
.l-transfer-sheet {
	color: RGB(var(--color-text-primary));
	display: flex;
	flex-grow: 1;
	background: RGB(var(--color-surface));
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	box-shadow: 0px -3px 12px -10px RGBA(0, 0, 0, 0.5);
}

.l-transfer-sheet::after {
	content: '';
	background: inherit;
	height: var(--scrollable-safe-margin-bottom);
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
}

.l-transfer-sheet__content {
	display: flex;
	position: relative;
	width: 100%;
	flex-direction: column;
	flex-grow: 0;
	flex-shrink: 0;
	max-width: $theme-max-width;
	margin: 0 auto;
}

.l-transfer-sheet.--has-buttons .l-transfer-sheet__content {
	padding-bottom: 70px;
}

.l-transfer-sheet__actions {
	background: RGB(var(--color-surface-light));
	box-shadow: 0px -6px 20px -20px black;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	padding-left: 20px;
	padding-right: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: $layer-modal-z-index;
	position: absolute;
	height: 70px;
	bottom: 0;
	left: 0;
	right: 0;
	will-change: transform;
	transition: transform 300ms ease-in-out;
	transform: translateY(100%);
}

.l-transfer-sheet__buttons {
	display: grid;
	width: 100%;
	max-width: 400px;
	gap: 10px;
	grid-auto-flow: column;
	grid-auto-columns: 1fr auto;
}

.l-transfer-sheet.--has-buttons .l-transfer-sheet__actions {
	transform: translateY(0);
}

@media ($on-desktop) {
	.l-transfer-sheet__actions {
		height: 90px;
	}

	.l-transfer-sheet.--has-buttons .l-transfer-sheet__content {
		padding-bottom: 90px;
	}
}
</style>
