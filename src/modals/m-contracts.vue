<template>
	<l-modal class="m-contracts" :modal="modal" :fullscreen="!isDesktop">
		<template v-slot:header>
			<span class="m-contracts__header">
				<c-icon src="@icons/hands" class="m-contracts__header-icon" />
				<span v-if="username" data-testid="username" class="m-contracts__greeting">
					{{ $t('INFO.CONTRACTS.HELLO', { username }) }}
				</span>
				<span class="m-contracts__desc text-s-light">{{ $t('INFO.CONTRACTS.DESC') }}</span>
			</span>
		</template>

		<article class="m-contracts__content">
			<div class="m-contracts__list">
				<button
					v-for="item in ownerContracts"
					:key="item.id"
					class="m-contracts__item --owner"
					:class="{ '--active': activeContract === item.id }"
					data-testid="contract"
					@click.prevent="selectContract(item)"
				>
					<c-icon src="@icons/contracts" class="m-contracts__item-icon" />
					<span class="m-contracts__item-title text-m-medium">
						{{ item.description }}
					</span>
					<span class="m-contracts__item-subtitle text-s-book">
						{{ $t('INFO.CONTRACTS.OWNER') }}
					</span>
				</button>
				<button
					v-for="item in userContracts"
					:key="item.id"
					class="m-contracts__item"
					:class="{ '--active': activeContract === item.id }"
					data-testid="contract"
					@click.prevent="selectContract(item)"
				>
					<c-icon src="@icons/contracts" class="m-contracts__item-icon" />
					<span class="m-contracts__item-title text-m-medium">{{ item.description }}</span>
				</button>
			</div>
		</article>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CIcon from '@components/c-icon';
import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';

export default {
	name: 'm-contracts',

	components: { LModal, CIcon },

	props: {
		username: String,
		contracts: Object,
		modal: Boolean,
		connectedContract: null,
	},

	data() {
		return {
			value: null,
		};
	},

	computed: {
		isDesktop: mq(onDesktop),

		ownerContracts({ contracts: { contracts } }) {
			return contracts?.filter(({ type }) => type === 'owner') /* istanbul ignore next */ ?? [];
		},

		userContracts({ contracts: { contracts } }) {
			return contracts?.filter(({ type }) => type === 'user') /* istanbul ignore next */ ?? [];
		},

		activeContract({ connectedContract }) {
			return connectedContract?.id;
		},
	},

	methods: {
		selectContract(contract) {
			this.value = contract;
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.m-contracts__content {
	display: flex;
	height: 100%;
	min-height: 120px;
	margin: 0 auto;
	flex-direction: column;
	color: RGB(var(--color-text-primary-light));
}

.m-contracts__header {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: RGB(var(--color-text-primary-light));
}

.m-contracts__header-icon,
.m-contracts__greeting,
.m-contracts__desc {
	margin-bottom: 20px;
}

.m-contracts__desc {
	padding: 0 80px;
	line-height: 1.5;
}

.m-contracts__header-icon {
	font-size: 30px;
	color: RGB(var(--color-secondary));
}

.m-contracts /deep/ #l-modal-title {
	border-bottom: none;
}

.m-contracts /deep/ .l-modal__dialog {
	background: var(--color-gradient-menu);
}

.m-contracts /deep/ .l-modal__close-button {
	color: RGB(var(--color-text-primary-light));
}

.m-contracts__list {
	margin-bottom: 60px;
}

.m-contracts__item {
	appearance: none;
	color: inherit;
	display: grid;
	position: relative;
	width: 100%;
	min-height: 75px;
	margin: 0;
	padding: 16px 15px;
	border: 0;
	border-radius: $border-radius-l;
	text-align: left;
	grid-template-columns: fit-content(100px) 1fr;
	column-gap: 20px;
	align-items: center;
	background: RGBA(var(--color-accent-primary), 0.15);
	&:not(:last-child) {
		margin-bottom: 10px;
	}
}

.m-contracts__item.--owner {
	grid-template-rows: 1fr auto;
}

.m-contracts__item-icon {
	color: RGB(var(--color-secondary));
	font-size: 28px;
	grid-row: 1/-1;
}

.m-contracts__item-subtitle {
	grid-column: 2;
}

.m-contracts__item.--active {
	background: RGB(var(--color-accent-primary));
}
</style>
