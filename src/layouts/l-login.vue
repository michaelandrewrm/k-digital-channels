<template>
	<div class="l-login-grid" :class="{ '--has-aside': $slots.aside }">
		<div class="l-login-content">
			<div class="l-login-content-wrap">
				<slot />
			</div>
		</div>
		<div v-if="$slots.aside" class="l-login-aside">
			<slot name="aside" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'l-login',
};
</script>

<style lang="scss" scoped>
.l-login-grid {
	display: grid;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	grid-template-columns: 100%;
	grid-template-rows: 100%;
	grid-template-areas: 'content';
	overflow: hidden;
}

.l-login-grid.--has-aside {
	grid-template-areas: 'aside';
}

.l-login-content {
	position: relative;
	grid-area: content;
	background: var(--color-gradient-login);
	overflow-y: auto;
	display: flex;
	align-items: center;
	justify-content: center;
}

.l-login-content-wrap {
	flex-grow: 1;
	flex-shrink: 0;
	width: 100%;
	height: 100%;
}

.l-login-aside {
	position: relative;
	grid-area: aside;
	display: flex;
	flex-direction: column;
	z-index: 1;
	background: var(--color-gradient-login-aside);
	overflow: hidden;
	padding: 0 20px;
}

@media ($on-tablet) {
	.l-login-content-wrap {
		max-width: 360px;
		padding: 20px;
	}
}

@media ($on-desktop) {
	.l-login-grid.--has-aside {
		grid-template-columns: minmax(400px, 40vw) 1fr;
		grid-template-areas: 'content aside';

		.l-login-aside {
			box-shadow: inset 16px 0 16px -16px #000;
			padding: 0;
		}
	}
}

@media (spanning: single-fold-vertical) {
	.l-login-grid.--has-aside {
		grid-template-columns: env(fold-left) env(fold-right);
		grid-gap: env(fold-width);
	}

	.l-login-grid:not(.--has-aside) .l-login-content {
		padding-right: env(fold-right);
	}
}
</style>
