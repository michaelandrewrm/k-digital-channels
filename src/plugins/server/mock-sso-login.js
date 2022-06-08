import { Response } from 'miragejs';

export default () => {
	const response = {
		sessionId: 'session-123',
		cookie: { name: 'SESSION_EFBC', value: 'session-efbc-123' },
	};

	return new Response(200, {}, response);
};
