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
			<label class="v-helper__section-title" for="v-helper__items">
				{{ this.$t('HELPER.TITLE') }}
			</label>
			<div class="v-helper__items" id="v-helper__items" v-for="item in items" :key="item.id">
				<c-helper-item :title="item.title" :text="item.text" />
			</div>
		</section>
		<section class="v-helper__section">
			<label class="v-helper__section-title" for="v-helper__search">
				{{ this.$t('HELPER.SEARCH') }}
			</label>
			<c-text-field
				class="v-helper__input-search"
				id="v-helper__search"
				:placeholder="$t('HELPER.PLACEHOLDER.SEARCH')"
				type="text"
				outlined
			>
				<c-text-field-icon slot="leadingIcon">
					<c-icon class="v-helper__search-icon" src="@icons/search" />
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

		items() {
			return [
				{
					id: 1,
					title: this.$t('HELPER.QUESTION.TITLE1'),
					text: this.$t('HELPER.QUESTION.ANSWER1'),
				},
				{
					id: 2,
					title: this.$t('HELPER.QUESTION.TITLE2'),
					text: this.$t('HELPER.QUESTION.ANSWER2'),
				},
			];
		},
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
	color: RGB(var(--color-secondary));
}
.v-helper__title-text {
	color: RGB(var(--color-secondary));
}
.v-helper__section {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	padding: 60px 60px 10px 60px;
}

@media ($on-mobile) {
	.v-helper__section {
		padding: 10px;
		margin: 30px 0;
	}
}
.v-helper__section-title {
	font-size: 2rem;
	font-weight: 400;
	margin-bottom: 10px;
}
.v-helper__items {
	width: 330px;
}
.v-helper__items:last-child {
	border-bottom: solid 1px RGB(var(--color-primary-light));
}
.v-helper__input-search {
	margin-top: 10px;
}

.v-helper__search-icon {
	font-size: 1.7rem;
}
</style>
