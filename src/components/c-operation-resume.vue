<template>
	<div class="c-operation-resume">
		<c-translide
			immediate
			v-for="{ name, disabled, label, value, additionalInfo, invalid, type } in resume"
			:key="name"
		>
			<section v-if="!type" class="c-operation-resume__info" :data-testid="`section-${name}`">
				<header class="c-operation-resume__label" :aria-hidden="disabled">
					<h2 class="text-m-medium">{{ label }}</h2>
				</header>

				<button
					v-if="!disabled"
					class="c-operation-resume__info-button"
					@click="editSection(name)"
					:data-testid="`edit-${name}`"
					:aria-label="$t('TRANSFERS.EDIT_RESUME_ITEM', { title: label, item: value })"
					:invalid="invalid"
				>
					<div class="c-operation-resume__info-card" :class="{ '--one-column': !additionalInfo }">
						<div class="text-m-medium c-operation-resume__alias">{{ value }}</div>
						<div class="text-s-light" v-if="additionalInfo">{{ additionalInfo }}</div>
						<c-icon src="@icons/editPen" size="m" class="c-operation-resume__info-icon" />
					</div>
				</button>
				<div v-else class="c-operation-resume__info-button">
					<div class="c-operation-resume__info-card" :class="{ '--one-column': !additionalInfo }">
						<div class="text-m-medium c-operation-resume__alias">
							{{ value }}
						</div>
						<div class="text-s-light" v-if="additionalInfo">{{ additionalInfo }}</div>
					</div>
				</div>
			</section>
			<section
				v-else-if="type === 'image'"
				class="c-operation-resume__info"
				:data-testid="`section-${name}`"
			>
				<button
					v-if="!disabled"
					class="c-operation-resume__info-button c-operation-resume__info-button-image"
					@click="editSection(name)"
					:data-testid="`edit-${name}`"
				>
					<span class="c-operation-resume__info-image">
						<img :src="value" alt="" class="c-operation-resume__info-uploaded-img" />
					</span>
					<span class="c-operation-resume__info-label">{{ $t('IMAGE_ADDED') }}</span>
				</button>
			</section>
			<section
				v-else-if="type === 'table'"
				class="c-operation-resume__info"
				:data-testid="`section-${name}`"
			>
				<header class="c-operation-resume__label" :aria-hidden="disabled">
					<h2 class="text-m-medium">{{ label }}</h2>
				</header>

				<button
					v-if="!disabled"
					class="c-operation-resume__info-button"
					@click="editSection(name)"
					:data-testid="`edit-${name}`"
					:aria-label="$t('TRANSFERS.EDIT_RESUME_ITEM', { title: label, item: value })"
					:invalid="invalid"
				>
					<div class="c-operation-resume__info-card --one-column">
						<div class="text-m-medium c-operation-resume__alias">{{ value.title }}</div>
						<c-icon src="@icons/editPen" size="m" class="c-operation-resume__info-icon" />
						<div
							v-for="row in value.table"
							:key="row.label"
							class="c-operation-resume__row text-s-light"
						>
							<div class="c-operation-resume__row-title">{{ row.label.concat(':') }}</div>
							<div class="c-operation-resume__row-separator" />
							<div class="c-operation-resume__row-amount">{{ $nc(row.value) }}</div>
						</div>
					</div>
				</button>
				<div v-else class="c-operation-resume__info-button">
					<div class="c-operation-resume__info-card --one-column">
						<div class="text-m-medium c-operation-resume__alias">{{ value.title }}</div>
						<div
							v-for="row in value.table"
							:key="row.label"
							class="c-operation-resume__row text-s-light"
						>
							<div class="c-operation-resume__row-title">{{ row.label.concat(':') }}</div>
							<div class="c-operation-resume__row-separator" />
							<div class="c-operation-resume__row-amount">{{ $nc(row.value) }}</div>
						</div>
					</div>
				</div>
			</section>
		</c-translide>
	</div>
</template>

<script>
import CTranslide from '@components/c-translide';
import CIcon from '@components/c-icon';

export default {
	name: 'c-operation-resume',

	components: {
		CIcon,
		CTranslide,
	},

	model: {
		prop: 'resume',
		event: 'update:resume',
	},

	props: {
		resume: { type: Array },
	},

	methods: {
		editSection(section) {
			this.$emit('edit', section);
		},
	},
};
</script>

<style lang="scss" scoped>
.c-operation-resume {
	display: flex;
	position: relative;
	flex-direction: column;
	height: 100%;
	flex-grow: 1;
	flex-shrink: 1;
	padding: 0 10px 10px;
}

.c-operation-resume:not(:empty) {
	padding-bottom: 20px;
}

.c-operation-resume__label {
	margin-left: 10px;
	margin-right: 10px;
}

.c-operation-resume__info:not(:first-of-type) {
	margin-top: 18px;
}

.c-operation-resume__info-button {
	appearance: none;
	background: transparent;
	border: 0;
	padding: 0;
	margin: 0;
	display: block;
	width: 100%;
	text-align: left;
	outline: none;
	position: relative;
}

.c-operation-resume__alias {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	margin-right: 10px;
}

.c-operation-resume__info-button[disabled] {
	cursor: default;
}

.c-operation-resume__info-button[disabled] .c-operation-resume__info-icon {
	visibility: hidden;
}

.c-operation-resume__info-button:not(:first-child) {
	margin-top: 10px;
}

.c-operation-resume__info-card {
	display: grid;
	position: relative;
	padding: 10px;
	background-color: RGB(var(--color-surface-light));
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.3);
	border-radius: $border-radius-l;
	color: RGB(var(--color-text-primary));
	grid-template-columns: minmax(0, 1fr) 1fr fit-content(100px);
	grid-template-rows: auto;
	align-items: center;
}

.c-operation-resume__info-button[disabled] .c-operation-resume__info-card {
	box-shadow: none;
}

.c-operation-resume__info-button[invalid] .c-operation-resume__info-card {
	border: 1px solid RGB(var(--color-accent-error));
}

.c-operation-resume__info-card.--one-column {
	grid-template-columns: 1fr fit-content(100px);
}

.c-operation-resume__info-card.--one-column .c-operation-resume__alias {
	margin-right: 10px;
	word-break: break-word;
	white-space: pre-wrap;
}

.c-operation-resume__info-icon {
	grid-column-end: -1;
}

.c-operation-resume__note {
	margin: 10px 10px 0 10px;
}

.c-operation-resume__row {
	display: grid;
	position: relative;
	max-width: 320px;
	color: RGB(var(--color-text-primary));
	grid-template-columns: min-content 1fr min-content;
	align-items: center;
	margin-top: 10px;
}

.c-operation-resume__info-button-image {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	color: RGB(var(--color-text-primary));
}

.c-operation-resume__info-image {
	flex-shrink: 0;
	display: flex;
	width: 40px;
	height: 40px;
	background-color: RGB(var(--color-surface-light));
	border-radius: $border-radius-s;
	box-shadow: 0px 5px 10px -8px rgba(0, 0, 0, 0.5);
	align-items: center;
	justify-content: center;
	color: RGB(var(--color-accent-secondary));
}

.c-operation-resume__info-label {
	flex-grow: 1;
	margin-left: 10px;
}

.c-operation-resume__info-uploaded-img {
	width: 40px;
	height: 40px;
	object-fit: cover;
	object-position: center;
	background-color: RGB(var(--color-surface-light));
	border-radius: $border-radius-s;
	box-shadow: 0px 5px 10px -8px rgba(0, 0, 0, 0.5);
}

.c-operation-resume__row {
	display: grid;
	position: relative;
	max-width: 320px;
	color: RGB(var(--color-text-primary));
	grid-template-columns: min-content 1fr min-content;
	align-items: center;
	margin-top: 10px;
}

.c-operation-resume__row.--two-columns {
	grid-template-columns: min-content 1fr;
	margin-bottom: 20px;
}

.c-operation-resume__row-separator {
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
	margin: 10px;
}

.c-operation-resume__divider:not(:last-child) {
	display: flex;
	position: relative;
	height: 20px;
	margin: 0 10px;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
}
</style>
