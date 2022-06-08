import { Response } from 'miragejs';

export default function() {
	return new Response(203, {}, { language: 'es' });
}
