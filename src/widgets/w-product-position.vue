<template>
	<div class="w-product-position">
		<c-translide>
			<div v-if="loading || source || error">
				<transition name="placeholder" mode="out-in">
					<component
						:is="widget"
						v-bind="$attrs"
						v-on="$listeners"
						:product-id="productId"
						:source="source"
						v-if="source && !loading"
						data-testid="data"
					/>
					<div class="w-product-position__error" v-if="error" data-testid="error">
						<c-icon class="w-product-position__error-icon" src="@icons/modalExclamation" />

						<p class="text-m-book w-product-position__error-text">
							{{ $t('MOVEMENT.DETAIL_ERROR') }}
							<a href="#" class="w-product-position__error-link" @click="fetch">
								{{ $t('RETRY') }}
							</a>
						</p>
					</div>

					<c-placeholder-item v-if="loading" key="placeholder" data-testid="loading" />
				</transition>

				<transition name="placeholder">
					<c-placeholder-item v-if="loading" />
				</transition>

				<transition name="placeholder">
					<c-placeholder-item v-if="loading" />
				</transition>
			</div>
		</c-translide>
	</div>
</template>

<script>
import CPlaceholderItem from '@components/c-placeholder-item';
import CTranslide from '@components/c-translide';
import moduleProducts from '@modules/products/m-products';
import CIcon from '@components/c-icon';

export default {
	name: 'w-product-position',

	components: {
		CPlaceholderItem,
		CTranslide,
		CIcon,
	},

	modules: {
		products: moduleProducts,
	},

	props: {
		type: { type: String },
		productId: { type: String, required: true },
	},

	data() {
		return {
			source: null,
			loading: false,
			timerLoading: null,
			error: false,
		};
	},

	computed: {
		widget({ type }) {
			/* istanbul ignore next */
			if (!type) {
				return '';
			}

			return () => import(`@widgets/products/${type}/w-position-${type}`);
		},
	},

	watch: {
		productId: {
			immediate: true,
			handler() {
				this.fetch();
			},
		},
	},

	methods: {
		fetch() {
			const { productId } = this;

			/* istanbul ignore next */
			if (!productId) {
				return;
			}

			this.error = false;

			clearTimeout(this.timerLoading);
			this.timerLoading = setTimeout(() => {
				this.timerLoading = null;
				this.loading = true;
			}, 200);

			this.$store
				.dispatch('products/getPosition', { productId })
				.then((response) => {
					this.source = response;
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					clearTimeout(this.timerLoading);
					this.timerLoading = null;
					this.loading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.w-product-position {
	max-width: 400px;
	margin: 0 auto;
}

.w-product-position__error {
	text-align: center;
	margin: 10px 0;
}

.w-product-position__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.w-product-position__error-link {
	text-decoration: underline;
	display: block;
}

.placeholder-enter {
	opacity: 0;
	transform: translateY(-5px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateY(40%);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
	transition-delay: 400ms;
}

.placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 200ms;
}

.placeholder-leave-active ~ .placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 0ms;
}
</style>
