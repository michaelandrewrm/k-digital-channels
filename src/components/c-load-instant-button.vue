<template>
	<span
		ref="nextPageButton"
		data-testid="load-resources-button"
		class="c-load-instant-button text-l-book"
		@click="onClick"
	>
		<c-icon-button icon="@icons/cross" raised class="c-load-instant-button__icon" />
		<slot />
	</span>
</template>

<script>
import CIconButton from '@components/c-icon-button';

export default {
	name: 'c-load-instant-button',

	components: {
		CIconButton,
	},

	data() {
		return {
			observer: null,
		};
	},

	props: {
		triggerClickOnVisibility: { type: Boolean },
	},

	computed: {
		observability({ observer, triggerClickOnVisibility }) {
			return [observer, triggerClickOnVisibility];
		},
	},

	watch: {
		observability([observer, triggerClickOnVisibility]) {
			if (triggerClickOnVisibility) {
				observer.observe(this.$el);
			} else {
				observer.unobserve(this.$el);
			}
		},
	},

	methods: {
		onClick() {
			this.$emit('click');
		},
	},

	created() {
		const options = {
			rootMargin: '0px',
			threshold: [1],
		};
		const callback = (entries) => {
			entries.forEach(({ isIntersecting }) => {
				if (isIntersecting) {
					this.onClick();
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
.c-load-instant-button {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	margin-bottom: 40px;
}

.c-load-instant-button__icon {
	margin-right: 20px;
}
</style>
