/* eslint-disable no-underscore-dangle */

const SET_ONLINE = 'SET_ONLINE';

export default {
	namespaced: true,

	state() {
		return { online: null };
	},

	mutations: {
		[SET_ONLINE](state, value) {
			state.online = value;
		},
	},

	actions: {
		/**
		 * Añadimos un indicador para gestionar eventos del liveagent button
		 * Añadimos deployment script para instalar liveagent app
		 * Iniciamos chat user session
		 */
		install({ dispatch, rootState }) {
			const { authn, app } = rootState;

			if (authn.isEmbedded) {
				return;
			}

			const { deployment, buttonId } = app.liveagent;
			let indicator = document.querySelector('[data-indicator]');

			/* istanbul ignore else */
			if (!indicator && !window.liveagent) {
				indicator = document.createElement('input');
				indicator.id = `liveagent_button_online_${buttonId}`;
				indicator.dataset.indicator = '';
				indicator.setAttribute('aria-hidden', true);
				indicator.style.display = 'none';

				document.body.append(indicator);

				const script = document.createElement('script');
				script.dataset.liveagent = '';
				script.type = 'text/javascript';
				script.src = `https://${deployment}.salesforceliveagent.com/content/g/js/51.0/deployment.js`;
				script.onload = /* istanbul ignore next */ () => dispatch('init');

				document.body.append(script);
			}
		},

		init({ dispatch, rootState }) {
			const { deploymentId, orgId, chatURL, buttonId } = rootState.app.liveagent;
			const liveagentButtonId = `liveagent_button_online_${buttonId}`;

			/* istanbul ignore else */
			if (!window._laq) {
				window._laq = [];
			}

			return dispatch('user/getPersonalDetails', null, { root: true }).then(({ data }) => {
				const { userId } = data;

				/* istanbul ignore else */
				if (window.liveagent) {
					window._laq.push(
						/* istanbul ignore next */ function() {
							window.liveagent.showWhenOnline(buttonId, document.getElementById(liveagentButtonId));
						}
					);

					window.liveagent.addButtonEventHandler(
						buttonId,
						/* istanbul ignore next */ (event) => dispatch('eventHandler', event)
					);

					window.liveagent.addCustomDetail('digital_id', userId, true);
					window.liveagent.init(chatURL, deploymentId, orgId);
				}
			});
		},

		/**
		 * La app liveagent realiza un ping cada 5 segundos,
		 * asignamos valor al state cada vez que se verifique
		 * la disponibilidad del agente
		 */
		eventHandler({ commit, state }, event) {
			/**
			 * Los posibles eventos a recibir son:
			 * BUTTON_ACCEPTED - Cuando el usuario inicia chat
			 * BUTTON_AVAILABLE - Cuando se verifica disponibilidad del agente
			 * BUTTON_REJECTED - Cuando se rechaza un inicio de chat
			 * BUTTON_UNAVAILABLE - Cuando se verifica disponibilidad del agente
			 */
			const isOnline = event === 'BUTTON_ACCEPTED' || event === 'BUTTON_AVAILABLE';

			/* istanbul ignore else */
			if (state.online !== isOnline) {
				commit('SET_ONLINE', isOnline);
			}
		},
	},
};
