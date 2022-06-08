<template>
	<div>
		<transition name="placeholder" mode="out-in">
			<c-placeholder-movement v-if="loading && !fetched" key="placeholder" data-testid="loading" />

			<div
				class="w-product-resource-list__movements w-product-resource-list__movements-error"
				v-else-if="error"
				data-testid="error"
			>
				<c-icon
					class="w-product-resource-list__movements-error-icon"
					src="@icons/modalExclamation"
				/>

				<p class="text-m-book w-product-resource-list__movements-error-text">
					{{ $t(`RESOURCE.${RESOURCE_NAME}.ERROR`) }}
					<a
						href="#"
						class="w-product-resource-list__movements-error-link"
						@click.prevent="loadPage({ productId, query, instantLoading: true })"
					>
						{{ $t('RETRY') }}
					</a>
				</p>
			</div>

			<div class="w-product-resource-list__movements" v-else-if="fetched" key="movements">
				<c-virtual-list
					v-if="movements && movementComponent"
					data-key="id"
					data-testid="list"
					:data-sources="movements"
					:extra-props="{ productId, type, productFamily }"
					:data-component="movementComponent"
					:item-class="`w-product-resource-list__${resource}-item`"
					:scrolling-element="scrollingElement"
					:keeps="20"
					:estimate-size="60"
					:bottom-threshold="10"
					:last-resource="lastResource"
				/>

				<div
					data-testid="no-access-message"
					v-if="!loading && hasMorePagesButNotAccess"
					class="w-product-resource-list__message text-m-book"
				>
					{{ $t(`RESOURCE.${RESOURCE_NAME}.90DAYS_MESSAGE`) }}
				</div>

				<c-load-instant-button
					v-if="!loading && (hasMorePagesButNotAccess || paginationKey)"
					:trigger-click-on-visibility="
						Boolean(paginationKey && !loading && !hasMorePagesButNotAccess)
					"
					data-testid="load-resources-button"
					@click="
						loadPage({
							productId,
							paginationKey,
							query,
							force: hasMorePagesButNotAccess,
							instantLoading: true,
						})
					"
				>
					{{ $t(`RESOURCE.${RESOURCE_NAME}.VIEW_MORE`) }}
				</c-load-instant-button>

				<span v-else-if="!loading && (!movements || movements.length === 0)" class="text-m-medium">
					{{ $t(`RESOURCE.${RESOURCE_NAME}.NO_RESULTS`) }}
				</span>

				<c-placeholder-movement
					class="w-product-resource-list__movements-more-mov-placeholder"
					v-else-if="loading"
					data-testid="loading"
				/>
			</div>
		</transition>

		<transition name="placeholder">
			<c-placeholder-movement v-if="loading && !fetched" />
		</transition>

		<transition name="placeholder">
			<c-placeholder-movement v-if="loading && !fetched" />
		</transition>
	</div>
</template>

<script>
import moduleResources from '@modules/resources/m-resources';
import CVirtualList from '@components/c-virtual-list';
import CPlaceholderMovement from '@components/c-placeholder-movement';
import CIcon from '@components/c-icon';
import { OTP_REQUIRED, SCA_REQUIRED } from '@modules/service/constants';
import CLoadInstantButton from '@components/c-load-instant-button';

export default {
	name: 'w-product-resource-list',

	modules: { resources: moduleResources },

	components: {
		CPlaceholderMovement,
		CIcon,
		CVirtualList,
		CLoadInstantButton,
	},

	inject: {
		layout: { from: 'layout', default: null },
	},

	props: {
		type: String,
		productId: String,
		query: Object,
		resource: { type: String, default: 'movement' },
		lastResource: String,
		productFamily: String,
		reload: Boolean,
	},

	data() {
		return {
			fetched: false,
			movements: null,
			loading: false,
			timerLoading: null,
			error: false,
			hasMorePagesButNotAccess: false,
			paginationKey: null,
			timerRefresh: null,
			movementComponent: null,
		};
	},

	computed: {
		RESOURCE_NAME({ resource }) {
			return resource.toUpperCase();
		},

		scrollingElement({ layout }) {
			return layout?.scrollingElement;
		},
	},

	watch: {
		productId: {
			immediate: true,
			handler() {
				this.refreshParams();
			},
		},

		reload: {
			immediate: true,
			handler(value) {
				if (value) {
					this.refreshParams();
				}
			},
		},

		query: {
			immediate: true,
			handler(data = {}) {
				const { dateFrom, dateTo, reason } = data;

				/* istanbul ignore else */
				if (!dateFrom || !dateTo || !reason) {
					return;
				}

				this.refreshParams();
			},
		},

		type: {
			immediate: true,
			async handler(type) {
				const { resource } = this;
				this.movementComponent = (await import(
					`@widgets/products/${type}/w-${resource}-${type}`
				)).default;
			},
		},
	},

	methods: {
		refresh() {
			const { productId } = this;
			this.loadPage({ productId });
		},

		refreshParams() {
			this.fetched = false;
			this.movements = null;
			clearTimeout(this.timerRefresh);
			this.timerRefresh = setTimeout(this.refresh, 50);
		},

		loadPage({ productId, paginationKey, instantLoading = false, force = false }) {
			if (instantLoading) {
				this.loading = true;
			} else {
				clearTimeout(this.timerLoading);
				this.timerLoading = setTimeout(() => {
					this.timerLoading = null;
					this.loading = true;
				}, 200);
			}

			/* istanbul ignore else */
			if (!paginationKey) {
				this.movements = null;
			}

			this.error = false;

			this.fetch({ productId, paginationKey, force });
		},

		fetch({ productId, paginationKey, force }) {
			const { resource, query } = this;
			return this.$store
				.dispatch('resources/fetch', {
					resource: `${resource}s`,
					productId,
					paginationKey,
					query,
					force,
				})
				.then(({ data, paging }) => {
					this.movements = data;
					this.paginationKey = paging?.nextPaginationKey;
					this.hasMorePagesButNotAccess = false;
				})
				.catch((error) => {
					const errorCode = error?.response?.data?.errorCode;

					if (errorCode === SCA_REQUIRED || errorCode === OTP_REQUIRED) {
						this.hasMorePagesButNotAccess = true;
					}

					if (!errorCode) {
						this.error = true;
					}

					return error;
				})
				.finally(() => {
					clearTimeout(this.timerLoading);
					this.timerLoading = null;
					this.loading = false;
					this.fetched = true;
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.w-product-resource-list__message {
	padding: 20px 0;
	&:not(:first-child) {
		border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	}
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

.w-product-resource-list__movements.placeholder-leave-active {
	transform: translateY(0);
	transition: opacity 0s ease-in-out;
	transition-delay: 0ms;
}

.w-product-resource-list__movements-error {
	text-align: center;
	margin: 10px 0;
}

.w-product-resource-list__movements-error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.w-product-resource-list__movements-error-link {
	text-decoration: underline;
	display: block;
}

.w-product-resource-list__movements-more-mov-placeholder {
	margin-top: 20px;
	margin-bottom: 20px;
}

.w-product-resource-list__movements
	/deep/
	.w-product-resource-list__movement-item:not(:last-of-type),
.w-product-resource-list__movements /deep/ .w-product-resource-list__receipt-item,
.w-product-resource-list__movements /deep/ .w-product-resource-list__imposition-item {
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.w-product-resource-list__movements /deep/ .w-product-resource-list__receipt-item:first-of-type,
.w-product-resource-list__movements /deep/ .w-product-resource-list__imposition-item:first-of-type {
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
}
</style>
