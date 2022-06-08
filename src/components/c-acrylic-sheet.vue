<template>
	<div class="c-acrylic-sheet" :class="{ '--dotted': dotted, '--theme-dark': theme === 'dark' }">
		<div class="c-acrylic-sheet__grid">
			<div class="c-acrylic-sheet__col1">
				<span class="c-acrylic-sheet__icon">
					<slot name="icon" />
				</span>
			</div>
			<div class="c-acrylic-sheet__col2">
				<slot />
				<transition name="fade">
					<button
						class="c-acrylic-sheet__button"
						v-if="actionable"
						@click="$emit('expand')"
						data-testid="more-info-button"
						:aria-label="$t('MORE_INFO')"
					>
						<!-- eslint-disable-next-line vue-i18n/no-raw-text -->
						<span aria-hidden="true">&#8942;</span>
					</button>
				</transition>
			</div>
		</div>
		<slot name="footer" />
	</div>
</template>

<script>
export default {
	name: 'c-acrylic-sheet',

	props: {
		/**
		 * @property {Boolean} actionable Add a "View more" button
		 */
		actionable: { type: Boolean },

		/**
		 * @property {Boolean} dotted Add a dotted border on bottom
		 */
		dotted: { type: Boolean },

		theme: { type: String, default: 'light' },
	},
};
</script>

<style lang="scss" scoped>
.c-acrylic-sheet {
	--c-acrylic-bg-stop-1: var(--color-gradient-acrylic-sheet-stop-1);
	--c-acrylic-bg-stop-2: var(--color-gradient-acrylic-sheet-stop-2);
	--c-acrylic-bg-stop-3: var(--color-gradient-acrylic-sheet-stop-3);
	--c-acrylic-bg-stop-4: var(--color-gradient-acrylic-sheet-stop-4);

	position: relative;
	width: 100%;
	margin: 0 auto;
	color: var(--c-acrylic-color, RGB(var(--color-text-primary-light)));
	border-top-left-radius: $border-radius-l;
	border-top-right-radius: $border-radius-l;
	background: var(
		--c-acrylic-bg,
		var(
			--color-gradient-acrylic-sheet-background,
			linear-gradient(
				180deg,
				RGB(var(--c-acrylic-bg-stop-1)) 0,
				RGB(var(--c-acrylic-bg-stop-2)) 30px,
				RGB(var(--c-acrylic-bg-stop-3)) 50px,
				RGB(var(--c-acrylic-bg-stop-4))
			)
		)
	);
	text-align: left;
}

.c-acrylic-sheet.--theme-dark {
	--c-acrylic-bg-stop-1: var(
		--color-gradient-dark-acrylic-sheet-stop-1,
		var(--color-gradient-acrylic-sheet-stop-1)
	);
	--c-acrylic-bg-stop-2: var(
		--color-gradient-dark-acrylic-sheet-stop-2,
		var(--color-gradient-acrylic-sheet-stop-2)
	);
	--c-acrylic-bg-stop-3: var(
		--color-gradient-dark-acrylic-sheet-stop-3,
		var(--color-gradient-acrylic-sheet-stop-3)
	);
	--c-acrylic-bg-stop-4: var(
		--color-gradient-dark-acrylic-sheet-stop-4,
		var(--color-gradient-acrylic-sheet-stop-4)
	);
}

.c-acrylic-sheet:not(.--dotted) {
	border-radius: $border-radius-l;
}

.c-acrylic-sheet::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	box-shadow: 0 -10px 16px -10px rgba(0, 0, 0, 0.35);
	will-change: opacity;
	border-top-left-radius: $border-radius-l;
	border-top-right-radius: $border-radius-l;
	overflow: hidden;
}

.c-acrylic-sheet:not(.--dotted) .c-acrylic-sheet::before {
	border-radius: $border-radius-l;
}

.c-acrylic-sheet.--dotted::after {
	content: '';
	overflow: hidden;
	position: absolute;
	bottom: 0.1px; /* fix firefox subpixel bug */
	left: -50%;
	right: 0;
	height: 8px;
	width: 200%;
	background-image: repeating-radial-gradient(
		circle,
		var(--c-acrylic-dotted-color, RGB(var(--c-acrylic-bg-stop-4))) 0px,
		var(--c-acrylic-dotted-color, RGB(var(--c-acrylic-bg-stop-4))) 11px,
		transparent 11px,
		transparent 100%
	);
	background-size: 20px 33px;
	transform: scaleX(0.5) rotate(180deg);
	transform-origin: bottom;
	pointer-events: none;
}

.c-acrylic-sheet__grid {
	padding: 15px 0;
	display: flex;
	flex-direction: row;
	position: relative;
}

.c-acrylic-sheet__col1 {
	width: 76px;
	flex-shrink: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.c-acrylic-sheet__col2 {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	padding: 0 20px 0 0;
	overflow: hidden;
}

.c-acrylic-sheet__icon {
	font-size: 28px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--c-acrylic-color, RGB(var(--color-secondary-light)));
}

.c-acrylic-sheet__button {
	appearance: none;
	position: absolute;
	top: 0;
	right: 0;
	width: 40px;
	height: 40px;
	background: white;
	border: 0;
	border-top-right-radius: min($border-radius-l, 12px);
	border-bottom-left-radius: 12px;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);
	color: var(--c-acrylic-color, RGB(var(--color-primary-dark)));
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	font-weight: 900;
	line-height: 0;
	font-family: monospace;
	user-select: none;
	--focus-ring-padding: 2px;
}

.c-acrylic-sheet__button:active {
	color: white;
	background: RGB(var(--color-secondary));
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
