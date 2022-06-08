<template>
	<div class="c-skeuomorphic-card">
		<div class="c-skeuomorphic-card__title text-fixed-m-medium">{{ title }}</div>
		<div class="c-skeuomorphic-card__value text-fixed-l-bold">{{ value }}</div>
		<div class="c-skeuomorphic-card__sub-title text-fixed-s-medium">{{ subTitle }}</div>
		<div class="c-skeuomorphic-card__product-id text-s-book" v-if="productNumber">
			<span class="a11y-hide">
				{{ $t('PRODUCT_NUMBER_ENDED_IN', { productNumber: productNumber.value }) }}
			</span>
			<span aria-hidden="true">{{ $pn(productNumber) }}</span>
		</div>
		<transition name="fade">
			<button
				class="c-skeuomorphic-card__button"
				v-if="actionable"
				@click="$emit('expand')"
				data-testid="more-info-button"
				:aria-label="$t('MORE_INFO')"
			>
				<!-- eslint-disable-next-line vue-i18n/no-raw-text -->
				<span aria-hidden="true">&#8942;</span>
			</button>
		</transition>
		<div class="c-skeuomorphic-card__glow" :class="{ '--shine': shiningAnimation }"></div>
	</div>
</template>

<script>
export default {
	name: 'c-skeuomorphic-card',

	data() {
		return {
			shiningAnimation: false,
		};
	},

	props: {
		title: {
			type: String,
			default: '',
		},

		value: {
			type: String,
			default: '',
		},

		subTitle: {
			type: String,
			default: '',
		},

		productNumber: {
			type: Object,
		},

		/**
		 * @property {Boolean} actionable Add a "View more" button
		 */
		actionable: {
			type: Boolean,
		},
	},

	methods: {
		/* istanbul ignore next */
		shine() {
			this.shiningAnimation = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.c-skeuomorphic-card {
	background: url(~@local-assets/img/card.svg) no-repeat;
	background-size: 100%;
	width: 260px;
	height: 150px;
	display: block;
	padding-left: 20px;
	position: relative;
	border-radius: 22px;
	color: white;
	text-align: left;
}

.c-skeuomorphic-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 10px;
	right: 10px;
	bottom: 0;
	box-shadow: 0 0 16px -9px rgba(2, 37, 58, 0.45);
	border-top-left-radius: inherit;
	overflow: hidden;
	z-index: -1;
}

.c-skeuomorphic-card__title {
	padding-top: 30px;
}

.c-skeuomorphic-card__value {
	padding-top: 20px;
	line-height: 1.4;
}

.c-skeuomorphic-card__sub-title {
	padding-bottom: 15px;
}

.c-skeuomorphic-card__title,
.c-skeuomorphic-card__value,
.c-skeuomorphic-card__sub-title,
.c-skeuomorphic-card__product-id {
	text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.55);
}

.c-skeuomorphic-card__button {
	appearance: none;
	position: absolute;
	top: 0;
	right: 0;
	width: 40px;
	height: 40px;
	background: RGB(var(--color-accent-icon));
	border: 0;
	border-top-right-radius: 12px;
	border-bottom-left-radius: 12px;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	font-weight: 900;
	line-height: 0;
	font-family: monospace;
	user-select: none;
}

.c-skeuomorphic-card__button:active {
	color: white;
	background: RGB(var(--color-secondary));
}

.c-skeuomorphic-card__glow {
	width: 100%;
	height: 100%;
	border-radius: inherit;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	overflow: hidden;
}

.c-skeuomorphic-card__glow.--shine::before {
	position: absolute;
	top: 0;
	left: -50%;
	z-index: 2;
	display: block;
	content: '';
	width: 50%;
	height: 100%;
	background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 100%);
	transform: skewX(-25deg);
	transform-origin: top right;
	animation: shine 550ms ease-in-out;
}

@keyframes shine {
	to {
		transform: skewX(-25deg) translateX(300%);
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 200ms;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
