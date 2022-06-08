export default {
	install(Vue) {
		Vue.mixin({
			beforeCreate() {
				if (this.$options.modules) {
					Object.entries(this.$options.modules).forEach(([key, value]) => {
						const { $store } = this;
						// if the module is not already registered
						if (!$store.hasModule(key)) {
							$store.registerModule(key, { namespaced: true, ...value });
						}
					});
				}
			},
		});
	},
};
