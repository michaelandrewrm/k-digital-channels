<template>
	<l-page>
		<h1 slot="header" tabindex="-1">{{ $t('BIZUM.TITLE') }}</h1>

		<div slot="main-fixed-header" class="v-bizum-ongs__search-engine">
			<div class="text-m-medium">{{ $t('SEARCH_ONG') }}</div>

			<c-transfer-field
				data-testid="search-input"
				class="v-bizum-ongs__field"
				v-model="searchString"
				:placeholder="$t('FORM.PLACEHOLDER.SEARCH_ONG')"
			/>
		</div>

		<w-list
			:messageError="$t(`RESOURCE.ONG.ERROR`)"
			:messageNoResults="$t(`RESOURCE.ONG.NO_RESULTS`)"
			:messageNextPage="$t(`RESOURCE.ONG.VIEW_MORE`)"
			:itemComponent="itemComponent"
			:params="params"
			:items="items"
			:error="error"
			:paginationKey="paginationKey"
			@fetch="fetch"
			@item-click="onItemClick"
		></w-list>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import bizumModule from '@modules/bizum/m-bizum';
import CTransferField from '@components/c-transfer-field';
import WList from '@widgets/w-list';
import WBizumOng from '@widgets/w-bizum-ong';

export default {
	name: 'v-bizum-ongs',

	modules: { bizum: bizumModule },

	components: {
		LPage,
		WList,
		CTransferField,
	},

	data() {
		return {
			searchString: null,
			query: null,
			debounce: null,
			value: null,
			items: [],
			error: false,
			paginationKey: null,
			itemComponent: WBizumOng,
		};
	},

	props: {
		port: { type: [MessagePort, Object] },
	},

	computed: {
		params({ query }) {
			return { name: query };
		},
	},

	watch: {
		searchString(value) {
			clearTimeout(this.debounce);
			this.debounce = setTimeout(() => {
				this.query = value;
			}, 300);
		},

		value(value) {
			/* istanbul ignore else */
			if (this.port) {
				this.port.postMessage(value);
				this.port.close();
			}
		},
	},

	methods: {
		fetch({ name, paginationKey }) {
			this.error = false;

			this.$store
				.dispatch('bizum/getONGs', { paginationKey, query: { name } })
				.then(({ data, paging }) => {
					this.items = data;
					this.paginationKey = paging?.nextPaginationKey;
				})
				.catch(() => {
					this.error = true;
				});
		},

		async onItemClick(id) {
			this.value = await this.$store.dispatch('bizum/getONG', id);
			this.$router.back();
		},
	},

	beforeDestroy() {
		/* istanbul ignore next */
		if (!this.value && this.port) {
			this.port.postMessage(null);
			this.port.close();
		}
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-ongs__search-engine {
	padding: 10px 20px;
	max-width: 550px;
}

.v-bizum-ongs__field {
	margin-top: 10px;
}
</style>
