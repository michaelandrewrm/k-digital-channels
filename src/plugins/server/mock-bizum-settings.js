import { Response } from 'miragejs';

const baseURL =
	window.VUE_APP_CONFIG?.endpoint || process.env.VUE_APP_ENDPOINT || 'https://api.grupocaminos.es';

export default async function() {
	const response = {
		url: `${baseURL}/bizum/terms`,
		pdf: `${baseURL}/bizum/Condiciones_Bizum_v1-1.pdf`,
		version: '1.0.0',
	};

	return new Response(200, {}, response);
}
