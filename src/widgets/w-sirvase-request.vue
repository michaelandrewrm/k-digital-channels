<template>
	<div class="w-sirvase-request">
		<button class="w-sirvase-request__button">
			<span class="w-sirvase-request__item-info text-m-medium" data-testid="type">
				{{ itemType }}
			</span>
			<span class="w-sirvase-request__item-date text-m-light" data-testid="date">
				{{ itemDate }}
			</span>
			<span
				class="w-sirvase-request__item-status text-s-medium"
				:class="itemStatusColor"
				data-testid="status"
			>
				{{ itemStatus }}
			</span>
		</button>
	</div>
</template>

<script>
import { mapState } from 'vuex';

const nthIndex = (str, sub, n) => {
	let i = 0;
	let lastIndex;
	const indexes = [];
	while (i < n) {
		const index = str.indexOf(sub, lastIndex + 1);
		indexes.push(index);
		lastIndex = index;
		i += 1;
	}
	return indexes[n - 1];
};

export default {
	name: 'w-sirvase-request',

	props: {
		source: { type: Object, required: true },
	},

	computed: {
		...mapState('session', ['lang']),

		itemType({ source, lang }) {
			const name = lang === 'en' ? 'name_en' : 'name_es';

			return source?.type[name];
		},

		itemStatus({ source, lang }) {
			const name = lang === 'en' ? 'name_en' : 'name_es';

			return source?.status[name];
		},

		itemDate({ source }) {
			if (!source?.requestDate) {
				return '';
			}

			const str = source?.requestDate;

			const day = str.slice(nthIndex(str, '-', 1) - 2, nthIndex(str, '-', 1));
			const month = str.slice(nthIndex(str, '-', 2) - 2, nthIndex(str, '-', 2));
			const year = str.slice(nthIndex(str, '-', 2) + 1, nthIndex(str, '-', 2) + 5);

			const hour = str.slice(nthIndex(str, ':', 1) - 2, nthIndex(str, ':', 1));
			const minute = str.slice(nthIndex(str, ':', 2) - 2, nthIndex(str, ':', 2));
			return `${day} / ${month} / ${year}  -  ${hour}:${minute}`;
		},

		itemStatusColor({ source }) {
			const statusName = source?.status?.name_en.toUpperCase() || 'color-text-primary';
			const status = {
				REQUESTED: 'color-accent-icon',
				DONE: 'color-accent-success',
				EXPIRED: 'color-accent-error',
				CANCELLED: 'color-accent-error',
			}[statusName];

			return status;
		},
	},
};
</script>

<style lang="scss">
.w-sirvase-request {
	padding: 5px 0;
}

.w-sirvase-request__button {
	color: RGB(var(--color-text-primary));
	appearance: none;
	display: grid;
	position: relative;
	width: 100%;
	border: none;
	border-radius: $border-radius-l;
	padding: 15px;
	grid-template-columns: 1fr 1fr;
	row-gap: 10px;
	background-color: RGB(var(--color-surface-light));
	line-height: 1.6;
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.3);
}

.w-sirvase-request__button:not(:only-of-type) {
	margin-bottom: 10px;
}

.w-sirvase-request__item-info {
	text-align: left;
}

.w-sirvase-request__item-date,
.w-sirvase-request__item-status {
	text-align: right;
}

.w-sirvase-request__item-status {
	grid-column: 1/-1;
}
</style>
