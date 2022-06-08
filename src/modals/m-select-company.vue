<template>
	<l-modal class="m-select-company" :modal="modal" :fullscreen="!isDesktop">
		<template v-slot:icon>
			<c-icon src="@icons/modalExclamation" class="m-select-company__header-icon" />
		</template>

		<template v-slot:header>
			<span class="m-select-company__header-title">
				{{ $t('LOGIN.SELECT_COMPANY.TITLE') }}
			</span>
		</template>

		<article class="m-select-company__content">
			<p class="m-select-company__desc">{{ $t('LOGIN.SELECT_COMPANY.DESC') }}</p>

			<div class="m-select-company__list">
				<button
					v-for="company in companies"
					:key="company"
					class="m-select-company__item"
					:class="{ '--selected': company === currentCompany }"
					data-testid="company-button"
					@click.prevent="select(company)"
				>
					<img
						v-if="company === 'BC'"
						src="@assisted/assets/img/caminos-logo-alt.svg"
						alt
						aria-hidden="true"
					/>
					<img v-else src="@assisted/assets/img/bancofar-logo-alt.svg" alt aria-hidden="true" />
				</button>
			</div>
		</article>
	</l-modal>
</template>

<script>
import { mapState } from 'vuex';
import { onDesktop } from '@theme';
import mq from '@utils/matchMedia';
import LModal from '@layouts/l-modal';
import CIcon from '@components/c-icon';

export default {
	name: 'm-select-company',

	components: { LModal, CIcon },

	props: { modal: Boolean },

	data() {
		return {
			value: null,
			companies: ['BC', 'BF'],
		};
	},

	computed: {
		isDesktop: mq(onDesktop),
		...mapState('agent', ['currentCompany']),
	},

	methods: {
		select(companyId) {
			this.value = companyId;
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.m-select-company__content {
	display: flex;
	height: 100%;
	min-height: 120px;
	margin: 0 auto;
	flex-direction: column;
	color: RGB(var(--color-text-primary));
}

.m-select-company__header {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.m-select-company__header-icon {
	color: RGB(var(--color-secondary));
}

.m-select-company__desc {
	margin-bottom: 30px;
}

.m-select-company__list {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px;
}

.m-select-company__item {
	appearance: none;
	color: inherit;
	display: inline-flex;
	position: relative;
	min-width: 140px;
	height: 100%;
	margin: 0 20px;
	padding: 16px 15px;
	border: 0;
	border-radius: $border-radius-xl;
	text-align: left;
	justify-content: center;
	align-items: center;
	background: #0f3356;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25);
}

.m-select-company__item img {
	height: 86px;
	filter: grayscale(100%);
}

.m-select-company__item:hover img,
.m-select-company__item.--selected img {
	filter: grayscale(0%);
}
</style>
