<template>
	<l-page>
		<h1 slot="header" tabindex="-1">{{ $t('BIZUM.TITLE') }}</h1>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import bizumModule from '@modules/bizum/m-bizum';

export default {
	name: 'v-bizum',

	modules: {
		bizum: bizumModule,
	},

	components: {
		LPage,
	},

	created() {
		this.$store
			.dispatch('bizum/requestActive')
			.then(() => this.$store.dispatch('bizum/getProduct'))
			.then(() => this.$router.replace({ name: 'bizum-dashboard' }))
			.catch(() => this.$router.replace({ name: 'bizum-welcome' }));
	},
};
</script>
