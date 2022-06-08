export default {
	props: ['value', 'model'],
	model: { prop: 'model', event: 'update:model' },
	computed: {
		localValue: {
			get() {
				return this.model;
			},
			set() {
				this.$emit('update:model', this.value);
			},
		},
	},
	template: `
		<input
			v-bind="$attrs"
			v-on="$listeners"
			type="radio"
			v-model="localValue"
			:value="value"
		/>
	`,
};
