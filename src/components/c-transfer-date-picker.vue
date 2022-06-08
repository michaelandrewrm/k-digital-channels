<template>
	<div class="c-transfer-date-picker" :class="classNames">
		<input
			ref="input"
			readonly
			class="c-transfer-date-picker__input text-m-book"
			v-bind="$attrs"
			v-on="$listeners"
			v-model="inputDate"
			@click="togglePopover"
			@keydown.enter.space="togglePopover"
			@keydown.esc="showPopover = false"
			@change="showPopover = false"
		/>
		<c-icon-button
			data-testid="picker"
			class="c-transfer-date-picker__icon"
			icon="@icons/calendar"
			@click="togglePopover"
		/>
		<transition name="fade">
			<div class="c-transfer-date-picker__popover" v-if="showPopover" :position="popoverPosition">
				<div class="c-transfer-date-picker__popover-content">
					<c-calendar
						data-testid="calendar"
						v-model="date"
						:lang="lang"
						:min-date="minDate"
						:max-date="maxDate"
						@selected-date="handleSelect"
						@close="showPopover = false"
						data-helptext=""
					/>
				</div>
				<span class="c-transfer-date-picker__popover-caret" />
			</div>
		</transition>
		<c-icon-button
			v-if="inputDate"
			data-testid="clear"
			class="c-transfer-date-picker__close-icon"
			icon="@icons/close"
			@click="resetDate"
		/>
	</div>
</template>

<script>
import CCalendar from '@components/c-calendar';
import CIconButton from '@components/c-icon-button';

export default {
	name: 'c-transfer-date-picker',

	inheritAttrs: false,

	components: {
		CCalendar,
		CIconButton,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	data() {
		return {
			inputDate: null,
			date: null,
			showPopover: null,
		};
	},

	props: {
		minDate: { type: [String, Date] },
		maxDate: { type: [String, Date] },
		lang: { type: String },
		value: { type: String, default: '' },
		invalid: { type: Boolean, default: false },
		popoverPosition: { type: String },
	},

	computed: {
		classNames({ invalid }) {
			return {
				'--invalid': invalid,
			};
		},
	},

	methods: {
		togglePopover() {
			this.showPopover = !this.showPopover;
		},

		resetDate() {
			this.inputDate = null;
			this.date = null;
			this.focus();
		},

		formatDate({ day, month, year }) {
			const currentDay = day.toString().padStart(2, '0');
			const currentMonth = month.toString().padStart(2, '0');
			return {
				'YYYY-MM-DD': `${year}-${currentMonth}-${currentDay}`,
				'DD/MM/YYYY': `${currentDay}/${currentMonth}/${year}`,
			};
		},

		splitDate(date) {
			const separator = date.includes('/') ? '/' : '-';
			const rawDate = date.split(separator);
			const isISO = rawDate[0].length === 4;

			if (isISO) {
				rawDate.reverse();
			}

			const [day, month, year] = rawDate;
			return { day, month, year };
		},

		handleSelect(e) {
			const formattedDate = this.formatDate(e);
			this.inputDate = formattedDate['DD/MM/YYYY'];
		},

		focus() {
			this.$refs.input.focus();
		},

		onDocumentClick(event) {
			if (!this.$el.contains(event.target)) {
				this.showPopover = false;
			}
		},
	},

	watch: {
		value: {
			immediate: true,
			handler(value) {
				if (!value) {
					this.inputDate = null;
					this.date = null;
					return;
				}

				/* istanbul ignore else */
				if (!this.date) {
					const date = this.splitDate(value);
					const formattedDate = this.formatDate(date);
					this.inputDate = formattedDate['DD/MM/YYYY'];
					this.date = formattedDate['YYYY-MM-DD'];
				}
			},
		},

		inputDate(value) {
			if (value && value.length === 10) {
				const date = this.splitDate(value);
				const formattedDate = this.formatDate(date);

				this.$emit('update:value', formattedDate['YYYY-MM-DD']);
			} else {
				this.$emit('update:value', null);
			}
		},

		showPopover(showPopover) {
			if (showPopover) {
				document.addEventListener('click', this.onDocumentClick);
			} else {
				document.removeEventListener('click', this.onDocumentClick);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 200ms ease-in-out;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.c-transfer-date-picker {
	display: flex;
	width: 100%;
	height: 40px;
	flex-direction: column;
	color: RGB(var(--color-text-primary));
	position: relative;
}

.c-transfer-date-picker__input {
	appearance: none;
	display: inline-flex;
	position: relative;
	width: 100%;
	height: 40px;
	overflow: visible;
	color: RGB(var(--color-text-primary));
	padding-left: 10px;
	justify-content: center;
	border-left: 3px solid RGB(var(--color-accent-icon));
	border-radius: $border-radius-s;
	background-color: RGB(var(--color-surface-light));
	outline: none;
	font-variant: tabular-nums;
}

.c-transfer-date-picker__input::placeholder {
	color: RGB(var(--color-accent-icon));
}

.c-transfer-date-picker.--invalid .c-transfer-date-picker__input {
	border: 1px solid;
	border-left: 3px solid;
	border-color: RGB(var(--color-text-error));
	caret-color: RGB(var(--color-text-error));
}

.c-transfer-date-picker__icon {
	position: absolute;
	top: 0;
	right: 0;
	width: 40px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: RGB(var(--color-text-primary-light));
	background-color: RGB(var(--color-accent-icon));
	border-radius: 0 $border-radius-s $border-radius-s 0;
	@media (hover) {
		cursor: pointer;
	}
}

.c-transfer-date-picker__close-icon {
	position: absolute;
	right: 40px;
	color: RGB(var(--color-accent-icon));
	@media (hover) {
		cursor: pointer;
	}
}

.c-transfer-date-picker.--invalid .c-transfer-date-picker__icon {
	border: 1px solid;
	border-left: none;
	border-color: RGB(var(--color-text-error));
}

.c-transfer-date-picker__popover {
	position: absolute;
	bottom: 100%;
	left: 0;
	outline: none;
	z-index: $layer-popover-z-index;
	@media ($on-mobile) {
		width: 100%;
	}
}

.c-transfer-date-picker__popover[position='bottom'] {
	top: 50px;
	& .c-transfer-date-picker__popover-caret {
		left: 20px;
		transform: translateY(50%) rotate(45deg);
	}
}

.c-transfer-date-picker__popover-content {
	position: relative;
	margin-bottom: 18px;
	border-radius: $border-radius-m;
	background-color: RGB(var(--color-surface-light));
	outline: none;
	z-index: $layer-popover-z-index;
	overflow: hidden;
}

.c-transfer-date-picker__popover-caret {
	position: absolute;
	display: block;
	width: 12px;
	height: 12px;
	bottom: 0;
	left: 20px;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	border-left: 1px solid RGBA(var(--color-text-primary), 0.15);
	background-color: RGB(var(--color-surface-light));
	transform: translateY(-100%) rotate(-135deg);
	z-index: $layer-popover-z-index;
}
</style>
