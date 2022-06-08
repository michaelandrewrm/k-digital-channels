<template>
	<div class="c-list-icon-item" v-bind="$attrs">
		<div class="c-list-icon-item__col1" v-if="icon">
			<c-icon :src="icon" size="xs" />
		</div>
		<dl class="c-list-icon-item__col2">
			<dt class="c-list-icon-item__title text-m-medium">{{ title }}</dt>
			<dd v-if="description || $slots.default" class="c-list-icon-item__description text-m-light">
				<span v-if="$slots.default" class="c-list-icon-item__description text-m-light">
					<slot />
				</span>
				<span v-else-if="description">
					{{ description }}
				</span>
				<c-button-copy-to-clipboard v-if="copyable" :copyTitle="title" :copyText="description" />
			</dd>
		</dl>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import CButtonCopyToClipboard from '@components/c-button-copy-to-clipboard';

export default {
	name: 'c-list-icon-item',

	components: {
		CIcon,
		CButtonCopyToClipboard,
	},

	props: {
		title: { type: null },
		description: { type: null },
		icon: { type: null },
		copyable: { type: Boolean },
	},
};
</script>

<style lang="scss" scoped>
.c-list-icon-item {
	display: flex;
	position: relative;
	user-select: text;
}

.c-list-icon-item[actionable] {
	@media (hover) {
		cursor: pointer;
	}
}

.c-list-icon-item__col1 {
	flex-shrink: 0;
	flex-grow: 1;
	padding-right: 10px;
	padding-top: 2px;
	color: var(--c-list-icon-item-icon-color, currentColor);
}

.c-list-icon-item__col2 {
	flex-shrink: 1;
	flex-grow: 1;
	width: 100%;
	display: flex;
	flex-direction: column;
}

.c-list-icon-item[actionable]::after {
	content: '';
	position: absolute;
	top: calc(50% - 3px);
	right: -15px;
	border-right: 1px solid RGB(var(--color-text-primary-light));
	border-bottom: 1px solid RGB(var(--color-text-primary-light));
	transform: rotate(-45deg);
	width: 6px;
	height: 6px;
}

.c-list-icon-item__description {
	display: flex;
	align-items: center;
	width: 100%;
}

@media print {
	.c-list-icon-item__col1 {
		display: none;
	}

	.c-list-icon-item__title {
		flex-grow: 1;
		flex: 1;
	}

	.c-list-icon-item__description {
		flex: 1;
	}

	.c-list-icon-item__col2 {
		flex-direction: row;
		padding-left: 30px;
	}
}
</style>
