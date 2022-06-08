<template>
	<div class="l-page" :class="classList">
		<nav class="l-page__nav">
			<button
				v-if="closable"
				class="l-page__back"
				@click="$router.back()"
				:aria-label="$t('ACTIONS.GO_BACK')"
				data-testid="back-button"
				:tabindex="!closable - 1"
			>
				<c-icon src="@icons/close" v-if="isDesktop" />
				<c-icon src="@icons/back" v-else />
			</button>
		</nav>

		<header data-testid="layout-header" class="l-page__header text-l-bold" ref="header">
			<div class="l-page__printable-header media-screen-hide">
				<slot name="printable-header" />
			</div>
			<div class="l-page__limit l-page__title">
				<slot name="header" />
			</div>
		</header>

		<div class="l-page__widget" v-if="hasWidget">
			<div class="l-page__widget-wrapper">
				<slot name="widget" />
			</div>
		</div>

		<div class="l-page__bg" data-testid="layout-body" ref="bg">
			<div class="l-page__limit" v-if="hasMainStaticHeader">
				<slot name="main-static-header" />
			</div>

			<component
				:is="hasSheet ? 'c-sheet' : 'div'"
				ref="sheet"
				class="l-page__main"
				:notch="hasWidget"
				@beforeLift="onSheetLift"
				@drop="onSheetDrop"
				v-on="$listeners"
				:shift-to="120"
			>
				<div class="l-page__main-fixed-header" v-if="hasMainFixedHeader" slot="main-header">
					<div class="l-page__limit">
						<slot name="main-fixed-header" />
					</div>
				</div>

				<c-overflow-container
					ref="scrolling"
					@hide-top="onHideTop"
					@visible-top="onVisibleTop"
					@hide-bottom="onHideBottom"
					@visible-bottom="onVisibleBottom"
				>
					<div class="l-page__limit l-page__content">
						<slot />
					</div>
				</c-overflow-container>
			</component>

			<footer
				data-testid="layout-footer"
				class="l-page__footer text-l-bold"
				ref="footer"
				v-if="hasFooter"
			>
				<div class="l-page__limit">
					<slot name="footer" />
				</div>
			</footer>
		</div>

		<transition name="l-page__slide-up">
			<div
				data-testid="layout-buttons"
				class="l-page__buttons"
				ref="buttons"
				role="region"
				:aria-label="$t('ACTIONS.OPTIONS')"
				v-if="hasButtons && !sheetLifted"
			>
				<div class="l-page__button-wrapper">
					<slot name="buttons" />
				</div>
			</div>
		</transition>

		<div v-if="hasState" class="l-page__state">
			<slot name="state" />
		</div>
	</div>
</template>

<script>
import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';
import CIcon from '@components/c-icon';
import CSheet from '@components/c-sheet';
import COverflowContainer from '@components/c-overflow-container';

const HammerAsync = () => import(/* webpackChunkName: "hammerjs" */ 'hammerjs');

export default {
	name: 'l-page',

	components: {
		CSheet,
		CIcon,
		COverflowContainer,
	},

	provide() {
		return { layout: this.layoutElements };
	},

	data() {
		return {
			hasButtons: false,
			hasFooter: false,
			hasState: false,
			hasWidget: false,
			hasMainFixedHeader: false,
			hasMainStaticHeader: false,
			Hammer: null,
			sheetLifted: false,
			topIsVisible: true,
			bottomIsVisible: false,
			layoutElements: { scrollingElement: null },
		};
	},

	props: {
		loading: { type: Boolean },
		closable: { type: Boolean, default: true },
	},

	computed: {
		isDesktop: mq(onDesktop),

		hasSheet({ hasMainStaticHeader, hasWidget }) {
			return hasMainStaticHeader || hasWidget;
		},

		classList({ hasButtons, hasWidget, hasSheet, loading, sheetLifted }) {
			return {
				'--has-buttons': hasButtons && !sheetLifted,
				'--has-widget': hasWidget,
				'--has-sheet': hasSheet,
				'--is-loading': loading,
			};
		},
	},

	watch: {
		Hammer(Hammer) {
			const { DIRECTION_VERTICAL, Pan } = Hammer;

			this.hammerInstance = new Hammer(this.$refs.bg);

			const vertical = new Pan({ event: 'pan', direction: DIRECTION_VERTICAL });
			const events = 'panmove';

			this.hammerInstance.add([vertical]);
			this.hammerInstance.on(events, this.onBGScroll);
		},

		hasSheet(hasSheet) {
			if (hasSheet) {
				this.$refs.bg.addEventListener('wheel', this.onBGScroll, { passive: false });
			} else {
				this.$refs.bg.removeEventListener('wheel', this.onBGScroll, { passive: false });
			}
		},
	},

	methods: {
		updateForSlots() {
			this.hasButtons = Boolean(this.$slots.buttons);
			this.hasFooter = Boolean(this.$slots.footer);
			this.hasState = Boolean(this.$slots.state);
			this.hasWidget = Boolean(this.$slots.widget);
			this.hasMainFixedHeader = Boolean(this.$slots['main-fixed-header']);
			this.hasMainStaticHeader = Boolean(this.$slots['main-static-header']);
		},

		setInitialFocus() {
			const focusableTitle = ['h1', 'h2', 'h3'].join(', ');
			const titles = this.$refs.header.querySelectorAll(focusableTitle);

			if (titles.length) {
				titles[0].focus();
			}
		},

		onSheetLift() {
			this.sheetLifted = true;
		},

		onSheetDrop() {
			this.sheetLifted = false;
		},

		onHideTop() {
			this.topIsVisible = false;
			this.liftCard();
		},

		onVisibleTop() {
			this.topIsVisible = true;
			this.dropCard();
		},

		onHideBottom() {
			this.bottomIsVisible = false;
		},

		onVisibleBottom() {
			this.bottomIsVisible = true;
		},

		liftCard() {
			/* istanbul ignore else */
			if (this.hasSheet) {
				this.$refs.sheet.liftCardboard();
			}
		},

		dropCard() {
			/* istanbul ignore else */
			if (this.hasSheet) {
				this.$refs.sheet.dropCardboard();
			}
		},

		onBGScroll(e) {
			const { hasSheet, sheetLifted, topIsVisible, bottomIsVisible } = this;
			const scrollInverted = e.type === 'panmove';
			const scrollingDown = scrollInverted ? e.deltaY < 0 : e.deltaY > 0;
			const scrollingUp = !scrollingDown;

			if (!hasSheet) {
				return;
			}

			if (!sheetLifted && bottomIsVisible) {
				return;
			}

			if (!sheetLifted && scrollingDown) {
				this.liftCard();
			}

			if (scrollingUp && topIsVisible) {
				this.dropCard();
			}
		},
	},

	mounted() {
		this.updateForSlots();
		this.$nextTick(this.setInitialFocus);
	},

	updated() {
		this.updateForSlots();
		this.layoutElements.scrollingElement = this.$refs.scrolling?.$refs?.scrolling;
	},

	async created() {
		this.Hammer = (await HammerAsync()).default;
	},

	/* istanbul ignore next */
	beforeDestroy() {
		if (this.hammerInstance) {
			this.hammerInstance.destroy();
			this.hammerInstance = null;
		}
	},
};
</script>

<style lang="scss" scoped>
.l-page {
	position: relative;
	background: RGB(var(--color-primary));
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
	--l-page-border-radius-left: calc((1 - var(--l-main-layout-secondary, 0)) * #{$border-radius-xl});
	--l-page-border-radius-right: calc((1 - var(--l-main-layout-primary, 0)) * #{$border-radius-xl});
}

.l-page.--has-buttons {
	--l-page__button-container-height: 70px;
}

.l-page__limit {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: $theme-max-width;
	flex-grow: 0;
	flex-shrink: 0;
	margin: 0 auto;
}

.l-page__header {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
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

.l-page__widget {
	display: flex;
	justify-content: center;
	flex-basis: auto;
	flex-shrink: 0;
	background-color: RGB(var(--color-surface));
	color: RGB(var(--color-text-primary-light));
	width: 100%;
	min-height: $border-radius-xl;
	border-top-left-radius: var(--l-page-border-radius-left);
	border-top-right-radius: var(--l-page-border-radius-right);
	margin-left: auto;
	margin-right: auto;
	margin-top: -30px;
	will-change: opacity;
}

.l-page__widget-wrapper {
	margin-top: -40px;
	margin-bottom: 10px;
	min-height: 40px;
	display: flex;
	justify-content: center;
	flex-grow: 1;
	width: 100%;
	will-change: opacity;
}

.l-page__bg {
	background: var(--layout-background, RGB(var(--color-surface)));
	color: RGB(var(--color-text-primary));
	overflow: hidden;
	flex-grow: 1;
	flex-shrink: 1;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding-bottom: var(--l-page__button-container-height);
	will-change: opacity;
}

.l-page:not(.--has-widget) .l-page__bg {
	margin-top: -30px;
	padding-top: $border-radius-xl;
	border-top-left-radius: var(--l-page-border-radius-left);
	border-top-right-radius: var(--l-page-border-radius-right);
}

.l-page__main-fixed-header {
	background: RGB(var(--color-surface));
	color: RGB(var(--color-text-primary));
	padding-bottom: 10px;
	position: relative;
}

.l-page__nav {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 11px;
	left: 0px;
	z-index: 1;
	width: calc((1 - var(--l-main-layout-primary, 0)) * 38px);
	height: calc((1 - var(--l-main-layout-primary, 0)) * 50px);
	overflow: hidden;
}

.l-page__back {
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

.l-page.--has-sheet .l-page__main {
	margin-top: -15px;
}

.l-page:not(.--has-sheet) .l-page__main {
	height: 100%;
	color: var(--layout-background, RGB(var(--color-surface)));
	display: flex;
	flex-direction: column;
}

.l-page__content {
	color: RGB(var(--color-text-primary));
	padding: 0 20px;
	position: relative;
}

.l-page__buttons {
	display: flex;
	position: absolute;
	min-height: var(--l-page__button-container-height);
	bottom: 0;
	left: 0;
	right: 0;
	background: RGB(var(--color-surface-light));
	box-shadow: 0px -6px 20px -20px black;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	will-change: transform;
	z-index: $layer-modal-z-index;
}

.l-page__button-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: var(--l-page__button-container-height);
	transition: opacity 300ms;
	padding: 0 20px;
}

.l-page__button-wrapper /deep/ * {
	width: 100%;
	max-width: 320px;
}

.l-page.--is-loading .l-page__buttons {
	height: 100%;
	bottom: auto;
	transform: translateY(calc(100% - var(--l-page__button-container-height)));
	animation: leaveToTop 1s 200ms cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

.l-page.--is-loading .l-page__button-wrapper {
	opacity: 0;
}

@keyframes leaveToTop {
	to {
		transform: translateY(0px);
	}
}

.l-page__state {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	z-index: $layer-modal-z-index;
}

.l-page__slide-up-enter-active,
.l-page__slide-up-leave-active {
	transition: transform 300ms ease-in-out;
}

.l-page__slide-up-enter,
.l-page__slide-up-leave-to {
	transform: translateY(100%);
}

@media ($on-desktop) {
	.l-page.--has-buttons {
		--l-page__button-container-height: 90px;
		--scrollable-safe-margin-bottom: 90px;
	}

	.l-page__nav {
		left: auto;
		right: 10px;
	}

	.l-page__back {
		font-size: 15px;
	}
}

@media print {
	.l-page {
		margin-left: 20px;
	}

	.l-page__printable-header {
		width: 100%;
		text-align: left;
	}

	.l-page__header {
		background: white;
		color: RGB(var(--color-text-primary));
		border: none;
		padding: 52px 0 0;
		height: auto;
		align-items: flex-start;
	}

	.l-page__limit {
		max-width: none;
		align-items: flex-start;
	}

	.l-page__title {
		background: RGB(var(--color-surface));
		-webkit-print-color-adjust: exact;
		padding: 6px 10px 6px 30px;
		margin: 20px 0;
	}

	.l-page__buttons,
	.l-page__nav {
		display: none;
	}

	.l-page__widget {
		display: none;
	}

	.l-page__bg {
		background: white;
	}

	.l-page__main {
		--background-color: 255, 255, 255;
	}

	.l-page__content {
		padding: 0;
	}

	.l-page.--has-sheet .l-page__main {
		margin: 0;
	}
}
</style>
