<template>
	<div class="c-overflow-container">
		<slot name="top" />
		<div class="c-overflow-container__wrapper">
			<div class="shadow-top" ref="shadowTop"></div>

			<div class="scrolling" ref="scrolling" tabindex="-1" role="region">
				<div
					class="sentinel"
					data-noderelated="shadowTop"
					data-position="top"
					ref="sentinelTop"
				></div>
				<slot />
				<div
					class="sentinel"
					data-noderelated="shadowBottom"
					data-position="bottom"
					ref="sentinelBottom"
				></div>
			</div>

			<div class="shadow-bottom" ref="shadowBottom"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'c-overflow-container',

	data() {
		return {
			observer: null,
		};
	},

	props: {
		observeTop: {
			type: Boolean,
			default: true,
		},
		observeBottom: {
			type: Boolean,
			default: true,
		},
	},

	computed: {
		triggerObservable({ observeTop, observeBottom, observer }) {
			return [observer, observeTop, observeBottom];
		},
	},

	watch: {
		triggerObservable([observer, observeTop, observeBottom]) {
			/* istanbul ignore else */
			if (observer) {
				observer[observeTop ? 'observe' : 'unobserve'](this.$refs.sentinelTop);
				observer[observeBottom ? 'observe' : 'unobserve'](this.$refs.sentinelBottom);
			}
		},
	},

	mounted() {
		const options = {
			root: this.$refs.scrolling,
			rootMargin: '0px',
			threshold: [1],
		};
		const callback = (entries) => {
			entries.forEach(({ target, isIntersecting }) => {
				const node = this.$refs[target.dataset.noderelated];

				if (isIntersecting) {
					node.classList.remove('--show');
					this.$emit(`visible-${target.dataset.position}`);
				} else {
					node.classList.add('--show');
					this.$emit(`hide-${target.dataset.position}`);
				}
			});
		};

		const observer = new IntersectionObserver(callback, options);

		this.observer = observer;
	},

	beforeDestroy() {
		this.observer.disconnect();
		this.observer = null;
	},
};
</script>

<style lang="scss" scoped>
$shadow-height: 20px;

.c-overflow-container {
	flex-shrink: 1;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.c-overflow-container__wrapper {
	flex-shrink: 1;
	flex-grow: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	height: 100%;
	background-color: var(--background-color, inherit);
}

.scrolling {
	overflow-y: auto;
	overflow-y: overlay;
	overflow-x: hidden;
	-webkit-overflow-scrolling: touch;
	overscroll-behavior-y: contain;
	margin-top: -$shadow-height;
	margin-bottom: -$shadow-height;
	display: flex;
	flex-direction: column;
	height: 100%;
	will-change: opacity;
	padding-top: 0;
	padding-bottom: var(--scrollable-safe-margin-bottom, 0);
}

.shadow-bottom,
.shadow-top {
	--color: var(--shadow-color, currentColor);
	height: $shadow-height;
	background: linear-gradient(to bottom, var(--color) 50%, RGBA(var(--color-surface-light), 0));
	position: relative;
	width: 100%;
	left: 0;
	right: 0;
	flex-shrink: 0;
	z-index: $layer-dropdown-z-index;
	opacity: 0;
	transition: opacity 100ms ease;
	pointer-events: none;
}

.shadow-bottom.--show,
.shadow-top.--show {
	opacity: 1;
}

.shadow-bottom {
	--color: var(--shadow-color, currentColor);
	background: linear-gradient(to top, var(--color) 50%, RGBA(var(--color-surface-light), 0));
}

.sentinel {
	height: 1px;
	width: 1px;
	background: transparent;
	position: relative;
	flex-shrink: 0;
	margin: 0 auto;
	pointer-events: none;
}
</style>
