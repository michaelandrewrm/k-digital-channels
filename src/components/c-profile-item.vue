<template>
	<div class="c-profile-item" tabindex="0">
		<div
			class="c-profile-item__content"
			:class="{ '--slide-content': showOption, '--is-selected': isSelected }"
			data-testid="content"
		>
			<div class="c-profile-item__icon" @click="$emit('select-item')" data-testid="icon">
				<c-icon v-if="profile.isDefault" src="@icons/flagFill" size="l" />
				<c-icon v-else src="@icons/flag" size="l" />
			</div>
			<div
				class="c-profile-item__title text-m-medium"
				@click.prevent="$emit('set-item')"
				data-testid="set"
			>
				<span class="text-m-medium">{{ profile.name }}</span>
			</div>
			<button
				v-if="editable"
				class="c-profile-item__more-button"
				@click="showOption = !showOption"
				data-testid="option-button"
			>
				<!-- eslint-disable-next-line vue-i18n/no-raw-text -->
				<span aria-hidden="true">&#8942;</span>
			</button>
		</div>
		<div v-if="editable" class="c-profile-item__options" data-testid="options">
			<button class="c-profile-item__delete" @click="$emit('delete-item')" data-testid="delete">
				<c-icon src="@icons/trash" size="m" />
				<span class="text-m-medium">{{ $t('PROFILES.DELETE') }}</span>
			</button>
			<button class="c-profile-item__edit" @click="$emit('edit-item')" data-testid="edit">
				<c-icon src="@icons/editPen" size="m" />
				<span class="text-m-medium">{{ $t('PROFILES.EDIT') }}</span>
			</button>
		</div>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-profile-item',

	components: { CIcon },

	props: {
		profile: Object,
		editable: Boolean,
		isSelected: Boolean,
	},

	data() {
		return {
			showOption: false,
		};
	},
};
</script>

<style lang="scss" scoped>
.c-profile-item {
	position: relative;
	width: 100%;
	height: 55px;
	border-radius: $border-radius-l;
	@media (hover) {
		cursor: pointer;
	}
}

.c-profile-item__placeholder {
	display: inline-flex;
	position: relative;
	width: 100%;
	height: 55px;
	background: RGB(var(--color-surface));
	z-index: 1;
}

.c-profile-item__content {
	display: grid;
	position: relative;
	height: 100%;
	grid-template-columns: 40px auto 40px;
	align-items: center;
	background: RGB(var(--color-surface-dark));
	transition: transform 250ms ease-in-out;
	z-index: 1;
}

.c-profile-item__content.--slide-content {
	transform: translateX(-175px);
}

.c-profile-item__content.--is-selected {
	background: RGB(var(--color-surface-light));
}

.c-profile-item__options {
	display: flex;
	position: absolute;
	top: 0;
	right: 0;
}

.c-profile-item__delete,
.c-profile-item__edit {
	display: inline-flex;
	position: relative;
	width: 90px;
	height: 55px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	& span {
		padding-top: 5px;
	}
}

.c-profile-item__delete {
	color: RGB(var(--color-text-primary-light));
	background: RGB(var(--color-accent-error));
	box-shadow: inset 20px 0px 10px -10px rgba(0, 0, 0, 0.25);
}

.c-profile-item__edit {
	color: RGB(var(--color-text-primary-light));
	background: RGB(var(--color-accent-icon));
}

.c-profile-item__icon {
	display: inline-flex;
	justify-content: center;
}

.c-profile-item__title {
	display: inline-flex;
	height: 55px;
	align-items: center;
	padding: 0px 10px;
	overflow: hidden;
	& span {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
}

.c-profile-item__delete,
.c-profile-item__edit,
.c-profile-item__more-button {
	appearance: none;
	border: 0;
	user-select: none;
}

.c-profile-item__more-button {
	color: RGB(var(--color-text-primary-light));
	display: inline-flex;
	width: 40px;
	height: 55px;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	font-weight: 900;
	font-family: monospace;
	line-height: 0;
	background: RGB(var(--color-accent-primary));
}
</style>
