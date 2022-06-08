<template>
	<div class="v-sso-rsi-form">
		<form method="post" :action="url" ref="form">
			<input type="hidden" name="usuarioBE" :value="userId" />
			<input type="hidden" name="tokenSSO" :value="tokenSSO" />
			<input v-if="usuarioAgente" type="hidden" name="usuarioAgente" :value="usuarioAgente" />
		</form>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'v-sso-rsi-form',

	props: {
		userId: { type: String, required: true },
		tokenSSO: { type: String, required: true },
		usuarioAgente: { type: String },
	},

	computed: {
		...mapState('app', ['companyId']),
		...mapState('session', ['lang']),

		url({ lang, usuarioAgente, companyId }) {
			const languages = { es: 'es_ES', en: 'en_UK', ca: 'ca_ES' };
			const language = languages[lang] || languages.es;
			const loginType = usuarioAgente ? 'accesoSSOPIN' : 'accesoSSO';
			const portal = companyId === 'BF' ? 115 : 116;
			const releaseStage = window.VUE_APP_CONFIG?.env || 'dev';
			const domain = {
				BF: {
					prd: 'https://banca.bancofaronline.es',
					tst: 'https://banca-dev.bancofaronline.es',
					dev: 'https://banca-dev.bancofaronline.es',
				},
				BC: {
					prd: 'https://banca.bancocaminosonline.es',
					tst: 'https://banca-dev.rsi.core.bancocaminosonline.es',
					dev: 'https://banca-dev.rsi.core.bancocaminosonline.es',
				},
			}[companyId][releaseStage];

			return `${domain}/isum/Main?ISUM_SCR=login&loginType=${loginType}&ISUM_Portal=${portal}&forceNewSession=true&acceso_idioma=${language}`;
		},
	},

	mounted() {
		if (this.userId && this.tokenSSO) {
			this.$refs.form.submit();
		}
	},
};
</script>

<style lang="scss" scoped>
.v-sso-rsi-form {
	width: 100%;
	height: 100%;
	position: relative;
	background: RGB(var(--color-surface-light));
}
</style>
