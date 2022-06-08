export default {
	name: 'w-list',

	props: {
		dataKey: { type: String, default: 'id' },
		messageError: { type: String },
		messageNoResults: { type: String },
		messageNextPage: { type: String },
		itemComponent: { type: [Object, null] },
		params: { type: Object },
		paginationKey: { type: [String, Number] },
		items: { type: Array },
		error: { type: Boolean },
	},

	template: `
		<div>
			<div data-testid="error" v-if="error">{{messageError}}</div>
			<div data-testid="list" v-if="items && items.length">
				<div v-for="item in items" :key="item.id">
					<component
						:is="itemComponent"
						:source="item"
						v-bind="params"
						@click.native="$emit('item-click', item[dataKey])"/>
				</div>
			</div>
		</div>
	`,

	watch: {
		params: {
			immediate: true,
			handler(params) {
				this.$emit('fetch', { ...params, paginationKey: this.paginationKey });
			},
		},
	},
};
