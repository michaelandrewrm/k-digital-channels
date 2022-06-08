<template>
	<div
		ref="main"
		class="c-sheet"
		:class="classes"
		:style="styles"
		@transitionend.self="onCardboardDropped"
	>
		<div slot="top">
			<div class="c-sheet__header">
				<div class="c-sheet__header_start"></div>
				<div class="c-sheet__header_notch" v-if="notch">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="376"
						height="50"
						viewBox="0 0 376 50"
						aria-hidden="true"
					>
						<path
							d="M0 0C-7.87 0 -7.13 0 2.2 0C10.32 0.63 18.16 3.28 25 7.7C30.8 12.2 40 15 50 15C58.4 15 66 13.1 71.8 9.9C71.9 9.84 72.7 9.36 72.8 9.3C80.23 4.19 88.83 1.03 97.8 0.1C102.08 0.1 102.81 0.1 100 0.1L100 50L0 50L0 0.1L2.2 0.1L0 0L0 0Z"
						></path>
					</svg>
				</div>
				<div class="c-sheet__header_end" v-if="notch"></div>
			</div>

			<slot name="main-header" />
		</div>

		<slot />
	</div>
</template>

<script>
export default {
	name: 'c-sheet',

	data() {
		return {
			lifted: false,
			animated: false,
			shadow: false,
			dropping: false,
			top: 0,
		};
	},

	props: {
		disabled: { type: Boolean, default: false },
		notch: { type: Boolean, default: false },
		shiftTo: { type: Number, default: 0 },
	},

	computed: {
		classes({ disabled, lifted, animated, shadow }) {
			return {
				'--disabled': disabled,
				'--expanded': animated,
				'--animate': lifted,
				'--shadow': shadow,
			};
		},

		styles({ animated, shiftTo, shadow, top }) {
			if (animated) {
				const shiftedHeight = `calc(100% - ${shiftTo}px)`;
				const originalPos = 'translateY(0px)';
				const shiftedPos = `translateY(${top - shiftTo}px)`;

				return {
					height: shiftedHeight,
					transform: shadow ? originalPos : shiftedPos,
				};
			}

			// default
			return { height: '100%', transform: '' };
		},
	},

	methods: {
		liftCardboard() {
			/* istanbul ignore next */
			if (this.disabled || this.lifted) {
				return;
			}

			const node = this.$refs.main;
			const { top } = node.getBoundingClientRect();

			this.$emit('beforeLift');
			this.animated = true;
			this.dropping = false;

			this.top = top;

			// double raf to prevent running the code in the same frame
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					this.lifted = true;
					this.shadow = true;

					this.$emit('lift');
				});
			});
		},

		dropCardboard() {
			/* istanbul ignore next */
			if (!this.lifted) {
				return;
			}

			this.$emit('beforeDrop');
			this.dropping = true;
			this.shadow = false;
		},

		onCardboardDropped() {
			/* istanbul ignore next */
			if (!this.dropping) {
				return;
			}

			this.lifted = false;
			this.animated = false;
			this.dropping = false;

			this.$emit('drop');
		},
	},
};
</script>

<style lang="scss" scoped>
.c-sheet {
	position: relative;
	will-change: transform;
	display: flex;
	flex-direction: column;
	--background-color: #{RGB(var(--color-surface))};
	--shadow-color: var(--background-color);
}

.c-sheet.--animate {
	transition: transform 400ms ease-in-out;
}

.c-sheet.--expanded {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	margin: 0;
}

.c-sheet__header {
	height: 50px;
	padding-top: 20px;
	overflow: hidden;
	contain: strict;
	display: flex;
}

.c-sheet.--disabled .c-sheet__header {
	height: 20px;
	padding-top: 10px;
}

.c-sheet__header_start,
.c-sheet__header_end {
	background: var(--background-color);
	flex-grow: 1;
}

.c-sheet__header_start {
	border-top-left-radius: $border-radius-xl;
	transition: box-shadow 350ms;
}

.c-sheet__header_start:first-child:last-child {
	border-top-right-radius: $border-radius-xl;
}

.c-sheet__header_notch {
	flex-grow: 0;
	width: 100px;
	flex-shrink: 0;
	position: relative;
	z-index: 1;
	transform: scale(1.05);
	transform-origin: top center;
	will-change: transform;
}

.c-sheet__header_notch path {
	fill: var(--background-color);
}

.c-sheet__header_end {
	border-top-right-radius: $border-radius-xl;
	transition: box-shadow 350ms;
}

.c-sheet .c-sheet__header_start::before,
.c-sheet .c-sheet__header_end::before {
	content: '';
	width: 100%;
	box-shadow: 3px 5px 10px black;
	display: block;
	height: 100%;
	border-radius: inherit;
	opacity: 0;
	transition: opacity 300ms;
}

.c-sheet .c-sheet__header_end::before {
	box-shadow: -3px 5px 10px black;
}

.c-sheet.--shadow .c-sheet__header_start::before,
.c-sheet.--shadow .c-sheet__header_end::before {
	opacity: 1;
}

@media print {
	.c-sheet__header {
		display: none;
	}
}
</style>
