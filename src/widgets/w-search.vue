<template>
	<div class="w-search">
		<h1 class="text-m-book">{{ $t('SEARCH.SEARCH_BY') }}</h1>
		<div data-testid="filters" class="w-search__filters text-m-book">
			<span
				data-testid="document-filter"
				class="w-search__filter"
				:class="{ '--selected': filter === 'documentNumber' }"
				@click="selectFilter('documentNumber')"
				@keypress.enter="selectFilter('documentNumber')"
				tabindex="0"
			>
				{{ $t('SEARCH.FILTER.DOCUMENTNUMBER') }}
			</span>
			<span
				data-testid="name-filter"
				class="w-search__filter"
				:class="{ '--selected': filter === 'name' }"
				@click="selectFilter('name')"
				@keypress.enter="selectFilter('name')"
				tabindex="0"
			>
				{{ $t('SEARCH.FILTER.NAME') }}
			</span>
			<span
				data-testid="surname1-filter"
				class="w-search__filter"
				:class="{ '--selected': filter === 'surname1' }"
				@click="selectFilter('surname1')"
				@keypress.enter="selectFilter('surname1')"
				tabindex="0"
			>
				{{ $t('SEARCH.FILTER.SURNAME1') }}
			</span>
			<span
				data-testid="surname2-filter"
				class="w-search__filter"
				:class="{ '--selected': filter === 'surname2' }"
				@click="selectFilter('surname2')"
				@keypress.enter="selectFilter('surname2')"
				tabindex="0"
			>
				{{ $t('SEARCH.FILTER.SURNAME2') }}
			</span>
		</div>
		<div class="w-search__bar">
			<c-text-field
				data-testid="search-field"
				v-model.trim="search"
				outlined
				:placeholder="searchPlaceholder"
				@keypress.enter.prevent="fetchUsers"
			>
				<c-text-field-icon
					slot="trailingIcon"
					@click.prevent="fetchUsers"
					@keypress.enter.prevent="fetchUsers"
					tabindex="0"
				>
					<c-icon src="@icons/search" size="" class="w-search__bar-icon" />
				</c-text-field-icon>
			</c-text-field>
		</div>

		<div class="w-search__list">
			<table v-if="users && users.length" class="w-search__table" data-testid="search-result">
				<tbody class="w-search__tbody text-m-book">
					<tr
						v-for="(user, i) in users"
						:key="user.id"
						class="w-search__tr"
						tabindex="0"
						@keypress.enter="selectUser(user)"
					>
						<td class="w-search__td">{{ i + 1 }}</td>
						<td class="w-search__td">{{ user.documentNumber }}</td>
						<td class="w-search__td">{{ user.name }} {{ user.surname1 }} {{ user.surname2 }}</td>
						<td class="w-search__td">
							<div
								data-testid="select-user"
								outlined
								class="w-search__login-button"
								@click.stop="selectUser(user)"
							>
								{{ $t('SEARCH.SELECT') }}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<p v-else-if="fetched" class="w-search__no-user text-m-book">
				{{ $t('SEARCH.NO_USER_FOUND') }}
			</p>
		</div>

		<div v-if="users && users.length" class="w-search__pagination">
			<div class="w-search__pagination-scrolling">
				<c-pagination
					v-model="pageNumber"
					:totalPages="totalPages"
					:loading="loading"
				></c-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import moduleAgent from '@assisted/store/modules/agent/m-agent';
import CTextField from '@components/c-text-field';
import CTextFieldIcon from '@components/c-text-field-icon';
import CIcon from '@components/c-icon';
import CPagination from '@components/c-pagination';

export default {
	name: 'w-search',

	modules: {
		agent: moduleAgent,
	},

	components: {
		CTextField,
		CTextFieldIcon,
		CIcon,
		CPagination,
	},

	props: { currentCompany: String },

	data() {
		return {
			search: null,
			filter: 'documentNumber',
			users: null,
			pageNumber: 0,
			totalPages: null,
			loading: null,
			fetched: null,
		};
	},

	computed: {
		searchPlaceholder({ filter }) {
			return this.$t('SEARCH.PLACEHOLDER', {
				filter: this.$t(`SEARCH.FILTER.${filter.toUpperCase()}`),
			});
		},
	},

	methods: {
		selectFilter(filter) {
			this.filter = filter;
			this.search = '';
		},

		async fetchUsers({ pageNumber = 0 }) {
			const { search, filter, currentCompany: companyId } = this;

			if (!search || !companyId) {
				return;
			}

			this.loading = true;
			this.fetched = false;

			const response = await this.$store.dispatch('agent/fetchUsers', {
				search,
				filter,
				pageNumber,
				companyId,
			});

			/* istanbul ignore else */
			if (response?.data) {
				this.pageNumber = 0;
				this.totalPages = 0;
				this.users = response?.data;
				this.pageNumber = response?.pageNumber;
				this.totalPages = response?.totalPages;
			}

			this.loading = false;
			this.fetched = true;
		},

		async selectUser(userData) {
			/* istanbul ignore else */
			if (userData?.id) {
				const user = { ...userData, companyId: this.currentCompany };
				this.$emit('close', user);
			}
		},
	},

	watch: {
		search() {
			this.fetched = false;
		},
		pageNumber(pageNumber) {
			this.fetchUsers({ pageNumber });
		},
	},
};
</script>

<style lang="scss" scoped>
.w-search {
	display: flex;
	width: 100%;
	position: relative;
	flex-direction: column;
	flex-grow: 0;
	flex-shrink: 0;
}

.w-search__filters {
	display: flex;
	position: relative;
	padding: 8px 0;
	@media ($on-mobile) {
		flex-direction: column;
		& span {
			margin: 0;
			margin-bottom: 10px;
		}
	}
}

.w-search__filter {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	border: 1px solid;
	border-radius: 4px;
	padding: 4px 8px;
	margin-right: 8px;
	color: RGBA(var(--color-primary), 0.5);
	@media (hover) {
		cursor: pointer;
	}
	&.--selected {
		color: RGB(var(--color-text-primary-light));
		background-color: RGB(var(--color-primary));
	}
}

.w-search__bar {
	width: 100%;
	background-color: RGB(var(--color-surface-light));
}

.w-search__bar-icon {
	outline: none;
}

.mdc-text-field .mdc-text-field__icon {
	display: flex;
	align-items: center;
	svg {
		font-size: 16px;
	}
}

.w-search__list {
	margin-top: 4px;
	background-color: RGB(var(--color-surface-light));
	overflow: auto;
}

.w-search__table {
	display: table;
	width: 100%;
}

.w-search__tr {
	outline: none;
	&:nth-child(2n) {
		background-color: RGBA(var(--color-secondary), 0.1);
	}
	&:focus .w-search__login-button {
		transform: scale(1);
	}
}

.w-search__td {
	padding: 8px;
	&:last-child {
		text-align: end;
	}
}

.w-search__no-user {
	padding: 8px;
}

.w-search__login-button {
	color: RGB(var(--color-secondary));
	text-align: center;
	padding: 8px;
	border: 1px solid;
	border-radius: 4px;
	box-shadow: RGBA(var(--color-primary), 0.25) 0px 0px 6px;
	transform-origin: center;
	will-change: transform;
	transform: scale(0);
	transition: transform 200ms ease-in;
	@media (hover) {
		cursor: pointer;
	}
}

.w-search__pagination {
	display: flex;
	flex-shrink: 0;
}

.w-search__pagination-scrolling {
	width: 100%;
	text-align: center;
	overflow-x: scroll;
}
</style>
