<template>
	<l-page>
		<h1 slot="header" tabindex="-1" data-testid="header">{{ $t('SIRVASE.TITLE') }}</h1>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';

export default {
	name: 'v-sirvase',

	components: { LPage },

	methods: {
		async getSirvaseRequests() {
			const response = await this.$store.dispatch('sirvase/get');
			const hasNotRequests = !response?.data?.length;

			/* istanbul ignore else */
			if (hasNotRequests) {
				return this.$router.replace({ name: 'sirvase-welcome' });
			}

			this.$router.replace({ name: 'sirvase-dashboard' });
		},
	},

	created() {
		this.getSirvaseRequests();
	},
};
</script>
