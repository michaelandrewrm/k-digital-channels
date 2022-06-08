<template>
	<ul role="tablist" class="c-tabs-nav__tabs">
		<li
			v-for="(tab, key, i) in tabs"
			:key="key"
			:class="{ 'is-active': tab.active, 'is-disabled': tab.disabled }"
			class="c-tabs-nav__tab"
			role="presentation"
		>
			<a
				v-html="tab.header"
				:aria-controls="tab.hash"
				:aria-selected="tab.active"
				@click.prevent="!tab.active && $emit('select', i)"
				:href="tab.hash"
				class="c-tabs-nav__tab-a"
				role="tab"
				:id="tab.active ? 'virtual-labeled-list' : null"
			></a>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'c-tabs-nav',

	props: {
		tabs: { type: Object },
	},
};
</script>

<style lang="scss" scoped>
.c-tabs-nav__tabs {
	border: 0;
	align-items: stretch;
	display: flex;
	justify-content: flex-start;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.c-tabs-nav__tab {
	position: relative;
	list-style: none;
	@extend %typo-l-medium;
}

.c-tabs-nav__tab:not(:last-child) {
	margin-right: 20px;
}

@media (hover) {
	.c-tabs-nav__tab:not(:only-child) {
		cursor: pointer;
	}
}

.c-tabs-nav__tab:not(:only-child).is-active {
	@extend %typo-l-bold;
}

.c-tabs-nav__tab::after {
	content: '';
	display: none;
	width: 100%;
	bottom: -1px;
	position: absolute;
	border-bottom: 1px solid RGB(var(--color-text-primary));
}

.c-tabs-nav__tab:not(:only-child).is-active::after {
	display: block;
}

.c-tabs-nav__tab.is-disabled * {
	opacity: 0.4;
	cursor: not-allowed;
}

.c-tabs-nav__tab-a {
	white-space: nowrap;
	align-items: center;
	color: inherit;
	display: flex;
	padding-top: 2px;
	padding-bottom: 8px;
	text-decoration: none;
	cursor: inherit;
	--focus-ring-padding: 5px;
	padding-left: var(--c-tabs-nav__padding, 0px);
	padding-right: var(--c-tabs-nav__padding, 0px);
	border-radius: $border-radius-s;
}

.c-tabs-nav__tabs[data-expanded] .c-tabs-nav__tab {
	flex-grow: 1;
}

.c-tabs-nav__tabs[data-expanded] .c-tabs-nav__tab-a {
	justify-content: center;
}
</style>
