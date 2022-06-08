<template>
	<header class="c-parallax-header" :class="projectClass">
		<div class="parallax-layer a0" ref="1"></div>
		<div class="parallax-layer a1" ref="2"></div>
		<div class="parallax-layer a2" ref="3"></div>
		<slot />
	</header>
</template>

<script>
import mq from '@utils/matchMedia';
import { onMobile } from '@theme';

export default {
	name: 'c-parallax-header',

	data() {
		return {
			width: 0,
			height: 0,
			rotation: {
				x: 0,
				y: 0,
			},
			projectClass: `--project-${process.env.VUE_APP_CURRENT_PROJECT}`,
		};
	},

	computed: {
		onMobile: mq(onMobile),
	},

	watch: {
		rotation: {
			deep: true,
			handler({ x, y }) {
				const { width, height } = this;
				const deg = 45;
				const moveX = ((width / 2) * y) / deg;
				const moveY = ((width / 2) * x) / deg;

				requestAnimationFrame(() => {
					this.parallaxMove(Object.values(this.$refs), moveX, moveY, width, height);
				});
			},
		},
	},

	methods: {
		onResize() {
			this.width = this.$el.offsetWidth;
			this.height = this.$el.offsetHeight;
		},

		onDeviceOrientationChanges({ gamma, beta }) {
			const deg = 45;
			this.rotation.y = Math.min(Math.max(Math.floor(gamma), -deg), deg);
			this.rotation.x = Math.min(Math.max(Math.floor(beta), -deg), deg);
		},

		parallaxMove(layers, x, y, boxWidth, boxHeight) {
			const strength = 0.2;
			const depths = [0.1, 0.4, 1];

			layers.forEach((el, index) => {
				const depth = depths[index];

				const moveX = (boxWidth / 2 - x) * (strength * depth);
				const moveY = (boxHeight / 2 - y) * (strength * depth);

				/* istanbul ignore else */
				if (el?.style) {
					// eslint-disable-next-line no-param-reassign
					el.style.transform = `translate(${moveX}px, ${moveY}px)`;
				}
			});
		},
	},

	mounted() {
		if (this.onMobile && window.navigator.hardwareConcurrency >= 4) {
			this.onResize();
			window.addEventListener('deviceorientation', this.onDeviceOrientationChanges);
			window.addEventListener('resize', this.onResize);
		}
	},

	beforeDestroy() {
		window.removeEventListener('deviceorientation', this.onDeviceOrientationChanges);
		window.removeEventListener('resize', this.onResize);
	},
};
</script>

<style lang="scss" scoped>
.c-parallax-header {
	display: flex;
	width: 100%;
	height: 100%;
	align-items: flex-start;
	justify-content: center;
	padding: 0 10px;
	position: relative;
	overflow: hidden;
	z-index: 0;
	contain: strict;
}

.a0 {
	position: absolute;
	top: -25%;
	left: -25%;
	z-index: 0;
	width: 150%;
	height: 150%;
	z-index: -1;
}

.a1 {
	position: absolute;
	top: -25%;
	left: -25%;
	width: 150%;
	height: 150%;
	background-repeat: repeat-x;
	background-size: 100%;
	background-position: 0 100%;
	z-index: -1;
}

.a2 {
	position: absolute;
	top: -25%;
	left: -25%;
	width: 150%;
	height: 150%;
	background-repeat: repeat-x;
	background-size: 100%;
	background-position: 30px 100%;
	z-index: -1;
}

.c-parallax-header.--project-caminos {
	.a0 {
		background-image: var(--color-gradient-header);
	}
	.a1 {
		background-image: var(--color-gradient-global-pos);
	}
	.a2 {
		display: none;
	}
}

.c-parallax-header.--project-bancofar {
	.a0 {
		background-image: var(--color-gradient-global-pos);
	}
	.a1 {
		background-image: url('data:image/svg+xml,%3Csvg width="1101" height="262" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient y2="153.358%25" y1="0%25" x2="50%25" x1="50%25" id="a"%3E%3Cstop stop-opacity="0.06" stop-color="%23D1E5F2" offset="0%25"/%3E%3Cstop stop-color="%23ffffff00" offset="100%25"/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg%3E%3Cpath stroke-width="1" d="m0,40.126015c83.999,-39.26 163.61,-30.937 238.833,24.97c112.836,83.861 188.91,14.855 259.245,-20.099c70.333,-34.954 155.084,-86.891 266.508,13.373c74.284,66.843 186.421,72.66 336.414,17.45l0,188.18l-1101,0l0,-223.874z" stroke-opacity="0.15" stroke="%23FFF" fill-rule="evenodd" fill="url(%23a)"/%3E%3C/g%3E%3C/svg%3E');
	}
	.a2 {
		background-image: url('data:image/svg+xml,%3Csvg width="1101" height="262" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient y2="153.358%25" y1="0%25" x2="50%25" x1="50%25" id="a"%3E%3Cstop stop-opacity="0.06" stop-color="%23D1E5F2" offset="0%25"/%3E%3Cstop stop-color="%23ffffff00" offset="100%25"/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg%3E%3Cpath stroke-width="1" d="m0,40.126015c83.999,-39.26 163.61,-30.937 238.833,24.97c112.836,83.861 188.91,14.855 259.245,-20.099c70.333,-34.954 155.084,-86.891 266.508,13.373c74.284,66.843 186.421,72.66 336.414,17.45l0,188.18l-1101,0l0,-223.874z" stroke-opacity="0.15" stroke="%23FFF" fill-rule="evenodd" fill="url(%23a)"/%3E%3C/g%3E%3C/svg%3E');
	}
}
</style>
