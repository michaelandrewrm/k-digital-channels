<template>
	<l-page>
		<div class="v-helper__header" slot="header">
			<c-icon class="v-helper__header-icon" src="@icons/customerService" />
			<div class="v-helper__text-group">
				<div class="v-helper__user-text">
					{{ this.$t('HELLO') + ' ' + userName }}
				</div>
				<div class="v-helper__title-text">
					{{ this.$t('HELPER.TITLE') }}
				</div>
			</div>
		</div>
		<section class="v-helper__section">
			<h2 class="v-helper__section-title">
				{{ this.$t('HELPER.TITLE') }}
			</h2>
			<div class="v-helper__items">
				<c-helper-item />
			</div>
		</section>
		<section class="v-helper__section">
			<h2 class="v-helper__section-title">
				{{ this.$t('HELPER.SEARCH') }}
			</h2>
			<c-text-field class="v-helper__input-search">
				<c-text-field-icon>
					<c-icon></c-icon>
				</c-text-field-icon>
			</c-text-field>
		</section>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import lPage from '@layouts/l-page';
import CIcon from '@components/c-icon';
import CTextField from '@components/c-text-field';
import CTextFieldIcon from '@components/c-text-field-icon';
import CHelperItem from '@components/c-helper-item';

export default {
	name: 'v-helper',
	components: { lPage, CIcon, CTextField, CTextFieldIcon, CHelperItem },

	computed: {
		...mapState('session', ['userName']),
	},
};
</script>

<style lang="scss" scoped>
.v-helper__header {
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: left;
	gap: 15px;
	padding-top: 40px;
}
.v-helper__header-icon {
	font-size: 26px;
}
.v-helper__section {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	padding: 60px 60px 10px 60px;
}
.v-helper__section-title {
	font-size: 2rem;
	font-weight: 500;
}
.v-helper__input-search {
	margin-top: 20px;
}
</style>
