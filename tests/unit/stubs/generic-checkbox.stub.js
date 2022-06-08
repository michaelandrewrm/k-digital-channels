export default {
	props: ['value'],
	model: { prop: 'value', event: 'update:value' },
	computed: {
		localValue: {
			get() {
				return this.value;
			},
			set() {
				this.$emit('update:value', !this.value);
			},
		},
	},
	template: `
		<input
			v-bind="$attrs"
			v-on="$listeners"
			type="checkbox"
			v-model="localValue"
		/>
	`,
};
