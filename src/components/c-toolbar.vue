<template>
	<div class="c-toolbar" role="list" :class="{ '--horizontal': horizontal }">
		<div
			data-testid="item"
			class="c-toolbar--item"
			v-for="item in defaultItems"
			:key="item.id"
			:class="{ '--highlight': item.highlight, '--disabled': item.disabled }"
		>
			<label
				class="c-toolbar--label"
				:class="{ '--selected': selected === item.id }"
				:aria-labelledby="`c-toolbar-${item.id}`"
				tabindex="0"
				@keypress.enter.space="$emit('item-selected', item.id)"
			>
				<c-icon :src="item.iconActive" v-if="item.iconActive && selected === item.id" />
				<c-icon :src="item.icon" v-else />
				<input
					class="c-toolbar--native-control"
					type="radio"
					name="c-toolbar"
					:value="item.id"
					:checked="selected === item.id"
					:disabled="item.disabled"
					@change="$emit('item-selected', $event.target.value)"
					tabindex="-1"
				/>
				<span class="text-s-medium" :id="`c-toolbar-${item.id}`">{{ item.title }}</span>
			</label>
		</div>
		<div data-testid="more-button" class="c-toolbar--item">
			<label
				class="c-toolbar--label"
				tabindex="0"
				:aria-label="$t('MENU.MORE_INFO')"
				aria-haspopup="true"
				aria-expanded="true"
				@click="$emit('toggle-menu')"
				@keypress.enter.space="$emit('toggle-menu')"
			>
				<c-icon src="@icons/more" />
				<span class="text-s-medium" :id="`c-toolbar-menu`">{{ $t('MENU.MORE_INFO') }}</span>
			</label>
		</div>
		<div v-if="!horizontal" class="c-toolbar--item">
			<label
				class="c-toolbar--label"
				aria-labelledby="c-toolbar-exit"
				tabindex="0"
				data-testid="logout-button"
				@click="logout"
				@keypress.enter.space="logout"
			>
				<c-icon src="@icons/exit" />
				<span class="text-s-medium" id="c-toolbar-exit">{{ $t('ACTIONS.CLOSE_SESSION') }}</span>
			</label>
		</div>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-toolbar',

	components: { CIcon },

	model: {
		prop: 'selected',
		event: 'item-selected',
	},

	props: {
		items: { type: Array },
		selected: { type: String },
		horizontal: { type: Boolean },
	},

	computed: {
		defaultItems({ items, horizontal }) {
			const length = horizontal ? 3 : 4;
			return items.filter((x, y) => y < length);
		},
	},

	methods: {
		logout() {
			this.$store.dispatch('authn/activeLogout');
		},
	},
};
</script>

<style lang="scss" scoped>
.c-toolbar {
	display: flex;
	height: 100%;
	width: 100%;
	overflow: hidden;
}

.c-toolbar--item.--highlight {
	border-top: 1px solid RGBA(var(--color-primary-light), 0.15);
	border-bottom: 1px solid RGBA(var(--color-primary-light), 0.15);
}

.c-toolbar--item.--disabled {
	pointer-events: none;
	opacity: 0.35;
}

.c-toolbar--label {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	color: RGB(var(--color-primary-light));
	padding: 5px;
	border-radius: 4px;
}

@media (hover) {
	.c-toolbar--item:not(.--disabled) .c-toolbar--label {
		cursor: pointer;
	}
}

.c-toolbar.--horizontal {
	box-shadow: 0px -6px 20px -20px black;
	align-items: center;
	justify-content: center;
	padding: 0 30px;

	.c-toolbar--label {
		width: 70px;
		height: 100%;
	}
}

.c-toolbar:not(.--horizontal) {
	box-shadow: 0 0px 6px 0px rgba(0, 0, 0, 0.2);
	align-items: flex-start;
	padding: 30px 15px;
	text-align: center;
	flex-direction: column;

	.c-toolbar--item {
		flex-shrink: 0;
		flex-grow: 0;
		width: 100%;
	}

	.c-toolbar--item:not(:first-of-type) {
		margin-top: 10px;
	}

	.c-toolbar--item:last-of-type {
		flex-grow: 1;
		display: flex;
		align-items: flex-end;
	}

	.c-toolbar--label {
		width: 100%;
		height: 80px;
		flex-direction: column;
	}
}

.c-toolbar--native-control {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	opacity: 0;
	cursor: inherit;
}

.c-toolbar--label .c-icon {
	font-size: 20px;
	pointer-events: none;
}

.c-toolbar--label.--selected {
	color: RGB(var(--color-accent-secondary));
}

.c-toolbar:not(.--horizontal) .c-toolbar--label span {
	margin-top: 5px;
	white-space: normal;
}

.c-toolbar.--horizontal .c-toolbar--label span {
	display: none;
}
</style>
