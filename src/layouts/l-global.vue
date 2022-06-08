<template>
	<div class="l-global">
		<header class="l-global__header" ref="header">
			<slot name="header" />
		</header>

		<div class="l-global__widget">
			<slot name="main-header" />
		</div>

		<div
			class="l-global__sheet-bg"
			ref="bg"
			@recognizer-start="recognizerStart"
			@recognizer-stop="recognizerStop"
		>
			<c-sheet
				ref="sheet"
				class="l-global__sheet"
				@beforeLift="sheetLifted = true"
				@drop="sheetLifted = false"
				v-on="$listeners"
				:shift-to="120"
				:disabled="disableSheet"
			>
				<div class="l-global__sheet-header" slot="main-header" v-if="$slots['sheet-header']">
					<slot name="sheet-header" />
				</div>
				<c-overflow-container
					ref="scrolling"
					@hide-top="onHideTop"
					@visible-top="onVisibleTop"
					@hide-bottom="onHideBottom"
					@visible-bottom="onVisibleBottom"
				>
					<div class="l-global__overview">
						<slot name="profile" />
						<slot name="alert" />
						<slot />
					</div>
				</c-overflow-container>
			</c-sheet>
		</div>

		<div class="l-global__footer">
			<slot name="footer" />
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import CSheet from '@components/c-sheet';
import COverflowContainer from '@components/c-overflow-container';

const HammerAsync = () => import(/* webpackChunkName: "hammerjs" */ 'hammerjs');

export default {
	name: 'l-global',

	components: {
		CSheet,
		COverflowContainer,
	},

	props: {
		resetSheet: { type: Boolean },
		disableSheet: { type: Boolean },
	},

	data() {
		return {
			Hammer: null,
			sheetLifted: false,
			topIsVisible: true,
			bottomIsVisible: false,
		};
	},

	computed: {
		...mapState('app', ['companyId']),

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},
	},

	methods: {
		recognizerStart(e) {
			this.hammerInstance.get('pan').requireFailure(e.detail.recognizers);
		},

		recognizerStop(e) {
			this.hammerInstance.get('pan').dropRequireFailure(e.detail.recognizers);
		},

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

			/* istanbul ignore else */
			if (e.deltaY === 0 || (!sheetLifted && bottomIsVisible)) {
				return;
			}

			/* istanbul ignore else */
			if (!sheetLifted && scrollingDown) {
				return this.liftCard();
			}

			/* istanbul ignore else */
			if (scrollingUp && topIsVisible) {
				return this.dropCard();
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

			const events = 'panstart panmove';
			this.hammerInstance.add(vertical);
			this.hammerInstance.on(events, this.onBGScroll.bind(this));
		},

		sheetLifted(value) {
			this.$emit('sheet-lifted', value);
		},

		resetSheet() {
			/* istanbul ignore else */
			if (this.sheetLifted) {
				this.dropCard();
			}
		},
	},

	mounted() {
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
.l-global {
	position: relative;
	background-color: RGB(var(--color-primary));
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
	width: 100%;
}

.l-global__header {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	height: 140px;
	background-color: RGB(var(--color-primary));
	text-align: center;
	color: RGB(var(--color-text-primary-light));
}

.l-global__widget {
	display: flex;
	justify-content: center;
	flex-basis: auto;
	flex-shrink: 0;
	background-color: RGB(var(--color-surface-dark));
	width: 100%;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	align-items: flex-start;
	padding-bottom: 40px;
	margin-top: -30px;
	margin-bottom: -50px;
	z-index: 0;
}

.l-global__overview {
	flex-grow: 1;
	padding: 10px;
	background-color: RGB(var(--color-surface));
}

.l-global__overview {
	margin-bottom: var(--safe-area-bottom);
}

.l-global__sheet-header {
	transition: opacity 300ms ease;
}

.l-global__sheet-header.--hide {
	opacity: 0;
}

.l-global__sheet-bg {
	height: 100%;
	overflow: hidden;
}

.l-global__sheet {
	--background-color: #{RGB(var(--color-surface))};
	color: RGB(var(--color-surface-light));
}

@media ($on-tablet) {
	.l-global__widget {
		border-top-right-radius: 0;
	}

	.l-global__overview {
		padding: 20px;
		grid-gap: 20px;
	}
}
</style>
