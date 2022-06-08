<template>
	<!-- eslint-disable vue-i18n/no-raw-text -->
	<nav class="c-pagination text-l-book">
		<button
			data-testid="previous-btn"
			v-if="pages.length > 1"
			class="c-pagination__previous-btn text-xl-book"
			:class="{ '--disabled': pageNumber === 0 }"
			@click="pageNumber > 0 && !loading ? updatePage(pageNumber - 1) : null"
		>
			&#60;
		</button>
		<ul class="c-pagination__list" v-if="pages.length">
			<li
				class="c-pagination__list-item"
				:active="pageNumber === 0"
				@click="updatePage(0)"
				@keypress.enter="updatePage(0)"
				tabindex="0"
			>
				{{ pages[0] }}
			</li>
			<li v-if="pageNumber > 3 && pages.length > 5" class="c-pagination__list-ellipsis this">
				&hellip;
			</li>
			<li
				class="c-pagination__list-item"
				v-for="page in rangeToShow"
				:key="page - 1"
				:active="page - 1 === pageNumber"
				@click="updatePage(page - 1)"
				@keypress.enter="updatePage(page - 1)"
				tabindex="0"
			>
				{{ page }}
			</li>
			<li
				v-if="pages.length > 5 && pageNumber < pages.length - 3"
				class="c-pagination__list-ellipsis"
			>
				&hellip;
			</li>
			<li
				v-if="pages.length > 5 && pageNumber < pages.length - 3"
				class="c-pagination__list-item"
				:active="pageNumber === pages.length - 1"
				@click="updatePage(pages.length - 1)"
				@keypress.enter="updatePage(pages.length - 1)"
				tabindex="0"
			>
				{{ pages.length }}
			</li>
		</ul>
		<button
			data-testid="next-btn"
			v-if="pages.length > 1"
			class="c-pagination__next-btn text-xl-book"
			:class="{ '--disabled': pageNumber === pages.length - 1 }"
			@click="pageNumber < pages.length - 1 && !loading ? updatePage(pageNumber + 1) : null"
		>
			&#62;
		</button>
	</nav>
</template>

<script>
export default {
	name: 'c-pagination',
	model: {
		prop: 'pageNumber',
		event: 'update:pageNumber',
	},
	props: {
		pageNumber: { type: Number },
		totalPages: { type: Number },
		loading: { type: Boolean },
	},
	computed: {
		pages({ totalPages }) {
			return Array.from({ length: totalPages }, (v, k) => k + 1);
		},

		rangeToShow({ pageNumber, pages }) {
			let start = 0;
			let end = 5;
			const limit = pages.length > 3 ? pages.length - 3 : end;

			if (pageNumber > 3) {
				start = pageNumber - 3;
				end = pageNumber + 1;
			}

			/* istanbul ignore next */
			if (pageNumber >= limit) {
				start = pageNumber === pages.length - 2 ? pageNumber - 4 : start;
				start = pageNumber === pages.length - 1 ? pageNumber - 5 : start;
				end = pages.length;
			}

			return pages.filter((v, k) => k > start && k < end);
		},
	},
	methods: {
		updatePage(page) {
			this.$emit('update:pageNumber', page);
		},
	},
};
</script>

<style lang="scss" scoped>
.c-pagination {
	display: inline-flex;
	margin: 10px;
}

.c-pagination__list {
	display: inline-flex;
	position: relative;
	margin: 0 10px;
}

.c-pagination__list-item,
.c-pagination__list-ellipsis {
	display: inline-flex;
	min-width: 40px;
	justify-content: center;
	align-items: center;
	padding: 10px;
	border-radius: 4px;
}

.c-pagination__next-btn,
.c-pagination__previous-btn {
	user-select: none;
	appearance: none;
	outline: none;
	display: inline-flex;
	position: relative;
	min-width: 40px;
	justify-content: center;
	align-items: center;
	background: none;
	border: none;
	border-radius: 4px;
	padding: 0 10px 5px;
}

.c-pagination__next-btn.--disabled,
.c-pagination__previous-btn.--disabled {
	color: RGBA(var(--color-primary), 0.25);
	background-color: RGB(var(--color-surface-dark));
}

.c-pagination__previous-btn,
.c-pagination__next-btn,
.c-pagination__list-item:not(:only-child) {
	@media (hover) {
		cursor: pointer;
	}
}

.c-pagination__next-btn:hover:not(.--disabled),
.c-pagination__previous-btn:hover:not(.--disabled),
.c-pagination__list-item:hover:not([active]):not(:only-child) {
	border: 1px solid RGB(var(--color-primary));
	background-color: RGB(var(--color-surface-dark));
}

.c-pagination__list-item[active]:not(:only-child) {
	color: RGB(var(--color-secondary));
	background-color: RGBA(var(--color-secondary), 0.1);
	border: 1px solid RGB(var(--color-secondary));
}
</style>
