export default {
	name: 'c-text-area',
	model: {
		prop: 'value',
		event: 'update:value',
	},
	template: `
		<textarea
			v-bind="$attrs"
			v-on="$listeners"
			@input="$emit('update:value', $event.target.value)"
			:value="value"
		></textarea>
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
