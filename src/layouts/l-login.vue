<template>
	<div class="l-login" :class="{ '--has-aside': $slots.aside }">
		<div class="l-login__left">
			<transition name="fade">
				<slot />
			</transition>
		</div>
		<transition name="fade">
			<div v-if="$slots.aside" class="l-login__right">
				<slot name="aside" />
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'l-login',
};
</script>

<style lang="scss" scoped>
.l-login {
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

.l-login.--has-aside {
	grid-template-areas: 'aside';
}

.l-login__left {
	display: flex;
	position: relative;
	width: 100%;
	height: 100%;
	grid-area: content;
	align-items: center;
	justify-content: center;
	background: var(--color-gradient-login);
	overflow-y: auto;
}

.l-login__right {
	display: flex;
	position: relative;
	width: 100%;
	height: 100%;
	grid-area: aside;
	flex-direction: column;
	background: var(--color-gradient-login-aside);
	overflow: hidden;
	z-index: 1;
}

@media ($on-desktop) {
	.l-login.--has-aside {
		grid-template-columns: minmax(400px, 40vw) 1fr;
		grid-template-areas: 'content aside';

		.l-login__right {
			box-shadow: inset 16px 0 16px -16px RGB(var(--color-primary-dark));
			padding: 0;
		}
	}
}

@media (spanning: single-fold-vertical) {
	.l-login.--has-aside {
		grid-template-columns: env(fold-left) env(fold-right);
		grid-gap: env(fold-width);
	}

	.l-login:not(.--has-aside) .l-login__left {
		padding-right: env(fold-right);
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
