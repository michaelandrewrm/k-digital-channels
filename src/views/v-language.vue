<template>
	<l-details>
		<h1 slot="header">{{ $t('LANGUAGE') }}</h1>

		<div>
			<p class="text-m-bold v-language__subtitle">{{ $t('LANGUAGE_SELECT') }}</p>

			<div class="v-language__expand">
				<c-button
					data-test-id="change-lang-es"
					outlined
					:raised="lang === 'es'"
					@click="changeLang('es')"
				>
					{{ $t('LANGUAGE_ES') }}
				</c-button>
				<c-button
					data-test-id="change-lang-en"
					outlined
					:raised="lang === 'en'"
					@click="changeLang('en')"
				>
					{{ $t('LANGUAGE_EN') }}
				</c-button>
			</div>
		</div>
	</l-details>
</template>

<script>
import { mapState } from 'vuex';
import LDetails from '@layouts/l-details';
import CButton from '@components/c-button';

export default {
	name: 'v-language',

	components: {
		LDetails,
		CButton,
	},

	computed: {
		...mapState('session', ['lang']),
	},

	methods: {
		changeLang(value) {
			this.$store.dispatch('session/changeLanguage', value);
		},
	},
};
</script>

<style lang="scss" scoped>
.v-language__subtitle {
	margin-top: 20px;
	padding-bottom: 10px;
	margin-bottom: 20px;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.2);
}

.v-language__expand {
	display: flex;
	width: 100%;
	justify-content: space-between;
	max-width: 360px;
	margin: 0 auto;
}

.v-language__expand > * {
	flex-shrink: 0;
	flex-basis: calc(50% - 10px);
	--color-secondary: var(--color-text-primary);
	--button-color-raised-text: var(--color-dark-text-primary);
}
</style>
