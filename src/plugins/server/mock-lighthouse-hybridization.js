/* eslint-disable no-unused-vars */
import { Response } from 'miragejs';

export default async function(schema, request) {
	return new Response(200, {}, { url: 'https://' });
}
