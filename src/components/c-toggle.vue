<template>
	<div class="c-toggle">
		<label class="c-toggle__label" :tabindex="tabindex">
			<input
				class="c-toggle__input"
				type="checkbox"
				v-bind="$attrs"
				v-on="$listeners"
				:checked="value"
				:disabled="readonly"
				@input="$emit('update:value', $event.target.checked)"
			/>
			<div class="c-toggle__bg"></div>
			<div class="c-toggle__ball"></div>
		</label>
	</div>
</template>

<script>
export default {
	name: 'c-toggle',

	model: {
		prop: 'value',
		event: 'update:value',
	},

	inheritAttrs: false,

	props: {
		value: { type: Boolean },
		readonly: { type: Boolean },
		tabindex: { type: String, default: '0' },
	},
};
</script>

<style lang="scss" scoped>
.c-toggle {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 24px;
}

.c-toggle__input[type='checkbox'] {
	height: 0;
	width: 0;
	visibility: hidden;
}

.c-toggle__label {
	text-indent: -9999px;
	width: 34px;
	height: 14px;
	position: relative;
	display: block;
	user-select: none;
	border-radius: 14px;
}

@media (hover) {
	.c-toggle__label {
		cursor: pointer;
	}
}

.c-toggle__bg {
	background: #b8b6b6;
	background-color: RGBA(var(--color-dark-surface), 0.33);
	border-radius: 14px;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.c-toggle__ball {
	position: absolute;
	top: -2.5px;
	left: -2px;
	width: 20px;
	height: 20px;
	background: #f1f1f1;
	border-radius: 20px;
	transition: 0.3s;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.45), inset 0 0 0 0.5px rgba(0, 0, 0, 0.1);
}

.c-toggle__input:checked + .c-toggle__bg {
	background: RGB(var(--color-secondary));
}

.c-toggle__input:checked ~ .c-toggle__ball {
	transform: translateX(18px);
}
</style>
