<template>
	<l-view-modal class="v-product-detail" @close="$router.back()">
		<transition name="placeholder">
			<c-placeholder-detail v-if="loading" class="v-product-detail__placeholder" />
		</transition>

		<template v-slot:header>
			<div class="v-product-detail__alias" data-testid="alias">
				<span>{{ pageTitle }}</span>
				<c-icon-button
					v-if="!loading"
					icon="@icons/editPen"
					size="l"
					@click="openEditModal"
					data-testid="edit-alias"
				/>
			</div>
		</template>

		<!-- Now we show the subheader even if it's equal to the header -->
		<!-- due to the edit option above-->
		<template v-if="detail" v-slot:subheader>
			{{ pageSubtitle }}
		</template>

		<transition name="fade">
			<component
				v-if="!loading && detail"
				:is="widget"
				v-bind="$attrs"
				v-on="$listeners"
				:detail="detail"
			/>
		</transition>
	</l-view-modal>
</template>

<script>
import { mapState } from 'vuex';
import CPlaceholderDetail from '@components/c-placeholder-detail';
import CIconButton from '@components/c-icon-button';
import LViewModal from '@layouts/l-view-modal';
import MInputAlias from '@modals/m-input-alias';

import { subtypesById } from '@modules/products/product-subtypes';
import moduleProducts from '@modules/products/m-products';

export default {
	name: 'v-product-detail',

	modules: {
		products: moduleProducts,
	},

	components: {
		LViewModal,
		CPlaceholderDetail,
		CIconButton,
		MInputAlias,
	},

	props: {
		productId: { type: String, required: true },
		familyId: { type: String, required: true },
	},

	data() {
		return {
			detail: null,
			product: null,
			loading: false,
		};
	},

	computed: {
		...mapState('profiles', ['profiles']),

		productWidget({ product }) {
			let type = product.productFamily;
			const productSubtype = subtypesById[(product.productSubtype?.id)];

			/* istanbul ignore next */
			if (type === 'subscription') {
				const prefix = 'premium-';
				type = productSubtype.slice(prefix.length);
			}

			/* istanbul ignore next */
			if (type === 'managed-rsi-product') {
				const prefix = 'managed-rsi-';
				type = productSubtype.slice(prefix.length);
			}

			/* istanbul ignore next */
			if (type === 'managed-product') {
				const prefix = 'managed-';
				type = productSubtype.slice(prefix.length);
			}

			/* istanbul ignore next */
			if (type.includes('currency')) {
				const prefix = 'currency-';
				type = type.slice(prefix.length);
			}

			/* istanbul ignore next */
			if (product.isAsset) {
				type += '-asset';
			}

			/* istanbul ignore next */
			if (['credit-card', 'debit-card'].includes(type)) {
				type = 'card';
			}

			return type;
		},

		widget({ productWidget }) {
			/* istanbul ignore next */
			if (!productWidget) {
				return;
			}

			return () => import(`@widgets/products/${productWidget}/w-detail-${productWidget}`);
		},

		pageTitle({ detail }) {
			/* istanbul ignore next */
			if (detail?.alias) {
				return detail.alias;
			}

			/* istanbul ignore next */
			if (detail?.name) {
				return detail.name;
			}

			const subtype = subtypesById[(detail?.productSubtype?.id)];
			return subtype ? this.$tc(`MY_PRODUCT.${subtype.toUpperCase()}`, 1) : '';
		},

		pageSubtitle({ detail }) {
			/* istanbul ignore next */
			if (detail?.name) {
				return detail.name;
			}

			const subtype = subtypesById[(detail?.productSubtype?.id)];
			return subtype ? this.$tc(`MY_PRODUCT.${subtype.toUpperCase()}`, 1) : '';
		},
	},

	methods: {
		async openEditModal() {
			const { productId } = this;
			const newAlias = await this.$store.dispatch('modal/open', {
				component: MInputAlias,
				props: { detail: this.detail.alias, productId },
			});

			if (newAlias) {
				this.detail.alias = newAlias;
			}
		},
	},

	watch: {
		productId: {
			immediate: true,
			async handler(productId) {
				/* istanbul ignore next */
				if (productId) {
					this.loading = true;

					const { dispatch } = this.$store;
					const [id, resource] = productId.split('/');

					try {
						const product = await dispatch('products/get', productId);
						const detail = await dispatch('products/getDetails', productId);

						product.isAsset = resource;

						if (!detail?.id) {
							return this.$router.back();
						}

						this.detail = {
							...detail,
							isNotProfileAllow: product.productFamily === 'managed-rsi-product',
							profiles: product?.profiles,
							productId: id,
							productFamily: this.familyId,
						};
						this.product = product;

						// if there's two alias, we prioritize the product detail as it's the one who can be changed.
						if (this.product?.alias && this.detail?.alias) {
							this.detail.alias = this.product.alias;
						}
					} catch {
						this.$router.back();
					}

					this.loading = false;
				}
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.placeholder-enter {
	opacity: 0;
	transform: translateX(-10px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateX(10px);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 200ms;
	transition-delay: 400ms;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.v-product-detail__placeholder {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 36px;
	left: 0;
}

.v-product-detail__alias {
	display: inline-flex;
	align-items: center;
}

.v-product-detail__alias span:not(:only-child) {
	margin-left: 40px;
}

.v-product-detail__alias span:only-child {
	padding-bottom: 10px;
}

.v-product-detail__alias .c-icon-button {
	color: RGB(var(--color-text-secondary-light));
}
</style>
