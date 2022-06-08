<script>
export default {
	name: 'c-list-option',

	functional: true,

	render(createElement, options) {
		const { parent, slots, data, listeners } = options;
		const $slots = slots();
		const list = [];

		/* istanbul ignore else */
		if ($slots.default) {
			$slots.default.forEach((element) => {
				if (element.tag) {
					list.push(
						createElement(
							'li',
							{
								class: `c-list-option__item ${
									element.data.staticClass && element.data.staticClass.includes('--border')
										? '--border'
										: ''
								}`,
							},
							[element]
						)
					);
				}
			});
		}

		return createElement(
			'ul',
			{
				...data,
				on: listeners,
				attrs: {
					// eslint-disable-next-line no-underscore-dangle
					[parent.$options._scopeId]: '',
				},
				class: { ...data.class, 'c-list-option': true },
			},
			list
		);
	},
};
</script>

<style lang="scss" scoped>
.c-list-option__item {
	display: flex;
	align-items: center;
}

.c-list-option__item /deep/ > * {
	padding-left: 20px;
	text-decoration: none;
	flex-grow: 1;
	align-self: stretch;
	display: flex;
	align-items: flex-start;
	user-select: none;
	padding: 16px 0;
}

.c-list-option__item /deep/ > * > .c-icon {
	font-size: 16px;
	margin-right: 10px;
	flex-shrink: 0;
}

.c-list-option__item /deep/ > * > :not(.c-icon) {
	flex-grow: 1;
}

.c-list-option__item /deep/ > * > :not(.c-icon) + * {
	flex-shrink: 0;
	flex-grow: 0;
}

.c-list-option__item.--border {
	border-top: 1px solid RGBA(var(--color-dark-surface), 0.2);
	border-bottom: 1px solid RGBA(var(--color-dark-surface), 0.2);
	padding: 4px 0;
	margin-bottom: 4px;
}

.c-list-option__item + .c-list-option__item.--border {
	margin-top: 14px;
}
</style>
