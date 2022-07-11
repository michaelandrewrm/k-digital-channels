<template>
	<div class="w-product-remittance">
		<div class="w-product-remittance__wrapper">
			<c-acrylic-sheet :actionable="active" @expand="$emit('expand')">
				<c-icon v-if="isHefame" src="@icons/productHefame" size="" slot="icon" />
				<c-icon v-else src="@icons/productFolder" size="" slot="icon" />

				<span class="w-product-remittance__title text-fixed-m-medium" v-if="product.alias">
					{{ product.alias }}
				</span>
				<span class="w-product-remittance__balance text-fixed-l-bold" v-if="product.balance">
					{{ isHefame ? $nc(product.postedBalance) : $nc(product.balance) }}
				</span>
				<span
					class="w-product-remittance__subtitle text-fixed-s-medium"
					v-if="product.productNumber"
					aria-hidden="true"
				>
					{{ $pn(product.productNumber) }}
				</span>
				<span class="a11y-hide" v-if="product.productNumber">
					{{ $t('PRODUCT_NUMBER_ENDED_IN', { productNumber: product.productNumber.value }) }}
				</span>
			</c-acrylic-sheet>
		</div>

		<c-translide>
			<router-link
				:to="{ name: 'withholdings' }"
				v-if="hasWithholdings && active && areWithholdingsChecked"
				class="w-product-remittance__withholdings"
				data-testid="withholdings"
			>
				<c-alert warning actionable>
					<c-icon src="@icons/calendarTime" slot="icon" />
					{{
						$tc('REMITTANCE.WITHHOLDINGS.TITLE', withholdings.length, {
							withholdings: withholdings.length,
						})
					}}
				</c-alert>
			</router-link>
		</c-translide>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CAlert from '@components/c-alert';
import CTranslide from '@components/c-translide';

export default {
	name: 'w-product-remittance',

	components: { CAcrylicSheet, CIcon, CAlert, CTranslide },

	props: {
		product: Object,
		active: Boolean,
	},

	data() {
		return {
			withholdings: [],
			areWithholdingsChecked: null,
		};
	},

	computed: {
		...mapState('app', ['companyId']),

		isHefame({ product }) {
			return product.productFamily === 'hefame-remittance';
		},

		hasWithholdings({ withholdings }) {
			return withholdings?.length > 0;
		},
	},

	watch: {
		product: {
			immediate: true,
			async handler(product) {
				/* istanbul ignore else */
				if (product?.id) {
					const response = await this.$store.dispatch('resources/fetch', {
						resource: 'movements/withholdings',
						productId: product.id,
					});

					this.withholdings = response?.data;
					this.areWithholdingsChecked = true;
				}
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.w-product-remittance {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.w-product-remittance__wrapper {
	width: 300px;
	margin: 0 auto;
}

.w-product-remittance__title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.w-product-remittance__balance {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.w-product-remittance__subtitle {
	display: flex;
	align-items: flex-end;
}

.w-product-remittance__footer {
	position: relative;
	padding: 10px;
	border-bottom-left-radius: $border-radius-l;
	border-bottom-right-radius: $border-radius-l;
	background-color: RGBA(var(--color-themed-surface), 0.9);
	color: RGB(var(--color-text-primary-light));
}

.w-product-remittance__available-balance {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	text-align: right;
	overflow: hidden;
	& span {
		padding-right: 10px;
	}
	& .c-icon {
		@media (hover) {
			cursor: pointer;
		}
	}
}

.w-product-remittance__withholdings {
	width: 100vw;
	padding: 0 20px;
	display: block;
	max-width: 400px;
	margin-top: 20px;
}

.w-product-remittance__withholdings:hover {
	text-decoration: none;
}
</style>
