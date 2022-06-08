<template>
	<div class="c-input-phone" :class="classNames">
		<input
			:id="id"
			ref="input"
			v-model.trim="model"
			:type="type"
			inputmode="tel"
			class="c-input-phone__input text-fixed-m-book"
			v-bind="$attrs"
			v-on="$listeners"
			:aria-invalid="!valid"
			:aria-describedby="helperId"
			:placeholder="placeholder"
		/>

		<button
			v-if="contactBookSupported"
			class="c-input-phone__symbol text-l-medium"
			@click="selectContact"
		>
			<c-icon src="@icons/contactBook" />
		</button>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-input-phone',

	inheritAttrs: false,

	components: {
		CIcon,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	data() {
		return {
			rawValue: '',
			code: '+34',
			isHybrid: navigator.userAgent.includes('Skybrid'),
			isContactsSupported: 'contacts' in navigator && 'ContactsManager' in window,
		};
	},

	props: {
		placeholder: { type: String },
		value: { type: [String, Number], default: '' },
		valid: { type: Boolean, default: true },
		type: { type: String, default: 'text' },
		id: { type: String },
	},

	computed: {
		model: {
			get() {
				return this.rawValue;
			},

			set(value) {
				this.rawValue = value;
			},
		},

		contactBookSupported({ isHybrid, isContactsSupported }) {
			return isHybrid || isContactsSupported;
		},

		naturalValue({ code, rawValue }) {
			/* istanbul ignore next */
			if (rawValue.startsWith('+')) {
				return rawValue;
			}

			/* istanbul ignore next */
			if (rawValue.startsWith('00')) {
				return `+${rawValue.slice(2)}`;
			}

			return code.concat(rawValue);
		},

		classNames({ valid, type }) {
			return {
				'--invalid': !valid,
				[`--type-${type}`]: true,
			};
		},

		helperId({ id }) {
			return id /* istanbul ignore next */ ? `${id}-helper` : '';
		},
	},

	watch: {
		naturalValue(value) {
			this.$emit('update:value', value);
		},

		value: {
			immediate: true,
			handler(value) {
				this.rawValue = value /* istanbul ignore next */ ?? this.rawValue;
			},
		},
	},

	methods: {
		/* istanbul ignore next */
		async selectContact() {
			if (this.isHybrid) {
				const contactSelected = await new Promise((resolve) => {
					const channel = new MessageChannel();
					channel.port1.onmessage = ({ data }) => {
						channel.port1.close();
						resolve(data);
					};

					return this.$router.push({
						name: 'bizum-contacts',
						params: { port: channel.port2 },
					});
				});

				if (contactSelected) {
					this.model = contactSelected.phone;
				}
			} else {
				try {
					const [contacts] = await navigator.contacts.select(['name', 'tel']);
					this.model = contacts ? contacts.tel[0] : '';
				} catch {
					this.model = '';
				}
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.c-input-phone {
	display: flex;
	width: 100%;
	flex-direction: column;
	color: RGB(var(--color-text-primary));
	position: relative;
}

.c-input-phone__input {
	appearance: none;
	display: inline-flex;
	position: relative;
	width: 100%;
	height: 40px;
	overflow: visible;
	color: RGB(var(--color-text-primary));
	padding-left: 10px;
	justify-content: center;
	border: 1px solid transparent;
	border-left: 3px solid RGB(var(--color-accent-icon));
	border-radius: $border-radius-s;
	background-color: RGB(var(--color-surface-light));
	outline: none;
	font-variant: tabular-nums;
}

.c-input-phone__input::placeholder {
	color: RGB(var(--color-accent-icon));
}

.c-input-phone__input[readonly] {
	cursor: default;
}

.c-input-phone.--invalid .c-input-phone__input {
	border: 1px solid;
	border-left: 3px solid;
	border-color: RGB(var(--color-text-error));
	caret-color: RGB(var(--color-text-error));
}

.c-input-phone__code {
	width: 50px;
	margin-right: 20px;
}

.c-input-phone__symbol {
	appearance: none;
	position: absolute;
	top: 0;
	right: 0;
	width: 40px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 0;
	color: RGB(var(--color-text-primary-light));
	background-color: RGB(var(--color-accent-icon));
	border-top-right-radius: $border-radius-s;
	border-bottom-right-radius: $border-radius-s;
}

.c-input-phone.--invalid .c-input-phone__symbol {
	border: 1px solid;
	border-left: none;
	border-color: RGB(var(--color-text-error));
}
</style>
