<script>
export default {
	functional: true,

	render(createElement, options) {
		const { parent, slots, data, listeners, props } = options;
		const $slots = slots();
		const list = [];

		const onLiClick = (e) => {
			if (e.target !== e.currentTarget) {
				return;
			}

			const el = e.target;
			const index = $slots.default.findIndex(
				({ elm }) => el.firstElementChild.firstElementChild === elm
			);

			/* istanbul ignore else */
			if (listeners['select-pane']) {
				listeners['select-pane'](index);
			}
		};

		/* istanbul ignore else */
		if ($slots.default) {
			$slots.default.forEach((element, i) => {
				/* istanbul ignore else */
				if (element.tag) {
					list.push(
						createElement(
							'li',
							{
								on: { click: onLiClick },
								attrs: {
									'data-testid': 'slider-pane',
									'aria-hidden': i !== props.active,
								},
								class: {
									'c-slider-wrapper__item-outer': true,
									'--active': i === props.active,
								},
							},
							[createElement('div', { class: 'c-slider-wrapper__item' }, [element])]
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
				class: { ...data.class, 'c-slider-wrapper': true },
			},
			list
		);
	},
};
</script>

<style lang="scss" scoped>
.c-slider-wrapper {
	display: flex;
	align-items: flex-start;
	width: 100%;
	height: 100%;
	-webkit-overflow-scrolling: touch;
	scrollbar-width: none;
	-ms-overflow-style: none;
	will-change: transform;
}

.c-slider-wrapper__item-outer {
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	flex-shrink: 0;
}

.c-slider-wrapper__item-outer:not(.--active) .c-slider-wrapper__item {
	pointer-events: none;
}

@media (hover) {
	.c-slider-wrapper__item-outer:not(.--active) {
		cursor: pointer;
	}
}

.c-slider-wrapper__item-outer {
	transform: scale(0.9);
	transition: transform 200ms ease;
}

@media ($on-tablet) {
	.c-slider-wrapper__item-outer {
		transform: scale(0.7);
	}
}

.c-slider-wrapper__item-outer.--active {
	transform: scale(1);
}

.c-slider-wrapper__item-outer + .c-slider-wrapper__item-outer {
	margin-left: var(--gap);
}

.c-slider-wrapper__item {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
}
</style>
