<template>
	<div>
		<transition name="placeholder" mode="out-in">
			<c-placeholder-movement
				v-if="loading && !fetched"
				key="placeholder"
				data-testid="list-loading"
			/>

			<div class="w-list__item w-list__item-error" v-else-if="error" data-testid="error">
				<c-icon class="w-list__item-error-icon" src="@icons/modalExclamation" />

				<p class="text-m-book w-list__item-error-text">
					{{ messageError }}
					<a
						href="#"
						class="w-list__item-error-link"
						data-testid="retry"
						@click.prevent="loadPage({ ...params, instantLoading: true })"
					>
						{{ $t('RETRY') }}
					</a>
				</p>
			</div>

			<div class="w-list__item" v-else-if="fetched" key="messages">
				<c-virtual-list
					v-if="items && itemComponent"
					:data-key="dataKey || 'id'"
					data-testid="list"
					ref="list"
					:data-sources="items"
					:extra-props="{ ...params }"
					:data-component="itemComponent"
					item-class="w-list__item-component"
					:scrolling-element="scrollingElement"
					:keeps="20"
					:bottom-threshold="10"
					:offset="scrollingOffset"
					@tobottom="loadNextPage"
					@item:click="onItemClick"
				/>

				<span
					v-if="!loading && paginationKey"
					data-testid="load-more-button"
					class="w-list__view-more-movements text-l-book"
					@click="loadNextPage"
				>
					<c-icon-button icon="@icons/cross" raised class="w-list__view-more-movements__icon" />
					{{ messageNextPage }}
				</span>

				<span v-if="!loading && (items && items.length === 0)" class="text-m-medium">
					{{ messageNoResults }}
				</span>

				<c-placeholder-movement
					class="w-list__item-more-mov-placeholder"
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
import CPlaceholderMovement from '@components/c-placeholder-movement';
import CVirtualList from '@components/c-virtual-list';
import CIcon from '@components/c-icon';
import CIconButton from '@components/c-icon-button';

const positionStore = {};

export default {
	name: 'w-list',

	components: {
		CPlaceholderMovement,
		CVirtualList,
		CIcon,
		CIconButton,
	},

	inject: {
		layout: {
			from: 'layout',
			default: null,
		},
	},

	props: {
		messageError: { type: String },
		messageNoResults: { type: String },
		messageNextPage: { type: String },
		itemComponent: { type: [Object, null] },
		params: { type: Object, default: () => ({}) },
		paginationKey: { type: [String, Number] },
		items: { type: Array },
		error: { type: Boolean },
		dataKey: { type: String },
	},

	data() {
		return {
			fetched: false,
			loading: false,
			timerLoading: null,
			timerRefresh: null,
			unregisterRouterHook: null,
		};
	},

	computed: {
		scrollingElement({ layout }) {
			return layout?.scrollingElement;
		},

		scrollingOffset({ $route: { fullPath } }) {
			const offset = positionStore[window.history.state?.key + fullPath];
			return offset;
		},
	},

	watch: {
		params: {
			immediate: true,
			deep: true,
			handler() {
				this.refreshParams();
			},
		},

		error(error) {
			if (error) {
				this.loading = false;
				clearTimeout(this.timerLoading);
				this.timerLoading = null;
				this.loading = false;
				this.fetched = true;
			}
		},

		items: {
			handler() {
				this.loading = false;
				clearTimeout(this.timerLoading);
				this.timerLoading = null;
				this.loading = false;
				this.fetched = true;
			},
		},
	},

	created() {
		this.unregisterRouterHook = this.$router.beforeEach((to, from, next) => {
			const offset = this.$refs?.list?.getOffset();
			positionStore[window.history.state?.key + from.fullPath] = offset;
			return next();
		});
	},

	beforeDestroy() {
		this.unregisterRouterHook();
	},

	methods: {
		refreshParams() {
			this.fetched = false;
			clearTimeout(this.timerRefresh);
			this.timerRefresh = setTimeout(this.refresh, 50);
		},

		refresh() {
			this.loadPage(this.params);
		},

		loadNextPage() {
			const { paginationKey, loading, params } = this;

			/* istanbul ignore else */
			if (!loading && paginationKey) {
				this.loadPage({ ...params, paginationKey, instantLoading: true });
			}
		},

		loadPage({ paginationKey, instantLoading = false, ...params }) {
			if (instantLoading) {
				this.loading = true;
			} else {
				clearTimeout(this.timerLoading);
				this.timerLoading = setTimeout(() => {
					this.timerLoading = null;
					this.loading = true;
				}, 200);
			}

			this.fetch({ ...params, paginationKey });
		},

		fetch(params) {
			this.$emit('fetch', params);
		},

		onItemClick(event) {
			this.$emit('item-click', event);
		},
	},
};
</script>

<style lang="scss" scoped>
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

.w-list__item-error {
	text-align: center;
	margin: 10px 0;
}

.w-list__item-error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.w-list__item-error-link {
	text-decoration: underline;
	display: block;
}

.w-list__view-more-movements {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 40px 0;
}

.w-list__view-more-movements__icon {
	margin-right: 20px;
}
</style>
