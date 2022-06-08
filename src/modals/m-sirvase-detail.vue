<template>
	<div class="m-sirvase-detail">
		<button class="m-sirvase-detail__close" data-testid="close" @click="$emit('close')">
			{{ `&#x2716;` }}
		</button>
		<div class="m-sirvase-detail__content text-l-book">
			<p class="text-l-bold">{{ $t('ASSISTED-SIRVASE-DATE-REQUEST_TABLE') }}</p>
			<span class="text-m-bold">{{ detail.requestDate }}</span>
			<p class="text-l-bold">{{ $t('ASSISTED-SIRVASE-DATE-MODIFY_TABLE') }}</p>
			<span class="text-m-bold">{{ itemModificationDate() }}</span>
			<p class="text-l-bold">{{ $t('ASSISTED-SIRVASE-TYPOLOGY_TABLE') }}</p>
			<span class="text-m-bold">{{ detail.type.name_es }}</span>
			<p class="text-l-bold">{{ $t('ASSISTED-SIRVASE-DESCRIPTION_TABLE') }}</p>
			<span class="text-m-book">{{ detail.description }}</span>
			<p class="text-l-bold">{{ $t('ASSISTED-SIRVASE-STATUS_TABLE') }}</p>
			<span>
				<select
					v-model="status"
					:class="itemStatusColor(status)"
					class="m-assisted-sirvase__select text-m-bold"
					data-testid="selected"
				>
					{{
						status.name_es
					}}
					<option
						class="m-assisted-sirvase__option"
						:class="itemStatusColor(item)"
						data-testid="option"
						:value="item"
						v-for="item in statusArray"
						:key="item.id"
					>
						{{ item.name_es }}
					</option>
				</select>
			</span>
			<p class="text-l-bold">{{ $t('ASSISTED-SIRVASE-MANAGER') }}</p>
			<span class="text-m-bold">{{ itemManager() }}</span>
		</div>
		<button @click="saveStatus" data-testid="save" class="m-sirvase-detail__save text-l-bold">
			{{ $t('ASSISTED-SIRVASE_BUTTON') }}
		</button>
	</div>
</template>

<script>
export default {
	name: 'm-sirvase-detail',
	data() {
		return {
			detail: this.source,
			status: this.source.status,
		};
	},
	props: {
		source: {
			type: Object,
			required: true,
		},
	},

	computed: {
		statusArray({ detail }) {
			const { status } = detail;
			if (status.name_es === 'Solicitada') {
				return [
					{
						id: '01',
						name_es: 'Solicitada',
						name_en: 'Requested',
					},
					{
						id: '02',
						name_es: 'Realizada',
						name_en: 'Done',
					},
					{
						id: '03',
						name_es: 'Expirada',
						name_en: 'Expired',
					},
					{
						id: '04',
						name_es: 'Cancelada',
						name_en: 'Cancelled',
					},
				];
			}

			if (status.name_es === 'Realizada') {
				return [
					{
						id: '02',
						name_es: 'Realizada',
						name_en: 'Done',
					},
				];
			}

			return [
				{
					id: '02',
					name_es: 'Realizada',
					name_en: 'Done',
				},
				{
					id: '03',
					name_es: 'Expirada',
					name_en: 'Expired',
				},
				{
					id: '04',
					name_es: 'Cancelada',
					name_en: 'Cancelled',
				},
			];
		},
	},

	methods: {
		saveStatus() {
			if (this.status.id === this.source.status.id) {
				return this.$emit('close');
			}

			this.value = this.status.id;
			return this.$emit('close');
		},

		itemStatusColor(item) {
			const statusName = item?.name_en.toUpperCase() || 'color-text-primary';
			const status = {
				REQUESTED: 'color-accent-icon',
				DONE: 'color-accent-success',
				EXPIRED: 'color-accent-error',
				CANCELLED: 'color-accent-error',
			}[statusName];

			return status;
		},

		itemManager() {
			return this.detail.manager || '-';
		},

		itemModificationDate() {
			return this.detail.modificationDate || '-';
		},
	},
};
</script>

<style lang="scss" scoped>
.m-sirvase-detail {
	display: flex;
	flex-direction: column;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	max-height: 600px;
	max-width: 600px;
	background-color: RGB(var(--color-surface-light));
	box-shadow: 0px 11px 15px -7px RGBA(var(--color-primary), 0.2),
		0px 24px 38px 3px RGBA(var(--color-primary), 0.14),
		0px 9px 46px 8px RGBA(var(--color-primary), 0.12);
	overflow-y: auto;
}

.m-sirvase-detail__close {
	align-self: flex-end;
}

.m-sirvase-detail__save {
	align-self: center;
	margin: 20px;
	padding: 10px;
	width: 100px;
	background-color: RGB(var(--color-surface));
	color: RGB(var(--color-secondary));
	border: none;
}

.m-sirvase-detail__content {
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
	max-width: 750px;
	height: 100%;
	padding: 15px;
	border-radius: 4px;
}

.m-sirvase-detail__content p {
	color: RGB(var(--color-secondary));
}

.m-assisted-sirvase__select {
	border: none;
}

.m-assisted-sirvase__select:hover {
	cursor: pointer;
}

.m-assisted-sirvase__option {
	padding: 3px;
	margin: 2px;
}
</style>
