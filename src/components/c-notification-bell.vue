<template>
	<button
		class="c-notification-bell"
		:class="{ '--animated': animate }"
		@animationend="resetAnimation"
		v-on="$listeners"
	>
		<transition name="bounce">
			<span class="c-notification-bell__badge" v-if="badge > 0"></span>
		</transition>

		<c-icon class="c-notification-bell__icon" src="@icons/notification" size="inherit" />
	</button>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-notification-bell',

	components: {
		CIcon,
	},

	data() {
		return {
			animate: false,
		};
	},

	props: {
		badge: {
			type: Number,
			default: 0,
		},
	},

	watch: {
		badge(newValue, oldValue) {
			if (newValue > oldValue) {
				this.animate = true;
			}

			/* istanbul ignore else */
			if (navigator.setAppBadge) {
				if (newValue > 0) {
					navigator.setAppBadge(newValue);
				} else {
					navigator.clearAppBadge();
				}
			}

			/* istanbul ignore next */
			if (navigator.setClientBadge) {
				if (newValue > 0) {
					navigator.setClientBadge(newValue);
				} else {
					navigator.clearClientBadge();
				}
			}
		},
	},

	methods: {
		resetAnimation() {
			this.animate = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.c-notification-bell {
	font-size: 22px;
	line-height: 0;
	margin-top: 30px;
	color: RGB(var(--color-accent-icon));
	background: transparent;
	position: relative;
	padding: 5px;
	border: none;
	outline: none;
	user-select: none;
	border-radius: 4px;
	appearance: none;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.c-notification-bell__icon {
	transform-origin: top center;
	animation-duration: 2s;
}

.c-notification-bell.--animated .c-notification-bell__icon {
	animation-name: ring;
}

.c-notification-bell__badge {
	background: RGB(var(--color-accent-error));
	color: white;
	border-radius: 6px;
	padding: 2px;
	min-width: 12px;
	min-height: 12px;
	display: flex;
	line-height: 0;
	align-items: center;
	justify-content: center;
	text-align: center;
	position: absolute;
	top: 2px;
	right: 4px;
	z-index: 1;
	overflow: hidden;
	font-weight: 400;
	font-size: 10px;
}

.bounce-leave-active,
.bounce-enter-active {
	transition: transform 200ms ease-in-out;
}

.bounce-enter {
	transform: scale(1.4);
}

.bounce-leave-to {
	transform: scale(0);
}

@keyframes ring {
	0%,
	100% {
		transform: rotate(0deg);
	}
	5% {
		transform: rotate(-30deg);
	}
	10% {
		transform: rotate(25deg);
	}
	15% {
		transform: rotate(-25deg);
	}
	20% {
		transform: rotate(20deg);
	}
	25% {
		transform: rotate(-20deg);
	}
	30% {
		transform: rotate(15deg);
	}
	35% {
		transform: rotate(-15deg);
	}
	40% {
		transform: rotate(15deg);
	}
	45% {
		transform: rotate(0deg);
	}
}
</style>
