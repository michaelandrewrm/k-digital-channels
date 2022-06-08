<template>
	<c-translide>
		<c-chart v-if="data && data.length" :source="data" :type="chart" v-show="data" />
	</c-translide>
</template>

<script>
import CChart from '@components/c-chart';
import moduleCashFlow from '@modules/cashflow/m-cashflow';
import CTranslide from '@components/c-translide';

export default {
	name: 'w-global-chart',

	modules: { cashflow: moduleCashFlow },

	components: { CChart, CTranslide },

	data() {
		return {
			data: null,
		};
	},

	props: { chart: String },

	methods: {
		async fetchData() {
			this.data = await this.$store.dispatch('cashflow/fetch');
		},
	},

	created() {
		this.fetchData();
	},
};
</script>
