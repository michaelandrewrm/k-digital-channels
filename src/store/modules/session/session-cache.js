import vuex from '@store';

const { state } = vuex;

const privateStore = new Map();

class SessionCache {
	constructor(name) {
		this.id = name;
	}

	get store() {
		// Sí, con side effects pero la alternativa es migrar esta clase
		// al store y llenar el código de async await y lo veo peor.
		const { identity } = state.secure;

		if (!privateStore.has(identity)) {
			privateStore.set(identity, new Map());
		}

		const store = privateStore.get(identity);

		if (!store.has(this.id)) {
			store.set(this.id, new Map());
		}

		return store.get(this.id);
	}

	has(key) {
		return this.store.has(key);
	}

	get(key) {
		return this.store.get(key);
	}

	set(key, value) {
		this.store.set(key, value);
	}

	clear(key) {
		if (key) {
			this.store.forEach((cacheValue, cacheKey) => {
				if (cacheKey.startsWith(key)) {
					this.store.delete(cacheKey);
				}
			});
		} else {
			this.store.clear();
		}
	}

	static clear(name) {
		if (name && privateStore.get(state.secure.identity)) {
			privateStore.get(state.secure.identity).forEach((cacheValue, cacheKey) => {
				if (cacheKey.startsWith(name)) {
					cacheValue.clear();
				}
			});
		} else {
			privateStore.clear();
		}
	}
}

// Cuando cambie la identidad, significa que el usuario ha perdido
// la sesión. En ese caso eliminamos la cache por completo.
vuex.watch(({ secure: { identity } }) => identity, () => SessionCache.clear());

export default SessionCache;
