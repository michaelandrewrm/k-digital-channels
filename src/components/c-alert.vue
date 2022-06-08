<template>
	<div class="c-alert text-m-medium">
		<span class="c-alert__leading-icon">
			<slot name="icon" v-if="$slots.icon" />
			<c-icon src="@icons/modalExclamation" v-else />
		</span>
		<span class="c-alert__content">
			<slot />
		</span>
		<span class="c-alert__amount">{{ amount }}</span>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-alert',

	props: { amount: String },

	components: { CIcon },
};
</script>

<style lang="scss" scoped>
.c-alert {
	display: grid;
	position: relative;
	grid-template-columns: auto 1fr fit-content(100px);
	grid-template-rows: min-content;
	grid-gap: 10px;
	width: 100%;
	height: auto;
	padding: 20px 10px;
	margin: 0 auto;
	background: RGB(var(--color-primary-dark));
	border-radius: $border-radius-m;
}

.c-alert__leading-icon {
	display: flex;
	align-items: center;
	font-size: 20px;
	color: RGB(var(--color-accent-error));
}

.c-alert[warning] .c-alert__leading-icon {
	color: RGB(var(--color-secondary-light));
}

.c-alert[actionable]::after {
	content: '';
	position: absolute;
	top: calc(50% - 3px);
	right: 15px;
	border-right: 1px solid RGB(var(--color-text-primary-light));
	border-bottom: 1px solid RGB(var(--color-text-primary-light));
	transform: rotate(-45deg);
	width: 6px;
	height: 6px;
}

.c-alert__content {
	display: flex;
	align-items: center;
	color: RGB(var(--color-text-primary-light));
}

.c-alert__amount {
	display: flex;
	align-items: center;
	color: RGB(var(--color-secondary));
}
</style>
