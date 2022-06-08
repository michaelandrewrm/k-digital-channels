<template>
	<div class="c-input-rate">
		<input
			:id="id"
			type="radio"
			v-bind="$attrs"
			v-on="$listeners"
			:value="value"
			:name="name"
			v-model="radioButtonValue"
			:disabled="disabled"
		/>
		<label :for="id">
			<c-icon class="c-input-rate__star" size="null" src="@icons/star" v-if="model < value" />
			<c-icon class="c-input-rate__star" size="null" src="@icons/starFill" v-else />
		</label>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

const hasherize = (string) => string.toLowerCase().replace(/\W/g, '_');

export default {
	name: 'c-input-rate',

	inheritAttrs: false,

	components: { CIcon },

	model: {
		prop: 'model',
		event: 'update:model',
	},

	props: {
		name: { type: String, default: 'radio' },
		value: { type: Number },
		model: { type: Number },
		disabled: { type: Boolean },
	},

	computed: {
		id({ name, _uid: uid }) {
			return `${hasherize(name)}-${uid}`;
		},

		radioButtonValue: {
			get() {
				return this.model;
			},
			set() {
				this.$emit('update:model', this.value);
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.c-input-rate__star {
	font-size: 30px;
	color: RGB(var(--color-secondary));
}

.c-input-rate {
	input {
		opacity: 0;
		width: 0;
		height: 30px;
	}

	@media (hover) {
		input + label {
			cursor: pointer;
		}
	}
}
</style>
