<template>
	<div class="c-slide">
		<img draggable="false" :src="data.imageURL" :alt="data.title" />
		<h3 class="text-fixed-xl-medium" v-if="data.title">{{ data.title }}</h3>
		<p class="text-m-book" v-if="data.body">{{ data.body }}</p>

		<div class="c-slide__icon-wrapper" v-if="enableFeedback">
			<div class="c-slide__icon">
				<c-icon-button
					class="c-slide__iconbutton --unlike --fill"
					v-if="data.feedback === 0"
					icon="@icons/likeFill"
					@click="$emit('unlike')"
					:aria-label="$t('ACTIONS.UNLIKE')"
				/>
				<c-icon-button
					class="c-slide__iconbutton --unlike"
					v-else
					icon="@icons/like"
					@click="$emit('unlike')"
					:aria-label="$t('ACTIONS.UNLIKE')"
				/>
			</div>
			<div class="c-slide__icon">
				<c-icon-button
					class="c-slide__iconbutton --like --fill"
					v-if="data.feedback === 1"
					icon="@icons/likeFill"
					@click="$emit('like')"
					:aria-label="$t('ACTIONS.LIKE')"
				/>
				<c-icon-button
					class="c-slide__iconbutton --like"
					v-else
					icon="@icons/like"
					@click="$emit('like')"
					:aria-label="$t('ACTIONS.LIKE')"
				/>
			</div>
		</div>

		<router-link
			v-if="data.ctaRedirect && data.ctaAction === 'open_internal'"
			:to="data.ctaRedirect"
			custom
			v-slot="{ route }"
		>
			<c-button
				raised
				v-if="data.ctaRedirect && data.ctaAction === 'open_internal'"
				class="c-slide__ctabutton"
				@click="redirectTo(route.fullPath)"
			>
				<span>{{ data.ctaText }}</span>
			</c-button>
		</router-link>
		<c-button
			v-if="data.ctaRedirect && data.ctaAction === 'open_external'"
			:href="data.ctaRedirect"
			target="_blank"
			raised
			class="c-slide__ctabutton"
		>
			<span>{{ data.ctaText }}</span>
		</c-button>
	</div>
</template>

<script>
import CIconButton from '@components/c-icon-button';
import CButton from '@components/c-button';

export default {
	name: 'c-slide',

	components: {
		CIconButton,
		CButton,
	},

	props: {
		data: { type: Object },
		enableFeedback: { type: Boolean },
	},

	methods: {
		redirectTo(url) {
			this.$el.dispatchEvent(new Event('close', { bubbles: true }));
			this.$router.push(url);
		},
	},
};
</script>

<style lang="scss" scoped>
.c-slide {
	width: 280px;
	padding: 0;
	color: RGB(var(--color-text-primary-light));
	overflow: hidden;
	text-align: center;
	img {
		align-items: center;
		width: 100%;
		height: auto;
		border-radius: $border-radius-m;
		background-color: RGB(var(--color-secondary));
		max-height: 260px;
		object-fit: contain;
	}
	h3 {
		color: RGB(var(--color-text-primary-light));
		line-height: 1.3;
	}
	p {
		line-height: 1.5;
	}
}

.c-slide__icon-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
}

.c-slide__icon {
	font-size: 30px;
	margin: 0 10px;
	cursor: pointer;
}

.c-slide__iconbutton {
	font-size: 25px;
	padding-bottom: 5px;
}

.c-slide__iconbutton.--unlike {
	transform: rotate(180deg);
}

.c-slide__iconbutton.--fill {
	color: RGB(var(--color-text-secondary-light));
}

.c-slide__iconbutton.--like.--fill {
	animation: scale 1.5s ease-in-out forwards;
}

.c-slide__ctabutton {
	min-width: 260px;
	margin-top: 20px;
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

@media ($on-mobile) {
	.c-slide {
		width: 100%;
		img {
			margin-bottom: 10px;
		}
		> * {
			margin-bottom: 16px;
		}
	}
}

@media ($on-tablet) {
	.c-slide {
		width: 474px;
		text-align: inherit;
		> * {
			margin-bottom: 32px;
		}
		h3 {
			font-weight: 400;
		}
		p {
			margin-bottom: 40px;
		}
	}
}
</style>
