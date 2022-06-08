export default {
	namespaced: true,

	actions: {
		changePassword({ dispatch }, password) {
			const url = '/current/user/password';
			const method = 'PUT';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { password },
				},
				{ root: true }
			);
		},

		getPersonalDetails({ dispatch }) {
			const url = '/current/user/';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			);
		},

		ssoLogin({ dispatch }) {
			const url = '/current/user/sso-login';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			);
		},

		ssoBolsaCaminos({ dispatch }) {
			const url = '/current/user/bolsa-caminos-session';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			);
		},

		getNotificationMode({ dispatch, rootState }, { data, source, origin }) {
			const userId = data?.userId;
			const userUUID = rootState.secure.uuid;

			const method = 'GET';
			const url = `/notifications/${userId}`;

			return dispatch(
				'service/request',
				{ service: { request: { url, method } } },
				{ root: true }
			).then(({ data: { smsByEmail } }) =>
				source.postMessage(
					{
						name: 'update-session',
						payload: { isNotificationByEmail: smsByEmail },
						userUUID,
						userId,
					},
					origin
				)
			);
		},

		changeNotificationMode({ dispatch, rootState }, { data, source, origin }) {
			const { userId, smsByEmail } = data;
			const userUUID = rootState.secure.uuid;

			const method = 'PATCH';
			const url = `/notifications/${userId}`;
			const payload = { smsByEmail };

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload,
				},
				{ root: true }
			).then(() =>
				source.postMessage(
					{
						name: 'update-session',
						payload: { isNotificationByEmail: smsByEmail },
						userUUID,
						userId,
					},
					origin
				)
			);
		},

		requestOption({ dispatch, rootState }, { data, source, origin }) {
			const { userId, action } = data;
			const userUUID = rootState.secure.uuid;
			const url = {
				unlock: `/assisted-channels/users/${userId}/${action}`,
				resetPassword: `/assisted-channels/users/${action}`,
				generateOtp: `/assisted-channels/users/${action}`,
			}[action];
			const method = {
				unlock: 'PATCH',
				resetPassword: 'PATCH',
				generateOtp: 'POST',
			}[action];
			const actionUpperCase = {
				unlock: 'UNLOCK_USER',
				resetPassword: 'RESET_PASSWORD',
				generateOtp: 'GENERATE_OTP',
			}[action];

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			)
				.then(() =>
					source.postMessage(
						{
							name: 'open-notification',
							text: `INFO.${actionUpperCase}.SUCCESS`,
							userUUID,
							userId,
						},
						origin
					)
				)
				.catch((error) => {
					let text = `INFO.${actionUpperCase}.ERROR`;

					/* istanbul ignore else */
					if (error?.response) {
						const { errorCode, details } = error.response?.data;
						const UNLOCKING_ERROR = 'C4000000';

						/* istanbul ignore else */
						if (details && errorCode === UNLOCKING_ERROR) {
							const [{ relatedFields }] = details;

							text =
								relatedFields[0] === 'passwordHash'
									? 'INFO.UNLOCK_USER.PASSWORD_ERROR'
									: 'INFO.UNLOCK_USER.PHONE_ERROR';
						}
					}

					source.postMessage(
						{
							name: 'open-notification',
							text,
							userUUID,
							userId,
						},
						origin
					);
				});
		},

		getSirvaseRequests(
			{ dispatch, rootState },
			{ data, source, origin, paginationKey, requestId, payload }
		) {
			const queryParams = {};
			let url = '/customer-support/request';
			const method = 'GET';

			if (paginationKey) {
				Object.assign(queryParams, { ...queryParams, paginationKey });
			}

			if (requestId) {
				url = url.concat(`/${requestId}`);
			}

			const userUUID = rootState.secure.uuid;
			const { userId } = data;

			Object.assign(queryParams, { ...queryParams, type: 'extended' });

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams,
					payload,
				},
				{ root: true }
			).then((res) => {
				source.postMessage(
					{
						name: 'sirvase-request',
						payload: res.data,
						userUUID,
						userId,
					},
					origin
				);
			});
		},

		recoverPassword({ dispatch, rootState }, { documentId, pan, pin }) {
			const { companyId } = rootState.app;
			const url = '/users/password';
			const method = 'POST';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: {
						document_id: documentId,
						pan,
						pin,
						channel: 'WEB',
						company_id: companyId,
					},
				},
				{ root: true }
			);
		},

		resetPassword({ dispatch }, { oldPassword, password }) {
			const url = '/users/password';
			const method = 'PUT';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { oldPassword, password },
				},
				{ root: true }
			);
		},
	},
};
