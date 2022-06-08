<template>
	<transition :name="name" v-bind="$attrs" v-on="$listeners">
		<slot></slot>
	</transition>
</template>

<script>
export default {
	name: 'c-translide',

	props: {
		immediate: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		name({ immediate }) {
			return immediate ? 'slide-immediate' : 'slide';
		},
	},
};
</script>

<style lang="scss" scoped>
$duration: 400ms;
$delay: $page-transition-duration;

.slide-enter-active {
	will-change: transform;
	transition: transform $duration $delay ease-in-out, opacity $duration $delay;
}

.slide-immediate-enter-active {
	will-change: transform;
	transition: transform $duration ease-in-out, opacity $duration;
}

.slide-enter,
.slide-immediate-enter {
	opacity: 0;
	transform: translateY(-5px);
}
</style>
