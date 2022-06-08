<template>
	<div class="w-bizum-movement" :class="classNames">
		<button class="w-bizum-movement__button">
			<div class="w-bizum-movement__col1">
				<div class="w-bizum-movement__title text-m-medium">
					{{ $t(`BIZUM.MOVEMENT.TYPE.${source.type.name}`) }}
					<span v-if="useBeneficiaryAsName">
						{{ source.beneficiary.name || source.beneficiary.phone }}
					</span>
					<span v-else>
						{{ source.sender.name || source.sender.phone }}
					</span>
				</div>

				<div class="w-bizum-movement__title text-s-light">
					{{ $d(new Date(source.operationDate), 'numeric') }}
				</div>

				<div class="text-s-light" v-if="source.reason">
					{{ source.reason }}
				</div>
			</div>

			<div class="w-bizum-movement__col2">
				<div class="w-bizum-movement__amount text-l-medium">
					{{ $nc(source.amount) }}
				</div>
				<div class="w-bizum-movement__status text-s-light">
					{{ $t(`BIZUM.MOVEMENT.STATUS.${source.status.name}`) }}
				</div>
			</div>
		</button>
	</div>
</template>

<script>
export default {
	name: 'w-bizum-movement',

	props: {
		status: { type: String, required: true },
		source: { type: Object, required: true },
	},

	computed: {
		classNames({ source: { status } }) {
			return {
				[`--status-${status.name.toLowerCase()}`]: true,
			};
		},

		useBeneficiaryAsName({ source: { type } }) {
			const beneficiaryTypes = ['SENT', 'REQUEST-SENT', 'SENT-COM', 'SENT-ECOM', 'SENT-SELAE'];
			return beneficiaryTypes.includes(type.name);
		},
	},
};
</script>

<style lang="scss" scoped>
.w-bizum-movement {
	padding: 5px 0;
}

.w-bizum-movement__button {
	appearance: none;
	border: 0;
	width: 100%;
	position: relative;
	background-color: RGB(var(--color-surface-light));
	color: RGB(var(--color-text-primary));
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	padding: 15px;
	min-height: 75px;
	border-radius: $border-radius-s;
	box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.07);
	text-decoration: none;
	text-align: left;
}

.w-bizum-movement__col1 {
	flex-grow: 1;
	flex-shrink: 1;
	display: flex;
	flex-direction: column;
}

.w-bizum-movement__col2 {
	flex-shrink: 0;
	flex-grow: 0;
	width: 100px;
	display: flex;
	flex-direction: column;
	text-align: right;
}

.w-bizum-movement__title {
	margin-bottom: 10px;
}

.w-bizum-movement__amount {
	margin-bottom: 10px;
}

.w-bizum-movement {
	&.--status-rejected,
	&.--status-return,
	&.--status-cancelled,
	&.--status-error,
	&.--status-denied,
	&.--status-expired {
		.w-bizum-movement__status {
			color: RGB(var(--color-text-error));
		}
	}
}
</style>
