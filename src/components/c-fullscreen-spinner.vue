<template functional>
	<transition name="fade" appear>
		<div class="c-fullscreen-spinner" v-bind="data.attrs">
			<div class="c-fullscreen-spinner__e1"></div>
			<div class="c-fullscreen-spinner__e2"></div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'c-fullscreen-spinner',
};
</script>

<style lang="scss" scoped>
@import '@local-design/_local-style-custom-loading';
.c-fullscreen-spinner {
	@extend %spinner-bg !optional;
}
.c-fullscreen-spinner__e1 {
	@extend %spinner-e1 !optional;
}
.c-fullscreen-spinner__e2 {
	@extend %spinner-e2 !optional;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 250ms ease-out;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
