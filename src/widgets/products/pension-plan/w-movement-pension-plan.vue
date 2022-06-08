<template>
	<div class="w-movement-pension-plan" v-bind="$attrs" tabindex="0">
		<span class="w-movement-pension-plan__reason text-m-medium">{{ source.reason }}</span>
		<span class="w-movement-pension-plan__amount text-l-medium">
			{{ $nc(source.amount, { sign: true }) }}
		</span>
		<span class="w-movement-pension-plan__operation-date text-s-light">
			{{ $d(new Date(source.operationDate), 'numeric') }}
		</span>
		<span class="w-movement-pension-plan__unity-value">
			{{ $t('MOVEMENT.UNIT_VALUE').concat(':') }}
			<span class="text-s-book">
				{{ $nc(source.unityValue, { minimumFractionDigits: 9 }) }}
			</span>
		</span>
		<span>
			<span class="w-movement-pension-plan__unity-quantity text-s-book">
				{{
					$tc('MOVEMENT.UNIT', source.unityQuantity, {
						n: $n(source.unityQuantity),
					})
				}}
			</span>
		</span>
	</div>
</template>

<script>
export default {
	name: 'w-movement-pension-plan',

	props: {
		source: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-pension-plan {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: min-content;
	grid-gap: 10px;
	padding: 10px 0;
	position: relative;
}

.w-movement-pension-plan__reason {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-movement-pension-plan__amount,
.w-movement-pension-plan__unity-value {
	text-align: right;
}

.w-movement-pension-plan__unity-quantity {
	padding: 4px 6px;
	background-color: RGBA(var(--color-primary), 0.05);
	border-radius: 4px;
	text-align: left;
}
</style>
