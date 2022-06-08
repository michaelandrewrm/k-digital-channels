<script>
import { ItemProps } from 'vue-virtual-scroll-list/src/props';

const Wrapper = {
	created() {
		this.shapeKey = this.horizontal ? 'offsetWidth' : 'offsetHeight';
	},

	mounted() {
		if (typeof ResizeObserver !== 'undefined') {
			this.resizeObserver = new ResizeObserver(() => {
				this.dispatchSizeChange();
			});
			this.resizeObserver.observe(this.$el);
		}
	},

	// since component will be reused, so dispatch when updated
	updated() {
		this.dispatchSizeChange();
	},

	beforeDestroy() {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	},

	methods: {
		getCurrentSize() {
			return this.$el ? this.$el[this.shapeKey] : 0;
		},

		// tell parent current size identify by unique key
		dispatchSizeChange() {
			this.$parent.$emit(this.event, this.uniqueKey, this.getCurrentSize(), this.hasInitial);
		},
	},
};

// wrapping for item
export default {
	name: 'virtual-list-item',

	mixins: [Wrapper],

	props: ItemProps,

	render(h) {
		const {
			tag,
			component,
			extraProps = {},
			index,
			scopedSlots = {},
			uniqueKey,
			$listeners,
		} = this;
		extraProps.source = this.source;
		extraProps.index = index;

		return h(
			tag,
			{
				key: uniqueKey,
				attrs: {
					role: 'listitem',
				},
				on: $listeners,
			},
			[
				h(component, {
					props: extraProps,
					scopedSlots,
				}),
			]
		);
	},
};
</script>
