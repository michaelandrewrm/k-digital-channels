import Vue from 'vue';

const event = new Vue();

const ADD = 'ADD';
const REMOVE = 'REMOVE';

export default ({ timeout, name = 'modal' } = {}) => ({
	namespaced: true,

	state: () => ({
		name,
		queue: {},
		lastUID: 0,
	}),

	mutations: {
		[ADD](state, data) {
			state.lastUID += 1;
			Vue.set(state.queue, state.lastUID, data);
		},

		[REMOVE](state, id) {
			Vue.delete(state.queue, id);
		},
	},

	actions: {
		/**
		 * Open a modal view.
		 *
		 * @param {Object} store
		 * @param {Object} data
		 * @param {Object} data.component A Modal Component class.
		 * @param {Object} data.props Props to pass on a modal component instance.
		 *
		 * @example
		 * ```js
		 * 		await this.$store.dispatch('modal/open', {
		 *				component: await import('@modals/m-sign-temp-blocked'),
		 *				props: { minutes: 1000 },
		 * 		});
		 * ```
		 *
		 * @returns {Promise} Returns a promise which resolves when the modal closes.
		 */
		open({ commit, state, dispatch }, data) {
			return new Promise((resolve) => {
				const syncComponent = data.component ?? data;
				const modal = syncComponent.default ?? syncComponent;
				const props = data.component && data.props ? data.props : {};
				const layer = data.layer ?? 1;

				// extend data only if it's a component
				const Data = modal.render ? Vue.extend(modal) : modal;
				const componentOptions =
					Data && Data.options ? { name: Data.options.name } : { text: data.text };
				dispatch('bugsnag/log', { title: `${name} open`, ...componentOptions }, { root: true });
				commit(ADD, { component: Data, props, layer });

				const modalId = state.lastUID;

				const onRemove = (closedId, payload) => {
					if (closedId === modalId) {
						event.$off('remove', onRemove);
						resolve(payload);
					}
				};

				event.$on('remove', onRemove);

				if (modal.timeout !== Infinity && (modal.timeout || props.timeout || timeout)) {
					setTimeout(() => {
						dispatch('close', { id: modalId });
					}, modal.timeout || props.timeout || timeout);
				}
			});
		},

		/**
		 * Closes a modal.
		 *
		 * @param {Object} store
		 * @param {Number} id Modal id to close
		 */
		close({ commit, getters }, { id = getters.lastUIDOpened, payload } = {}) {
			commit(REMOVE, ~~id);
			event.$emit('remove', ~~id, payload);
		},

		/**
		 * Replaces the current modal with another modal.
		 *
		 * @param {Object} store
		 * @param {Object} modal Modal component
		 */
		async replace({ commit, getters, dispatch }, modal) {
			const id = getters.lastUIDOpened;

			commit(REMOVE, id);
			await dispatch('open', modal);
			event.$emit('remove', id);
		},

		closeAll({ dispatch, state: { queue } }) {
			Object.entries(queue).forEach(() => {
				dispatch('close');
			});
		},
	},

	getters: {
		lastUIDOpened({ queue }) {
			const [lastUID] = Object.keys(queue).slice(-1);
			return window.parseInt(lastUID, 10);
		},

		lastOpened({ queue }, { lastUIDOpened }) {
			return queue[lastUIDOpened];
		},
	},
});
