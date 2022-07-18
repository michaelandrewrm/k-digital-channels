<template>
	<l-transfer-sheet class="w-transfer-destination" :class="classNames">
		<div class="w-transfer-destination__header">
			<h2
				class="w-transfer-destination__title text-m-medium"
				tabindex="-1"
				aria-describedby="w-transfer-destination__desc"
			>
				{{ $t('TRANSFERS.FILL_DATA') }}
			</h2>

			<p class="w-transfer-destination__desc text-m-light" id="w-transfer-destination__desc">
				{{ $t('TRANSFERS.SELECT_DESTINATION_ACCOUNT') }}
			</p>
		</div>

		<div class="w-transfer-destination__content">
			<div class="w-transfer-destination__accounts-list">
				<w-transfer-destination-list @select="select" :exclude="exclude" />
			</div>
		</div>

		<c-button raised slot="buttons" @click="$emit('close')">
			{{ $t('ACTIONS.NEW_DESTINATION_ACCOUNT') }}
		</c-button>
	</l-transfer-sheet>
</template>

<script>
import LTransferSheet from '@layouts/l-transfer-sheet';
import WTransferDestinationList from '@widgets/w-transfer-destination-list';
import CButton from '@components/c-button';

export default {
	name: 'w-transfer-destination',

	components: {
		WTransferDestinationList,
		LTransferSheet,
		CButton,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		exclude: { type: String },
		value: { type: Object, required: true },
	},

	data() {
		return {
			destination: null,
		};
	},

	computed: {
		classNames({ destination }) {
			return {
				'--has-destination': Boolean(destination),
			};
		},

		localModel({ destination, value }) {
			return {
				...value,
				destination: {
					account: {
						type: 'IBAN',
						id: destination?.productNumber?.value,
					},
					name: destination?.name,
					view: {
						name: destination?.alias,
						id: this.$pn(destination?.productNumber),
					},
				},
			};
		},
	},

	methods: {
		select(selectedDestination) {
			setTimeout(() => {
				this.destination = selectedDestination;

				setTimeout(() => {
					this.$emit('update:value', this.localModel);
				}, 400);
			}, 700);
		},
	},

	created() {
		this.name = this.value?.destination?.name;
		this.iban = this.value?.destination?.account?.id;
		this.favorite = Boolean(this.value?.destination?.account?.favorite);

		this.$emit('update:value', {
			...this.value,
			destination: null,
			fees: null,
			chargeBearer: null,
			favorite: null,
			alias: null,
			validated: false,
			duplicatedOperation: false,
		});
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-destination__header {
	margin: 0 20px;
}

.w-transfer-destination__title {
	padding-top: 30px;
}

.w-transfer-destination__title::before {
	content: '2.' / '';
}

.w-transfer-destination__desc {
	margin-top: 10px;
}

.w-transfer-destination__content {
	padding: 0 10px 20px;
}

.w-transfer-destination__accounts-list {
	margin-top: 30px;
}

.w-transfer-destination.--has-destination {
	animation: dissapear 300ms ease forwards;
}

@keyframes dissapear {
	to {
		opacity: 0;
	}
}
</style>
