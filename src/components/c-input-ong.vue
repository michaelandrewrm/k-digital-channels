<template>
	<div class="c-input-ong" :class="classNames">
		<input
			:id="id"
			ref="input"
			class="c-input-ong__input text-fixed-m-book"
			v-bind="$attrs"
			v-on="$listeners"
			:value="ongName"
			:aria-invalid="!valid"
			:aria-describedby="helperId"
			:readonly="true"
			@click="selectONG"
		/>

		<button class="c-input-ong__symbol text-l-medium" @click="selectONG">
			<c-icon src="@icons/contactBook" />
		</button>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-input-ong',

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
			ongName: '',
			ongCode: '',
		};
	},

	props: {
		value: { type: Object },
		valid: { type: Boolean, default: true },
		id: { type: String },
	},

	computed: {
		classNames({ valid, type }) {
			return {
				'--invalid': !valid,
				[`--type-${type}`]: true,
			};
		},

		helperId({ id }) {
			return id ? `${id}-helper` : '';
		},
	},

	watch: {
		value: {
			immediate: true,
			handler(value) {
				this.ongName = value?.name;
				this.ongCode = value?.id;
			},
		},
	},

	methods: {
		focus() {
			this.$refs.input.focus();
			return this.$nextTick();
		},

		blur() {
			this.$refs.input.blur();
			return this.$nextTick();
		},

		async selectONG() {
			const ongSelected = await new Promise((resolve) => {
				const channel = new MessageChannel();
				channel.port1.onmessage = ({ data }) => {
					channel.port1.close();
					resolve(data);
				};

				return this.$router.push({ name: 'bizum-ongs', params: { port: channel.port2 } });
			});

			/* istanbul ignore else */
			if (ongSelected) {
				this.ongName = ongSelected.name;
				this.ongCode = ongSelected.id;

				this.$emit('update:value', ongSelected);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.c-input-ong {
	display: flex;
	width: 100%;
	flex-direction: row;
	color: RGB(var(--color-text-primary));
	position: relative;
}

.c-input-ong__input {
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
	cursor: pointer;
}

.c-input-ong__input::placeholder {
	color: RGB(var(--color-accent-icon));
}

.c-input-ong.--invalid .c-input-ong__input {
	border: 1px solid;
	border-left: 3px solid;
	border-color: RGB(var(--color-text-error));
	caret-color: RGB(var(--color-text-error));
}

.c-input-ong__symbol {
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

.c-input-ong.--invalid .c-input-ong__symbol {
	border: 1px solid;
	border-left: none;
	border-color: RGB(var(--color-text-error));
}
</style>
