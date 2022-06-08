<template>
	<i class="c-icon" :class="sizeClass" aria-hidden="true">
		<svg class="c-icon__svg" :viewBox="viewBox" alt="">
			<path class="c-icon__path" :d="svgPathData" />
		</svg>
	</i>
</template>

<script>
export default {
	name: 'c-icon',

	props: ['src', 'size'],

	computed: {
		/**
		 * ```
		 * <c-icon src="@icons/file" />
		 * ```
		 */
		data({ src }) {
			return src.icon || src.definition?.icon || src.default?.icon;
		},

		width({ data: [width] }) {
			return width;
		},

		height({ data: [, height] }) {
			return height;
		},

		viewBox({ width, height }) {
			return `0 0 ${width} ${height}`;
		},

		svgPathData({ data: [, , svgPathData] }) {
			return svgPathData;
		},

		sizeClass({ size }) {
			return `size_${size}`;
		},
	},
};
</script>

<style lang="scss" scoped>
.c-icon {
	display: inline-block;
	width: 1em;
	height: 1em;
	overflow: visible;
	flex-shrink: 0;
}

.c-icon__svg {
	display: block;
}

.c-icon__path {
	color: inherit;
	fill: currentColor;
}

.size_xs {
	font-size: 1.6rem;
}

.size_1x,
.size_s {
	@extend %typo-s-light;
}

.size_2x,
.size_m {
	@extend %typo-m-light;
}

.size_3x,
.size_l {
	@extend %typo-l-light;
}

.size_4x,
.size_xl {
	@extend %typo-xl-light;
}

.size_5x,
.size_xxl {
	@extend %typo-xxl-light;
}
</style>
