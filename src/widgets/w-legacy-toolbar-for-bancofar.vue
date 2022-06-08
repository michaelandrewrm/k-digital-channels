<template>
	<div class="w-legacy-toolbar-for-bancofar__actions">
		<c-icon
			v-if="isBancofar"
			class="w-legacy-toolbar-for-bancofar__mini-icon"
			src="@icons/productBancofar"
			size="xl"
		/>
		<c-icon
			v-else
			class="w-legacy-toolbar-for-bancofar__mini-icon"
			src="@icons/productLineaCaminos"
			size="xl"
		/>
		<span class="text-m-medium">{{ this.$t('LEGACY_WEB.TITLE') }}</span>
		<c-toggle
			data-test-id="toggle-skyline"
			class="w-legacy-toolbar-for-bancofar__toggle"
			v-model="isRuralViaActive"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import CIcon from '@components/c-icon';
import CToggle from '@components/c-toggle';

export default {
	name: 'w-legacy-toolbar-for-bancofar',

	components: {
		CIcon,
		CToggle,
	},

	data() {
		return {
			isRuralViaActive: false,
		};
	},

	computed: {
		...mapState('app', ['companyId']),

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},
	},

	watch: {
		isRuralViaActive(isRuralViaActive) {
			if (isRuralViaActive && this.$route.name !== 'sso-rsi') {
				this.$router.push({ name: 'sso-rsi' });
			}

			if (!isRuralViaActive && this.$route.name !== 'global') {
				this.$router.push({ name: 'global' });
			}
		},
	},

	created() {
		this.isRuralViaActive = this.$route.name === 'sso-rsi';
	},
};
</script>

<style lang="scss" scoped>
.w-legacy-toolbar-for-bancofar__actions {
	height: 70px;
	padding: 0 20px;
	background: RGB(var(--color-surface-dark));
	display: flex;
	align-items: center;
	flex-shrink: 0;
	gap: 10px;
	position: relative;
	z-index: 1;
	box-shadow: 0px 0px 15px -10px black;
	margin-bottom: var(--safe-area-bottom);
	color: RGB(var(--color-text-primary));
}
</style>
