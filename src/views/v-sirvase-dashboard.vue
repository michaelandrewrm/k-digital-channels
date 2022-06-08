<template>
	<l-page>
		<h1 tabindex="-1" slot="header">{{ $t('SIRVASE.TITLE') }}</h1>

		<h2
			v-if="!loading && hasItems"
			slot="main-fixed-header"
			class="v-sirvase-dashboard__list-title text-m-medium"
		>
			{{ $t('SIRVASE.DASHBOARD.REQUESTS_LIST.TITLE') }}
		</h2>

		<c-translide>
			<div class="v-sirvase-dashboard__content text-s-book">
				<w-sirvase-requests
					data-testid="requests-list"
					@loading="loading = $event"
					@hasItems="hasItems = !$event"
				/>
			</div>
		</c-translide>

		<c-button
			raised
			slot="buttons"
			data-testid="submit"
			@click="$router.push({ name: 'sirvase-create' })"
		>
			{{ $t('ACTIONS.NEW_SIRVASE_REQUEST') }}
		</c-button>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CButton from '@components/c-button';
import CTranslide from '@components/c-translide';
import WSirvaseRequests from '@widgets/w-sirvase-requests';

export default {
	name: 'v-sirvase-dashboard',

	components: {
		LPage,
		CButton,
		CTranslide,
		WSirvaseRequests,
	},

	data() {
		return {
			loading: true,
			hasItems: false,
		};
	},
};
</script>

<style lang="scss">
.v-sirvase-dashboard__content {
	margin-top: 20px;
}

.v-sirvase-dashboard__items {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.v-sirvase-dashboard__list-title {
	max-width: 550px;
	padding: 20px 20px 0px;
	margin-bottom: -10px;
}
</style>
