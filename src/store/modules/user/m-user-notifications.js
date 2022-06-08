import SessionCache from '@modules/session/session-cache';

const cache = new SessionCache('user');

export default {
	namespaced: true,

	actions: {
		getPushNotificationState({ dispatch }) {
			const method = 'GET';
			const url = '/notifications/push';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			)
				.then(({ data }) => data?.push)
				.then((push) => {
					cache.set('push', push);
					return push;
				});
		},

		setPushNotificationState({ dispatch }, activated) {
			const method = 'POST';
			const url = '/notifications/push';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { activated },
				},
				{ root: true }
			).then(() => {
				cache.set('push', activated);
			});
		},
	},
};
