<template>
	<v-calendar
		ref="calendar"
		is-expanded
		:min-date="minDate"
		:max-date="maxDate"
		:first-day-of-week="2"
		:locale="lang"
		:attributes="[
			{
				dates: value,
				highlight: {
					class: 'c-calendar__selected-day',
					contentClass: '--selected',
				},
			},
		]"
		@dayclick="setDate"
		@daykeydown="handleKeydown"
	/>
</template>

<script>
import VCalendar from 'v-calendar/lib/components/calendar.umd';

export default {
	name: 'c-calendar',

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		lang: { type: String },
		minDate: { type: String },
		maxDate: { type: String },
		value: { type: String },
	},

	components: { VCalendar },

	methods: {
		setDate(e) {
			const { id, isDisabled } = e;
			/* istanbul ignore else */
			if (!isDisabled) {
				this.$emit('update:value', id);
				this.$emit('selected-date', e);
				this.$emit('close');
			}
		},
		handleKeydown(e) {
			const { keyCode } = e.event;
			const SPACE = 32;
			const ENTER = 13;

			/* istanbul ignore else */
			if (keyCode === SPACE || keyCode === ENTER) {
				this.setDate(e);
			}
		},
	},

	mounted() {
		const { calendar } = this.$refs;
		if (this.value) {
			calendar.move(this.value).catch(/* istanbul ignore next */ () => {});
		}
	},
};
</script>

<style lang="scss" scoped>
.vc-container {
	background-color: RGB(var(--color-surface-light));
	border-color: RGBA(var(--color-text-primary), 0.15);
	border-radius: $border-radius-m;
	@extend %typo-m-book;
	& /deep/ .vc-arrow {
		color: RGB(var(--color-text-primary));
		border-radius: 50%;
		&:hover {
			color: RGB(var(--color-primary));
		}
	}
	& /deep/ .vc-title,
	/deep/ .vc-weekday {
		color: RGB(var(--color-text-primary));
	}
	& /deep/ .c-calendar__selected-day {
		background-color: RGB(var(--color-secondary));
	}
	& /deep/ .vc-day-content {
		color: RGB(var(--color-text-primary));
		&.is-disabled {
			cursor: default;
			color: RGBA(var(--color-text-primary), 0.4);
		}
		&.is-disabled:hover {
			background-color: transparent;
		}
		&.--selected {
			color: RGB(var(--color-primary));
		}
		&:hover:not(.is-disabled) {
			background-color: RGBA(var(--color-text-accent), 0.15);
		}
	}
	& /deep/ .vc-popover-content-wrapper {
		& .vc-nav-popover-container {
			background-color: RGB(var(--color-surface-light));
			border-color: RGBA(var(--color-text-primary), 0.15);
			border-radius: $border-radius-m;
			color: RGB(var(--color-text-primary));
			& .vc-nav-item {
				border-radius: $border-radius-m;
				&.is-active {
					color: RGB(var(--color-primary));
					background-color: RGB(var(--color-secondary));
				}
				&:not(.is-active):hover {
					color: RGB(var(--color-text-primary));
					background-color: RGBA(var(--color-text-accent), 0.15);
					box-shadow: unset;
				}
				&.is-current {
					color: RGB(var(--color-text-primary));
					border-width: 1px;
					border-color: RGB(var(--color-secondary));
				}
			}
			& .vc-nav-arrow {
				border-radius: $border-radius-m;
				&:hover {
					color: RGB(var(--color-text-primary));
					background-color: RGBA(var(--color-text-accent), 0.15);
				}
			}
			& .vc-nav-title {
				color: RGB(var(--color-text-primary));
				border-radius: $border-radius-m;
				&:hover {
					color: RGB(var(--color-text-primary));
					background-color: RGBA(var(--color-text-accent), 0.15);
				}
			}
		}
	}
	@media (hover) {
		cursor: pointer;
	}
}
</style>
