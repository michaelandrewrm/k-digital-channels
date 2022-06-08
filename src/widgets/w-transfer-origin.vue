<template>
	<l-transfer-sheet class="w-transfer-origin" :class="classNames">
		<div class="w-transfer-origin__header">
			<h2
				class="w-transfer-origin__title text-m-medium"
				tabindex="-1"
				aria-describedby="w-transfer-origin__desc"
			>
				{{ $t('TRANSFERS.ORIGIN_ACCOUNT') }}
			</h2>
			<p class="w-transfer-origin__desc text-m-light" id="w-transfer-origin__desc">
				{{ $t('TRANSFERS.SELECT_ORIGIN_ACCOUNT') }}
			</p>
		</div>

		<div class="w-transfer-origin__content">
			<div class="w-transfer-origin__accounts-list">
				<w-transfer-origin-list @select="select" />
			</div>
		</div>
	</l-transfer-sheet>
</template>

<script>
import LTransferSheet from '@layouts/l-transfer-sheet';
import WTransferOriginList from '@widgets/w-transfer-origin-list';

export default {
	name: 'w-transfer-origin',

	components: {
		WTransferOriginList,
		LTransferSheet,
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
.w-transfer-origin__header {
	margin: 0 20px;
}

.w-transfer-origin__title {
	padding-top: 30px;
}

.w-transfer-origin__title::before {
	content: '1.' / '';
}

.w-transfer-origin__desc {
	margin-top: 10px;
}

.w-transfer-origin__content {
	padding: 0 10px 20px;
}

.w-transfer-origin__accounts-list {
	margin-top: 30px;
}

.w-transfer-origin.--has-origin {
	animation: dissapear 300ms ease forwards;
}

@keyframes dissapear {
	to {
		opacity: 0;
	}
}
</style>
