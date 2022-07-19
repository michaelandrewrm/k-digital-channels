<template>
	<l-page>
		<div class="v-helper__title" slot="header">
			<c-icon class="v-helper__title-icon" src="@icons/customerService" />
			<div>
				<div>
					{{ this.$t('HELLO') + ' ' + userName }}
				</div>
				<div>
					{{ this.$t('HELPER.TITLE') }}
				</div>
			</div>
		</div>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import lPage from '@layouts/l-page';
import CIcon from '@components/c-icon';

export default {
	name: 'v-helper',
	components: { lPage, CIcon },

	computed: {
		...mapState('session', ['userName']),
	},
};
</script>

<style lang="scss" scoped>
.v-helper__title {
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: left;
	gap: 15px;
	padding-top: 40px;
}
.v-helper__title-icon {
	font-size: 26px;
}
</style>
