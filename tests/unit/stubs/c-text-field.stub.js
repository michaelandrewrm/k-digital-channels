export default {
	name: 'c-text-field',
	model: {
		prop: 'value',
		event: 'update:value',
	},
	template: `
		<input
			:value="value"
			v-bind="$attrs"
			v-on="$listeners"
			@input="$emit('update:value', $event.target.value)"
		/>
	`,
	props: {
		value: { type: String },
	},
	methods: {
		focus() {
			this.$el.focus();
		},
	},
};
