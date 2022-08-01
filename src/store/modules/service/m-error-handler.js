import {
	UUID_EXPIRED,
	USER_WILL_BE_TEMP_BLOCKED,
	USER_WAS_TEMP_BLOCKED,
	USER_WILL_BE_PERMANENTLY_BLOCKED,
	USER_WAS_PERMANENTLY_BLOCKED,
	OTP_REQUIRED,
	INVALID_REMEMBER_TOKEN,
	REQUEST_TIMEOUT,
} from '@modules/service/constants';

export default {
	namespaced: true,

	actions: {
		async handle({ dispatch, rootState }, { error, requestConfig }) {
			if (error.code === REQUEST_TIMEOUT) {
				const component = await import(
					/* webpackChunkName: "chunk-m-errors" */ '@modals/m-request-timeout'
				);
				await dispatch('modal/open', component, { root: true });
				return error;
			}

			/* istanbul ignore next */
			if (!error.response) {
				return error;
			}

			const { response } = error;
			const { errorCode } = response.data;
			let returnReq = error;

			switch (errorCode) {
				case UUID_EXPIRED: {
					const { authn, agent } = rootState;

					if (authn?.loggedIn) {
						await dispatch('authn/passiveLogout', null, { root: true });
					} else if (agent?.loggedIn) {
						await dispatch('agent/passiveLogout', null, { root: true });
					} else {
						await dispatch('secure/refreshSession', null, { root: true });
						return new Promise((resolve) => {
							dispatch('service/request', requestConfig, { root: true })
								.then((res) => {
									resolve(res);
								})
								.catch((err) => {
									resolve(err);
								});
						});
					}
					break;
				}

				case INVALID_REMEMBER_TOKEN: {
					await dispatch('session/removeUserSession', null, { root: true });
					await dispatch('session/forgetUserSession', null, { root: true });
					break;
				}

				case USER_WILL_BE_TEMP_BLOCKED: {
					const component = await import(
						/* webpackChunkName: "chunk-m-errors" */ '@modals/m-sign-temp-error'
					);
					await dispatch('modal/open', component, { root: true });
					break;
				}

				case USER_WAS_TEMP_BLOCKED: {
					const { unlockingTime = 0 } = response.data.additionalInfo;
					const minutes = Math.max(1, Math.ceil(unlockingTime / 1000 / 60));
					const props = { minutes };
					const component = await import(
						/* webpackChunkName: "chunk-m-errors" */ '@modals/m-sign-temp-blocked'
					);

					await dispatch('modal/open', { component, props }, { root: true });
					break;
				}

				case USER_WILL_BE_PERMANENTLY_BLOCKED: {
					const component = await import(
						/* webpackChunkName: "chunk-m-errors" */ '@modals/m-sign-error'
					);
					await dispatch('modal/open', component, { root: true });
					break;
				}

				case USER_WAS_PERMANENTLY_BLOCKED: {
					const component = await import(
						/* webpackChunkName: "chunk-m-errors" */ '@modals/m-sign-blocked'
					);

					returnReq.response.data.errorCode = await dispatch('modal/open', component, {
						root: true,
					});
					break;
				}

				case OTP_REQUIRED: {
					const { authn } = rootState;
					const component = await import(/* webpackChunkName: "m-otp" */ '@modals/m-otp');
					const { processId } = response.data?.additionalInfo;

					const otpHandle = await dispatch(
						'otp/handle',
						{
							component,
							props: { processId, sca: !authn?.loggedIn },
						},
						{ root: true }
					);

					/* istanbul ignore else */
					if (otpHandle) {
						returnReq = otpHandle;
					}
					break;
				}
			}

			return returnReq;
		},
	},
};
