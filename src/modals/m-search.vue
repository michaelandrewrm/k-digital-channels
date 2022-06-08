<template>
	<div class="m-search">
		<transition name="enter" appear>
			<div class="m-search__content">
				<w-search @close="close" :currentCompany="currentCompany" />
			</div>
		</transition>

		<transition name="fade" appear>
			<div class="m-search__scrim" @click="$emit('close')" />
		</transition>
	</div>
</template>

<script>
import WSearch from '@widgets/w-search';

export default {
	name: 'm-search',

	components: { WSearch },

	props: { currentCompany: String },

	data() {
		return {
			value: null,
		};
	},

	methods: {
		close(event) {
			this.value = event;
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.enter-enter-active {
	animation: enter 250ms ease-out;
}

.fade-enter-active {
	animation: fade 200ms ease;
}

@keyframes fade {
	from {
		opacity: 0;
	}
}

@keyframes enter {
	from {
		transform: scale(1.05);
		opacity: 0;
	}
}

.m-search {
	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	justify-content: center;
	align-items: center;
	padding: 16px;
	perspective: 800px;
	will-change: transform;
}

.m-search__scrim {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: RGBA(var(--color-primary), 0.5);
	z-index: $layer-popover-z-index;
}

.m-search__content {
	display: flex;
	width: 100%;
	max-width: 750px;
	max-height: 80%;
	padding: 4px;
	background-color: RGB(var(--color-surface));
	border-radius: 4px;
	box-shadow: 0px 11px 15px -7px RGBA(var(--color-primary), 0.2),
		0px 24px 38px 3px RGBA(var(--color-primary), 0.14),
		0px 9px 46px 8px RGBA(var(--color-primary), 0.12);
	z-index: $layer-tooltip-z-index;
}
</style>
