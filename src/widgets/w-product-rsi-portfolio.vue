<template>
	<div class="w-product-rsi-portfolio">
		<transition name="placeholder" mode="out-in">
			<component
				v-if="source && !loading"
				class="w-product-rsi-portfolio__list"
				:is="widget"
				v-bind="$attrs"
				v-on="$listeners"
				:product-id="productId"
				:source="source"
			/>
			<div v-if="error" class="w-product-rsi-portfolio__error" data-testid="error">
				<c-icon class="w-product-rsi-portfolio__error-icon" src="@icons/modalExclamation" />

				<p class="text-m-book w-product-rsi-portfolio__error-text">
					{{ $t('MOVEMENT.DETAIL_ERROR') }}
					<a href="#" class="w-product-rsi-portfolio__error-link" @click="fetch">
						{{ $t('RETRY') }}
					</a>
				</p>
			</div>

			<c-placeholder-item v-if="loading" data-testid="loading" />
		</transition>

		<transition name="placeholder">
			<c-placeholder-item v-if="loading" />
		</transition>

		<transition name="placeholder">
			<c-placeholder-item v-if="loading" />
		</transition>
	</div>
</template>

<script>
import CPlaceholderItem from '@components/c-placeholder-item';
import moduleProducts from '@modules/products/m-products';
import CIcon from '@components/c-icon';

export default {
	name: 'w-product-rsi-portfolio',

	components: {
		CPlaceholderItem,
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
				return;
			}

			return () => import(`@widgets/products/${type}/w-portfolio-${type}`);
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
				.dispatch('products/fetch')
				.then((response) => {
					this.source = response.filter(({ parentId }) => parentId === productId);
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
.w-product-rsi-portfolio__error {
	text-align: center;
	margin: 10px 0;
}

.w-product-rsi-portfolio__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.w-product-rsi-portfolio__error-link {
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

.w-product-rsi-portfolio__list.placeholder-leave-active {
	transform: translateY(0);
	transition: opacity 0s ease-in-out;
	transition-delay: 0ms;
}
</style>
