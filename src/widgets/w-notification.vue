<template>
	<transition-group name="slide" tag="div" class="w-notification" role="status" aria-live="polite">
		<article
			v-for="({ component: { text, template, props } }, id) in $store.state.notification.queue"
			:key="`n-${id}`"
			role="alert"
			aria-role="alert"
			@click="$store.dispatch('notification/close', { id })"
			class="w-notification__message text-m-medium"
		>
			<span v-if="text">{{ text }}</span>
			<span v-else-if="template"><component :is="template" v-bind="props" /></span>
		</article>
	</transition-group>
</template>

<script>
export default {
	name: 'w-notification',
};
</script>

<style lang="scss" scoped>
.w-notification {
	position: fixed;
	bottom: 80px;
	right: 10px;
	left: 10px;
	width: calc(100% - 20px);
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: $layer-modal-z-index;
}

.w-notification__message {
	background-color: RGB(var(--color-dark-surface));
	color: RGB(var(--color-dark-text-primary));
	padding: 20px;
	border-radius: $border-radius-s;
	margin-bottom: 10px;
	width: 100%;
	max-width: 600px;
	flex-grow: 1;
}

.slide {
	will-change: transform;
}

.slide-enter-active {
	transition: opacity 300ms ease, transform 300ms ease;
}

.slide-leave-active {
	transition: opacity 200ms ease, transform 200ms ease;
}

.slide-enter,
.slide-leave-to {
	opacity: 0;
	transform: translateY(30px);
}
</style>
