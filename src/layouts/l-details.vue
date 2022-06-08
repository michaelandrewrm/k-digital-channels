<template>
	<main class="l-details" :class="classNames">
		<nav class="l-details__nav">
			<button
				v-if="closable"
				class="l-details__back"
				@click="$router.back()"
				:aria-label="$t('ACTIONS.GO_BACK')"
				data-testid="back-button"
			>
				<c-icon src="@icons/close" v-if="isDesktop" />
				<c-icon src="@icons/back" v-else />
			</button>
		</nav>

		<div class="l-details__printable-header media-screen-hide">
			<slot name="printable-header" />
		</div>

		<header class="l-details__header text-l-bold" ref="header">
			<div class="l-details__title">
				<slot name="header" />
			</div>
		</header>

		<div class="l-details__action-icon" v-if="$slots.help">
			<slot name="help" />
		</div>

		<div class="l-details__widget" v-if="$slots.widget">
			<div class="l-details__widget__wrapper">
				<slot name="widget" />
			</div>
		</div>

		<div class="l-details__bg" data-testid="page-details-body" ref="bg">
			<slot name="main-pre-content" />
			<c-sheet
				ref="sheet"
				class="l-details__main"
				:notch="Boolean($slots.widget)"
				@beforeLift="sheetLifted = true"
				@drop="sheetLifted = false"
				v-on="$listeners"
				:shift-to="120"
			>
				<div class="l-details__search" v-if="$slots['main-header']" slot="main-header">
					<div class="l-details__search-center">
						<slot name="main-header" />
					</div>
				</div>

				<c-overflow-container
					ref="scrolling"
					@hide-top="onHideTop"
					@visible-top="onVisibleTop"
					@hide-bottom="onHideBottom"
					@visible-bottom="onVisibleBottom"
				>
					<div class="l-details__main-center">
						<slot />
					</div>
				</c-overflow-container>
			</c-sheet>
		</div>

		<transition name="l-details__transition_buttons">
			<div class="l-details__actions" v-if="showButtons">
				<div
					class="l-details__buttons"
					data-testid="page-buttons"
					ref="buttons"
					role="region"
					:aria-label="$t('ACTIONS.OPTIONS')"
				>
					<slot name="buttons" />
				</div>
			</div>
		</transition>
	</main>
</template>

<script>
import CIcon from '@components/c-icon';
import CSheet from '@components/c-sheet';
import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';
import COverflowContainer from '@components/c-overflow-container';

const HammerAsync = () => import(/* webpackChunkName: "hammerjs" */ 'hammerjs');

export default {
	name: 'l-details',

	components: {
		CSheet,
		CIcon,
		COverflowContainer,
	},

	provide() {
		return { layout: this.layoutElements };
	},

	props: {
		closable: { type: Boolean, default: true },
	},

	data() {
		return {
			hasButtons: null,
			Hammer: null,
			sheetLifted: false,
			topIsVisible: true,
			bottomIsVisible: false,
			layoutElements: { scrollingElement: null },
		};
	},

	computed: {
		isDesktop: mq(onDesktop),

		showButtons({ hasButtons, sheetLifted }) {
			return hasButtons && !sheetLifted;
		},

		classNames({ showButtons }) {
			return { '--has-buttons': showButtons };
		},
	},

	methods: {
		setFocusToFirstTitle() {
			const focusableTitle = ['h1', 'h2', 'h3'].join(', ');
			const titles = this.$refs.header.querySelectorAll(focusableTitle);

			if (titles.length) {
				titles[0].focus();
			}
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
			this.$refs.sheet.liftCardboard();
		},

		dropCard() {
			this.$refs.sheet.dropCardboard();
		},

		onBGScroll(e) {
			const { sheetLifted, topIsVisible, bottomIsVisible } = this;
			const scrollInverted = e.type === 'panmove';
			const scrollingDown = scrollInverted ? e.deltaY < 0 : e.deltaY > 0;
			const scrollingUp = !scrollingDown;

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

	watch: {
		Hammer(Hammer) {
			const { DIRECTION_VERTICAL, Pan } = Hammer;

			this.hammerInstance = new Hammer(this.$refs.bg);

			const vertical = new Pan({
				event: 'pan',
				direction: DIRECTION_VERTICAL,
			});

			const events = 'panmove';
			this.hammerInstance.add([vertical]);
			this.hammerInstance.on(events, this.onBGScroll.bind(this));
		},
	},

	updated() {
		this.hasButtons = Boolean(this.$slots.buttons);
		this.layoutElements.scrollingElement = this.$refs.scrolling?.$refs?.scrolling;
	},

	mounted() {
		this.hasButtons = Boolean(this.$slots.buttons);
		this.$nextTick(this.setFocusToFirstTitle);

		this.$refs.bg.addEventListener('wheel', this.onBGScroll, { passive: false });
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

		this.$refs.bg.removeEventListener('wheel', this.onBGScroll, { passive: false });
	},
};
</script>

<style lang="scss" scoped>
.l-details {
	position: relative;
	background: RGB(var(--color-primary));
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}

.l-details__header {
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	height: 140px;
	padding: 0 16px 70px;
	background-image: var(--color-gradient-header);
	background-size: 100%;
	text-align: center;
	color: RGB(var(--color-text-primary-light));
	padding-bottom: 70px;
	will-change: opacity;
}

.l-details__bg {
	background: RGB(var(--color-surface));
	height: 100%;
	margin-top: -30px;
	padding-top: 10px;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	will-change: opacity;
}

.l-details__widget + .l-details__bg {
	margin-top: 0;
	padding-top: 0;
	border-radius: 0;
}

.l-details__nav {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 11px;
	left: 0px;
	z-index: 1;
	width: 38px;
	height: 50px;
}

.l-details__back {
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

.l-details__action-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 11px;
	right: 0px;
	z-index: 1;
	height: 50px;
}

.l-details__main {
	color: RGB(var(--color-surface));
	margin-top: -15px;
	margin-bottom: -25px;
}

.l-details__search {
	background: RGB(var(--color-surface));
	color: RGB(var(--color-text-primary));
	padding-bottom: 10px;
	position: relative;
}

.l-details__search-center {
	width: 100%;
	max-width: $theme-max-width;
	margin: 0 auto;
	padding-left: 20px;
	padding-right: 20px;
	color: RGB(var(--color-text-primary));
}

.l-details__main-center {
	width: 100%;
	max-width: $theme-max-width;
	margin: 0 auto;
	padding-left: 20px;
	padding-right: 20px;
	color: RGB(var(--color-text-primary));
	flex-shrink: 0;
}

.l-details__widget {
	display: flex;
	justify-content: center;
	flex-basis: auto;
	flex-shrink: 0;
	background-color: RGB(var(--color-surface));
	color: RGB(var(--color-surface));
	width: 100%;
	min-height: $border-radius-xl;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	margin-left: auto;
	margin-right: auto;
	margin-top: -30px;
	will-change: opacity;
}

.l-details__widget__wrapper {
	margin-top: -40px;
	margin-bottom: 10px;
	min-height: 40px;
	display: flex;
	justify-content: center;
	flex-grow: 1;
	width: 100%;
	will-change: opacity;
}

.l-details__actions {
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
}

.l-details__buttons {
	display: grid;
	width: 100%;
	max-width: 400px;
	gap: 10px;
	grid-auto-flow: column;
	grid-auto-columns: 1fr auto;
}

.l-details.--has-buttons .l-details__bg {
	--scrollable-safe-margin-bottom: 55px;
	overflow: hidden;
}

.l-details.--has-buttons .l-details__main-center {
	padding-bottom: 70px;
}

.l-details__transition_buttons-enter-active,
.l-details__transition_buttons-leave-active {
	transition: transform 300ms ease-in-out;
}

.l-details__transition_buttons-enter,
.l-details__transition_buttons-leave-to {
	transform: translateY(100%);
}

@media ($on-desktop) {
	.l-details__bg,
	.l-details__widget {
		border-top-left-radius: 0;
	}

	.l-details__actions {
		height: 90px;
	}

	.l-details__nav {
		left: auto;
		right: 10px;
	}

	.l-details__action-icon {
		right: auto;
		left: 10px;
	}

	.l-details__back {
		font-size: 15px;
	}
}

@media print {
	.l-details {
		margin-left: 20px;
	}

	.l-details__printable-header {
		width: 100%;
		text-align: left;
		background: white;
		color: RGB(var(--color-text-primary));
		padding: 52px 0 0;
		height: auto;
		align-items: flex-start;
	}

	.l-details__header {
		padding: 0;
		margin: 0;
		background: white;
		color: RGB(var(--color-text-primary));
		height: auto;
		display: block;
		text-align: left;
	}

	.l-details__title {
		background: RGB(var(--color-surface));
		-webkit-print-color-adjust: exact;
		padding: 6px 10px 6px 30px;
		margin: 20px 0;
	}

	.l-details__buttons,
	.l-details__nav {
		display: none;
	}

	.l-details__widget {
		display: none;
	}

	.l-details__bg {
		background: white;
		margin: 0;
	}

	.l-details__main {
		--background-color: 255, 255, 255;
		margin: 0;
	}

	.l-details__content {
		padding: 0;
	}

	.l-details__main-center {
		padding: 0;
		max-width: none;
	}
}
</style>
