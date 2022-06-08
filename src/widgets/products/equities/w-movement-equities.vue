<template>
	<router-link
		tag="button"
		:to="{ name: 'movement', params: { movementId: source.id, productType: 'equities' } }"
		class="w-movement-equities"
	>
		<div class="w-movement-equities__container" v-bind="$attrs">
			<div class="w-movement-equities__col1">
				<span class="w-movement-equities__title text-m-medium">{{ source.reason }}</span>
				<span class="w-movement-equities__date text-s-light">
					{{ $d(new Date(source.operationDate), 'numeric') }}
				</span>
				<span class="w-movement-equities__value text-l-medium">{{ $nc(source.amount) }}</span>
			</div>
			<div class="w-movement-equities__col2">
				<div class="w-movement-equities__row2">
					<span class="w-movement-equities__title text-m-medium">{{ source.name }}</span>
					<span class="w-movement-equities__title text-s-light">{{ source.isin }}</span>
				</div>
				<span class="w-movement-equities__quantity text-s-book">
					{{
						$tc('DETAIL.EQUITIES_QUANTITY', source.unityQuantity, {
							n: $n(source.unityQuantity),
						})
					}}
				</span>
			</div>
		</div>
	</router-link>
</template>

<script>
export default {
	name: 'w-movement-equities',

	props: {
		source: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-equities {
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

.w-movement-equities__container {
	color: RGB(var(--color-text-primary));
	display: flex;
	flex-direction: column;
	padding: 10px 0;
}

.w-movement-equities__date,
.w-movement-equities__value {
	text-align: right;
	white-space: nowrap;
	flex-shrink: 0;
	width: 120px;
}

.w-movement-equities__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	flex-shrink: 1;
	flex-grow: 1;
}

.w-movement-equities__quantity {
	padding: 4px 6px;
	background-color: RGBA(var(--color-dark-surface), 0.1);
	border-radius: 4px;
	line-height: 1;
	display: inline-flex;
	align-items: center;
	margin-left: 10px;
	white-space: nowrap;
}

.w-movement-equities__col1,
.w-movement-equities__col2 {
	display: flex;
	align-items: flex-start;
}

.w-movement-equities__col2 {
	align-items: center;
	margin-top: 6px;
}

.w-movement-equities__row2 {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow: hidden;
}
</style>
