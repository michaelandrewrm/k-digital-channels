<template>
	<div class="w-transfer-favorite">
		<router-link
			tag="button"
			class="w-transfer-favorite__button"
			:to="{ name: 'transfer-detail', params: { type, transferId: source.id } }"
		>
			<div class="w-transfer-favorite__wrapper">
				<span class="text-m-medium w-transfer-favorite__name">
					<div class="text-m-medium w-transfer-favorite__name">{{ source.alias }}</div>
				</span>
				<span class="text-l-medium w-transfer-favorite__amount">
					{{ $nc(source.amount) }}
				</span>
			</div>
		</router-link>
	</div>
</template>

<script>
export default {
	name: 'w-transfer-favorite',

	props: {
		source: { type: Object, required: true },
		type: { type: String },
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-favorite {
	padding: 5px 0;
}

.w-transfer-favorite__button {
	appearance: none;
	background: RGB(var(--color-surface-light));
	border: 0;
	padding: 14px 10px;
	display: block;
	width: 100%;
	text-align: left;
	border-radius: $border-radius-xs;
	box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.07);
	position: relative;
}

.w-transfer-favorite__wrapper {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content;
	grid-gap: 10px;
}

.w-transfer-favorite__name {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-transfer-favorite__amount {
	text-align: right;
	white-space: nowrap;
	align-self: center;
}
</style>
