<template>
	<router-link
		tag="button"
		:to="{
			name: 'movement',
			params: { productId, movementId: source.id, productType: 'investment-portfolio' },
		}"
		class="w-movement-investment-portfolio"
	>
		<div class="w-movement-investment-portfolio__container">
			<div class="w-movement-investment-portfolio__col1">
				<span class="w-movement-investment-portfolio__title text-m-medium">
					{{ source.type.name }}
				</span>
				<span class="w-movement-investment-portfolio__date text-s-light">
					{{ $d(new Date(source.operationDate), 'numeric') }}
				</span>
				<span class="w-movement-investment-portfolio__value text-l-medium">
					{{ $nc(source.amount) }}
				</span>
			</div>
			<div class="w-movement-investment-portfolio__col2">
				<div class="w-movement-investment-portfolio__row2">
					<span class="w-movement-investment-portfolio__title text-m-medium">
						{{ source.isin.name }}
					</span>
					<span class="w-movement-investment-portfolio__title text-s-light">
						{{ source.isin.id }}
					</span>
				</div>
				<span class="w-movement-investment-portfolio__quantity text-s-book">
					{{
						$tc('DETAIL.EQUITIES_QUANTITY', source.titles, {
							n: $n(source.titles),
						})
					}}
				</span>
			</div>
		</div>
	</router-link>
</template>

<script>
export default {
	name: 'w-movement-investment-portfolio',

	props: {
		source: { type: Object },
		productId: { type: String },
	},
};
</script>

<style lang="scss" scoped>
.w-movement-investment-portfolio {
	appearance: none;
	background: transparent;
	border: 0;
	margin: 0;
	padding: 0;
	display: block;
	width: 100%;
	text-align: left;
	position: relative;
}

.w-movement-investment-portfolio__container {
	color: RGB(var(--color-text-primary));
	display: flex;
	flex-direction: column;
	padding: 10px 0;
}
.w-movement-investment-portfolio__date {
	text-align: center;
	white-space: nowrap;
	flex-shrink: 0;
	width: 80px;
}

.w-movement-investment-portfolio__value {
	text-align: right;
	white-space: nowrap;
	flex-shrink: 0;
	flex-grow: 1;
	flex-basis: 33%;
}

.w-movement-investment-portfolio__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	flex-shrink: 1;
	flex-grow: 1;
	flex-basis: 33%;
}

.w-movement-investment-portfolio__quantity {
	padding: 4px 6px;
	background-color: RGBA(var(--color-dark-surface), 0.1);
	border-radius: 4px;
	line-height: 1;
	display: inline-flex;
	align-items: center;
	margin-left: 10px;
	white-space: nowrap;
}

.w-movement-investment-portfolio__col1,
.w-movement-investment-portfolio__col2 {
	display: flex;
	align-items: flex-start;
}

.w-movement-investment-portfolio__col2 {
	align-items: center;
	margin-top: 6px;
}

.w-movement-investment-portfolio__row2 {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow: hidden;
}
</style>
