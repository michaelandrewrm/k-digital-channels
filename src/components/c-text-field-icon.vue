<template>
	<i
		class="mdc-text-field__icon"
		v-bind="attrs"
		v-on="$listeners"
		:role="clickable ? 'button' : null"
	>
		<slot />
	</i>
</template>

<script>
import { MDCTextFieldIcon } from '@material/textfield/icon';

export default {
	name: 'TextFieldIcon',

	props: {
		clickable: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			attrs: { ...this.$attrs },
			mdcTextFieldIcon: undefined,
		};
	},

	mounted() {
		this.mdcTextFieldIcon = MDCTextFieldIcon.attachTo(this.$el);
	},

	/* istanbul ignore next */
	beforeDestroy() {
		this.mdcTextFieldIcon.destroy();
	},
};
</script>
<style lang="scss" scoped>
.mdc-text-field__icon {
	top: 50%;
	transform: translateY(-50%);
	height: 24px;
	font-size: 24px;
	user-select: none;
}
</style>
