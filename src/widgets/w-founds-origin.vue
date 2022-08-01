<template>
	<l-transfer-sheet class="w-founds-origin" :class="classNames">
		<div class="w-founds-origin__header">
			<h2
				class="w-founds-origin__title text-m-medium"
				tabindex="-1"
				aria-describedby="w-founds-origin__desc"
			>
				{{ $t('FOUNDS.ORIGIN_ACCOUNT') }}
			</h2>
			<p class="w-founds-origin__desc text-m-light" id="w-founds-origin__desc">
				{{ $t('FOUNDS.SELECT_ORIGIN_ACCOUNT') }}
			</p>
		</div>

		<div class="w-founds-origin__content">
			<div class="w-founds-origin__accounts-list">
				<c-card-item
					class="w-founds-origin-list__card"
					icon="@icons/folder"
					:title="$t('FOUNDS.ORIGIN_ITEM1')"
					data-testid="product-card-item"
					@click.native="select"
				/>
				<c-card-item
					class="w-founds-origin-list__card"
					icon="@icons/folder"
					:title="$t('FOUNDS.ORIGIN_ITEM2')"
					data-testid="product-card-item"
					@click.native="select"
				/>
			</div>
		</div>
	</l-transfer-sheet>
</template>

<script>
import LTransferSheet from '@layouts/l-transfer-sheet';
import CCardItem from '@components/c-card-item';

export default {
	name: 'w-founds-origin',

	components: {
		LTransferSheet,
		CCardItem,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		value: { type: Object, required: true },
	},

	data() {
		return {
			origin: null,
		};
	},

	computed: {
		classNames({ origin }) {
			return {
				'--has-origin': Boolean(origin),
			};
		},

		localModel({ value, origin }) {
			return { ...value, origin };
		},
	},

	methods: {
		select(origin) {
			setTimeout(() => {
				this.origin = origin;
				setTimeout(() => {
					this.$emit('update:value', this.localModel);
				}, 400);
			}, 700);
		},
	},

	created() {
		this.$emit('update:value', {
			origin: null,
			destination: null,
			amount: null,
			reason: '',
			periodicity: 'today',
			date: null,
			frequency: null,
			maxDate: null,
			fees: null,
			chargeBearer: null,
			favorite: null,
			alias: null,
			validated: false,
		});
	},
};
</script>

<style lang="scss" scoped>
.w-founds-origin__header {
	margin: 0 20px;
}

.w-founds-origin__title {
	padding-top: 30px;
}

.w-founds-origin__title::before {
	content: '1.' / '';
}

.w-founds-origin__desc {
	margin-top: 10px;
}

.w-founds-origin__content {
	padding: 0 10px 20px;
}

.w-founds-origin__accounts-list {
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-top: 30px;
}

.w-founds-origin.--has-origin {
	animation: dissapear 300ms ease forwards;
}

@keyframes dissapear {
	to {
		opacity: 0;
	}
}
</style>
