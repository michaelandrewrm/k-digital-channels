<template>
	<div class="c-banner-slide">
		<div class="c-banner-slide__wrapper">
			<button class="c-banner-slide__button" @click="$emit('close')" :aria-hidden="true">
				<!-- eslint-disable-next-line vue-i18n/no-raw-text -->
				<span aria-hidden="true">&times;</span>
			</button>

			<img class="c-banner-slide__image" draggable="false" :src="data.imageURL" alt="" />

			<div class="c-banner-slide__title-wrapper">
				<h4
					class="c-banner-slide__title"
					:class="{ 'text-m-medium': isMobile, 'text-l-medium': !isMobile }"
					v-if="data.title"
				>
					{{ data.title }}
				</h4>
				<div
					class="c-banner-slide__subtitle"
					:class="{ 'text-s-light': isMobile, 'text-m-book': !isMobile }"
					v-if="data.body"
				>
					{{ data.body }}
				</div>
			</div>

			<div class="c-banner-slide__icon-wrapper" v-if="enableFeedback">
				<div class="c-banner-slide__icon">
					<c-icon-button
						class="c-banner-slide__iconbutton --unlike --fill"
						v-if="data.feedback === 0"
						icon="@icons/likeFill"
						@click="$emit('unlike')"
						:aria-label="$t('ACTIONS.UNLIKE')"
					/>
					<c-icon-button
						class="c-banner-slide__iconbutton --unlike"
						v-else
						icon="@icons/like"
						@click="$emit('unlike')"
						:aria-label="$t('ACTIONS.UNLIKE')"
					/>
				</div>
				<div class="c-banner-slide__icon">
					<c-icon-button
						class="c-banner-slide__iconbutton --like --fill"
						v-if="data.feedback === 1"
						icon="@icons/likeFill"
						@click="$emit('like')"
						:aria-label="$t('ACTIONS.LIKE')"
					/>
					<c-icon-button
						class="c-banner-slide__iconbutton --like"
						v-else
						icon="@icons/like"
						@click="$emit('like')"
						:aria-label="$t('ACTIONS.LIKE')"
					/>
				</div>
			</div>
		</div>
		<router-link
			v-if="data.link && data.ctaAction === 'open_internal'"
			:to="data.link"
			class="c-banner-slide__cta-button text-m-medium"
		>
			<span>{{ data.ctaText }}</span>
		</router-link>
		<a
			v-if="data.link && data.ctaAction === 'open_external'"
			:href="data.link"
			target="_blank"
			class="c-banner-slide__cta-button text-m-medium"
		>
			<span>{{ data.ctaText }}</span>
		</a>
	</div>
</template>

<script>
import CIconButton from '@components/c-icon-button';
import mq from '@utils/matchMedia';
import { onMobile } from '@theme';

export default {
	name: 'c-banner-slide',

	components: {
		CIconButton,
	},

	props: {
		data: { type: Object, required: true },
		enableFeedback: { type: Boolean },
	},

	computed: {
		isMobile: mq(onMobile),
	},
};
</script>

<style lang="scss" scoped>
.c-banner-slide {
	display: flex;
	flex-direction: column;
	width: 100%;
	text-align: center;
}

.c-banner-slide__wrapper {
	width: 100%;
	padding: 0;
	color: RGB(var(--color-text-primary-light));
	text-align: center;
	position: relative;
	display: flex;
	align-items: flex-start;
	justify-content: flex-end;
}

.c-banner-slide__image {
	align-items: center;
	width: 100%;
	height: auto;
	background-color: RGB(var(--color-secondary));
	max-height: 260px;
	object-fit: contain;
	border-radius: $border-radius-m;
	border-top-right-radius: 20px;
	overflow: hidden;
	max-width: 400px;
}

.c-banner-slide__title-wrapper {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	text-align: left;
	padding: 10px;
	padding-right: 200px;
	background: linear-gradient(
		90deg,
		RGB(var(--color-primary-dark)) 50%,
		RGBA(var(--color-primary-dark), 0.1) 80%
	);
	border-radius: $border-radius-m;
	border-top-right-radius: 13px;
}

.c-banner-slide__title {
	color: RGB(var(--color-secondary-light));
}

.c-banner-slide__subtitle {
	color: RGB(var(--color-text-primary-light));
	margin-top: 10px;
}

.c-banner-slide__button {
	z-index: 1;
	appearance: none;
	position: absolute;
	top: 0;
	right: 0;
	width: 36px;
	height: 36px;
	padding-bottom: 8px;
	background: white;
	border: 0;
	border-top-right-radius: 12px;
	border-bottom-left-radius: 12px;
	color: RGB(var(--color-accent-primary));
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36px;
	font-weight: 100;
	line-height: 0;
	font-family: inherit;
	user-select: none;
	--focus-ring-padding: 2px;
}

.c-banner-slide__icon-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	bottom: 10px;
	right: 0;
}

.c-banner-slide__icon {
	font-size: 30px;
	margin: 0 10px;
	cursor: pointer;
}

.c-banner-slide__iconbutton {
	font-size: 25px;
	padding-bottom: 5px;
	filter: drop-shadow(0px 0px 1px RGBA(var(--color-text-secondary), 0.5));
}

.c-banner-slide__iconbutton.--unlike {
	transform: rotate(180deg);
}

.c-banner-slide__iconbutton.--fill {
	color: RGB(var(--color-text-secondary-light));
}

.c-banner-slide__iconbutton.--like.--fill {
	animation: scale 1.5s ease-in-out forwards;
}

.c-banner-slide__cta-button {
	background: RGB(var(--color-surface-light));
	color: RGB(var(--color-text-primary));
	width: 100%;
	border: 0;
	height: 48px;
	text-transform: uppercase;
	border-bottom-left-radius: $border-radius-m;
	border-bottom-right-radius: $border-radius-m;
	box-shadow: 0px 5px 10px -10px RGB(0 0 0 / 30%);
	text-decoration: none;
	display: flex;
	align-items: center;
	justify-content: center;
}

@keyframes scale {
	1% {
		transform: scale(0);
	}
	10% {
		transform: scale(0);
	}
	35% {
		transform: scale(1.4);
	}
	40% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.15);
	}
	65% {
		transform: scale(1);
	}
	90% {
		transform: scale(1);
	}
	100% {
		transform: scale(1);
	}
}
</style>
