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
			<div class="v-helper__items" v-for="item in items" :key="item.id">
				<c-helper-item :title="item.title" :text="item.text" />
			</div>
		</section>
		<section class="v-helper__section">
			<h2 class="v-helper__section-title">
				{{ this.$t('HELPER.SEARCH') }}
			</h2>
			<c-text-field
				class="v-helper__input-search"
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

	data() {
		return {
			items: [
				{
					id: 1,
					title: '¿Cómo consultar y descargar los movimientos de una cuenta?',
					text:
						"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
				},
				{
					id: 2,
					title: '¿Cómo activar una cuenta?',
					text:
						"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
				},
			],
		};
	},

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
.v-helper__section-title {
	font-size: 2rem;
	font-weight: 400;
	margin-bottom: 10px;
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
