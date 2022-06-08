<template>
	<div class="c-list-item" v-bind="$attrs">
		<span class="c-list-item__title text-m-medium" :aria-label="$attrs.ariaTitle">
			{{ title }}
		</span>
		<span class="c-list-item__amount text-l-medium">{{ amount }}</span>
		<span class="c-list-item__info text-s-light" :aria-label="$attrs.ariaDate">{{ info }}</span>
		<span class="c-list-item__comment text-s-light">
			<b v-if="comment">{{ $t('COMMENT') }}</b>
			{{ comment }}
		</span>
		<span class="c-list-item__balance text-s-light" v-if="balance">{{ balance }}</span>
	</div>
</template>

<script>
export default {
	name: 'c-list-item',

	props: {
		title: String,
		amount: String,
		info: String,
		balance: String,
		comment: String,
	},
};
</script>

<style lang="scss" scoped>
.c-list-item {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: fit-content(100px) 1fr fit-content(100px);
	grid-template-rows: min-content min-content;
	grid-gap: 8px;
	padding: 10px 0;
}
.c-list-item__amount,
.c-list-item__balance {
	text-align: right;
	white-space: nowrap;
}

.c-list-item__comment {
	color: RGB(var(--color-text-primary));
	justify-content: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.c-list-item__title {
	grid-column: 1/3;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
