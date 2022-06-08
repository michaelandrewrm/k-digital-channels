<template>
	<l-page>
		<h1 slot="header" tabindex="-1" data-testid="header">{{ $t('ONTIME.TITLE') }}</h1>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import LPage from '@layouts/l-page';

export default {
	name: 'v-ontime',

	components: { LPage },

	computed: {
		...mapState('ontime', ['isWelcome']),
	},

	methods: {
		async getOntimeProducts() {
			const productsOntime = await this.$store.dispatch('ontime/get');
			const products = productsOntime.filter(({ onTime }) => onTime);

			/* istanbul ignore else */
			if (!this.isWelcome && !products?.length) {
				return this.$router.replace({ name: 'ontime-welcome' });
			}

			this.$router.replace({ name: 'ontime-dashboard' });
		},
	},

	created() {
		this.getOntimeProducts();
	},
};
</script>
