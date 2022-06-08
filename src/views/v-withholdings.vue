<template>
	<l-details>
		<h1 slot="header" tabindex="-1">{{ $t('WITHHOLDINGS.TITLE') }}</h1>

		<c-translide slot="widget">
			<c-slider v-if="withholdings.length" class="v-withholdings__slider">
				<c-acrylic-sheet class="v-withholdings__sheet" theme="dark" data-testid="sheet">
					<c-icon src="@icons/calendarTime" slot="icon" class="v-withholdings__sheet-icon" />
					<span class="v-withholdings__sheet-title text-fixed-m-medium">
						{{ $t('WITHHOLDINGS.ALIAS') }}
					</span>
					<span class="v-withholdings__sheet-balance text-fixed-l-bold">
						{{ $nc(totalOfWithholdings) }}
					</span>
				</c-acrylic-sheet>
			</c-slider>
		</c-translide>

		<c-translide>
			<div v-if="withholdings.length" class="v-withholdings__content">
				<ul class="v-withholdings__movements">
					<li
						v-for="item in withholdings"
						:key="item.id"
						class="v-withholdings__movement"
						data-testid="movement"
					>
						<span class="v-withholdings__movement__title text-m-medium">{{ item.reason }}</span>
						<span class="v-withholdings__movement__value text-l-medium">
							{{ $nc(item.amount, { sign: true }) }}
						</span>
						<span class="v-withholdings__movement__date text-s-light">
							{{ $d(new Date(item.operationDate), 'numeric') }}
						</span>
					</li>
				</ul>
			</div>
		</c-translide>
	</l-details>
</template>

<script>
import LDetails from '@layouts/l-details';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';
import CTranslide from '@components/c-translide';
import CSlider from '@components/c-slider';
import moduleResources from '@modules/resources/m-resources';
import sumAmounts from '@modules/products/product-sum-amounts';

export default {
	name: 'v-withholdings',

	modules: { resources: moduleResources },

	components: {
		LDetails,
		CAcrylicSheet,
		CIcon,
		CTranslide,
		CSlider,
	},

	props: {
		productId: { type: String },
	},

	data() {
		return {
			withholdings: [],
		};
	},

	computed: {
		totalOfWithholdings({ withholdings }) {
			if (!withholdings.length) {
				return;
			}

			return sumAmounts(withholdings, 'amount');
		},
	},

	watch: {
		productId: {
			immediate: true,
			handler(productId) {
				/* istanbul ignore else */
				if (productId) {
					this.$store
						.dispatch('resources/fetch', {
							resource: 'movements/withholdings',
							productId,
						})
						.then(({ data }) => {
							if (!data?.length) {
								this.$router.back();
							}

							this.withholdings = data;
						});
				}
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.v-withholdings__sheet {
	width: 300px;
}

.v-withholdings__sheet-icon {
	color: RGB(var(--color-secondary));
}

.v-withholdings__sheet-title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.v-withholdings__sheet-balance {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.v-withholdings__view-more-receipts {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 40px 0;
}

.v-withholdings__view-more-receipts-icon {
	margin-right: 20px;
}

.v-withholdings__error {
	text-align: center;
	margin: 10px 0;
}

.v-withholdings__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.v-withholdings__error-link {
	text-decoration: underline;
	display: block;
}

.v-withholdings__movement {
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content min-content;
	grid-gap: 10px;
	padding: 10px 0;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-withholdings__movement:first-of-type {
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
}
</style>
