<template>
	<l-page>
		<h1 slot="header" tabindex="-1" data-testid="header">{{ $t('PROFILES.TITLE') }}</h1>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import LPage from '@layouts/l-page';

export default {
	name: 'v-profiles',

	components: { LPage },

	computed: {
		...mapState('profiles', ['profiles', 'isWelcome']),
	},

	methods: {
		getProfiles() {
			const { profiles, isWelcome } = this;

			if (!isWelcome && !profiles?.length) {
				return this.$router.replace({ name: 'profiles-welcome' });
			}

			this.$router.replace({ name: 'profiles-dashboard' });
		},
	},

	created() {
		this.getProfiles();
	},
};
</script>
