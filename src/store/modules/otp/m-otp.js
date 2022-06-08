import serviceOTP from '@services/s-otp';

const SET_MODAL_STATE = 'SET_MODAL_STATE';

export default {
	namespaced: true,

	state() {
		return {
			enableModal: true,
		};
	},

	mutations: {
		[SET_MODAL_STATE](state, value) {
			state.enableModal = !!value;
		},
	},

	actions: {
		async handle({ state, dispatch }, { component, props }) {
			if (state.enableModal && component) {
				return dispatch('modal/open', { component, props }, { root: true });
			}

			window.postMessage({ name: 'bridge-request-otp', payload: props }, '*');
			return new Promise((resolve) => {
				const fn = ({ data }) => {
					/* istanbul ignore else */
					if (data?.name === 'bridge-response-otp') {
						window.removeEventListener('message', fn);
						resolve(data.payload);
					}
				};
				window.addEventListener('message', fn);
			});
		},

		send({ dispatch }, { processId, otpValue }) {
			return dispatch(
				'service/request',
				{
					service: serviceOTP,
					params: { processId },
					payload: { otpValue: otpValue.toString() },
				},
				{ root: true }
			);
		},

		requestCode({ dispatch }, processId) {
			return dispatch(
				'service/request',
				{
					service: serviceOTP,
					params: { processId },
					payload: { otpValue: 'resend' },
				},
				{ root: true }
			);
		},

		disableModal({ commit }) {
			commit(SET_MODAL_STATE, false);
		},

		enableModal({ commit }) {
			commit(SET_MODAL_STATE, true);
		},
	},
};
