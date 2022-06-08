<template>
	<l-details>
		<h1 slot="header" tabindex="-1" ref="title">{{ $t('SIRVASE.DETAIL.TITLE') }}</h1>

		<div class="v-sirvase-detail__header" slot="widget">
			<transition name="placeholder" mode="out-in">
				<div v-if="loading && !source" class="v-sirvase-detail__widget-loading"></div>
				<c-acrylic-sheet v-else-if="source" :dotted="true" data-testid="sheet">
					<c-icon src="@icons/sirvaseEfectuar" slot="icon" />

					<span class="w-sirvase-sheet__row text-m-book">{{ $t('SIRVASE.TITLE') }}</span>

					<span class="w-sirvase-sheet__row text-l-medium">{{ itemType }}</span>

					<span class="w-sirvase-sheet__row text-m-light">{{ itemDate }}</span>
				</c-acrylic-sheet>
			</transition>
		</div>

		<c-translide immediate>
			<div v-if="!loading && error" class="v-sirvase-detail__error" data-testid="error">
				<c-icon class="v-sirvase-detail__error-icon" src="@icons/modalExclamation" />

				<p class="text-m-book v-sirvase-detail__error-text">
					{{ $t('MOVEMENT.DETAIL_ERROR') }}
					<a href="#" class="v-sirvase-detail__error-link" @click="fetch">
						{{ $t('RETRY') }}
					</a>
				</p>
			</div>
		</c-translide>

		<c-translide>
			<div v-if="!error" class="v-sirvase-detail__limit">
				<transition name="placeholder" mode="out-in">
					<c-placeholder-item v-if="loading" />

					<div v-else-if="!loading && source">
						<div class="v-sirvase-detail__details">
							<c-list-icon-item
								class="v-sirvase-detail__item"
								:title="$t('SIRVASE.DETAIL.ORDER_TYPE')"
								:description="itemType"
								icon="@icons/paper"
							/>

							<c-list-icon-item
								class="v-sirvase-detail__item"
								:title="$t('SIRVASE.DETAIL.DATE')"
								:description="itemDate"
								icon="@icons/calendar"
							/>

							<c-list-icon-item
								class="v-sirvase-detail__item"
								:title="$t('SIRVASE.DETAIL.STATUS')"
								icon="@icons/calendarTime"
							>
								<span class="text-m-medium" :class="itemStatusColor">{{ itemStatus }}</span>
							</c-list-icon-item>
						</div>

						<div class="v-sirvase-detail__textarea" data-testid="comment">
							<label class="v-sirvase-detail__label text-m-medium" for="v-sirvase-detail__comment">
								{{ $t('SIRVASE.DETAIL.DESCRIPTION') }}
							</label>
							<c-transfer-textarea
								id="v-sirvase-create__description"
								v-model.trim="source.description"
								rows="5"
								cols="50"
								disabled
								data-testid="comment-input"
								:placeholder="$t('SIRVASE.DETAIL.DESCRIPTION')"
								type="text"
								inputmode="text"
								aria-labelledby="label-comment"
							/>
						</div>
					</div>
				</transition>

				<transition name="placeholder">
					<c-placeholder-item v-if="loading" />
				</transition>

				<transition name="placeholder">
					<c-placeholder-item v-if="loading" />
				</transition>
			</div>
		</c-translide>
	</l-details>
</template>

<script>
import { mapState } from 'vuex';
import LDetails from '@layouts/l-details';
import CTranslide from '@components/c-translide';
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CListIconItem from '@components/c-list-icon-item';
import CTransferTextarea from '@components/c-transfer-textarea';
import CPlaceholderItem from '@components/c-placeholder-item';

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
	name: 'v-sirvase-detail',

	components: {
		LDetails,
		CTranslide,
		CIcon,
		CAcrylicSheet,
		CListIconItem,
		CTransferTextarea,
		CPlaceholderItem,
	},

	data() {
		return {
			loading: false,
			error: false,
			source: null,
		};
	},

	props: {
		requestId: { type: String, required: true },
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

	methods: {
		fetch() {
			this.error = false;
			this.loading = true;

			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

			wait(400).then(() =>
				this.$store
					.dispatch('sirvase/get', { requestId: this.requestId })
					.then(({ data }) => {
						this.source = data;
					})
					.catch(() => {
						this.error = true;
					})
					.finally(() => {
						this.loading = false;
					})
			);
		},
	},

	created() {
		this.fetch();
	},
};
</script>

<style lang="scss">
.v-sirvase-detail__widget-loading {
	min-height: 100%;
}

.w-sirvase-sheet__row:not(:last-child) {
	margin-bottom: 10px;
}

.v-sirvase-detail__header {
	margin-left: 20px;
	margin-right: 20px;
	max-width: 400px;
	flex-grow: 1;
	width: 100%;
}

.v-sirvase-detail__item:not(:last-child) {
	margin-bottom: 18px;
	line-height: 1.5;
}

.v-sirvase-detail__limit {
	max-width: 400px;
	margin: 0 auto;
}

.v-sirvase-detail__details {
	padding-bottom: 20px;
	margin-bottom: 20px;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-sirvase-detail__label {
	display: block;
	margin-bottom: 10px;
}

.v-sirvase-detail__error {
	text-align: center;
	margin: 10px 0;
}

.v-sirvase-detail__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.v-sirvase-detail__error-link {
	text-decoration: underline;
	display: block;
}

.placeholder-enter {
	opacity: 0;
	transform: translateY(-5px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateY(40%);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
	transition-delay: 400ms;
}

.placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 200ms;
}

.placeholder-leave-active ~ .placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 0ms;
}
</style>
