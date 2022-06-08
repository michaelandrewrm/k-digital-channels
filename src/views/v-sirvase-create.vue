<template>
	<l-page :loading="loading">
		<h1 tabindex="-1" slot="header">{{ $t('SIRVASE.TITLE') }}</h1>

		<c-operation-success v-if="success" slot="state">
			<template v-slot:title>
				{{ $t('SIRVASE.CREATE.SUCCESS.TITLE') }}
			</template>

			<div class="v-sirvase-create__success-content">
				<c-list-icon-item
					class="v-sirvase-create__item"
					:title="$t('SIRVASE.CREATE.ORDER_TYPE')"
					:description="typoName"
					icon="@icons/paper"
					data-testid="order-type"
				/>

				<c-list-icon-item
					class="v-sirvase-create__item"
					:title="$t('SIRVASE.CREATE.DESCRIPTION.LABEL')"
					:description="requestDescription"
					icon="@icons/lang"
					data-testid="description"
				/>
			</div>

			<c-button raised slot="buttons" data-testid="continue" @click="$router.back()">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>

			<router-link
				slot="buttons"
				:to="{ name: 'home', replace: true }"
				class="v-sirvase-create__link text-m-medium"
			>
				{{ $t('ACTIONS.GO_TO_VIEW', { view: $t('GLOBAL_POSITION') }) }}
			</router-link>
		</c-operation-success>

		<c-operation-error v-if="error" slot="state" contactUs @confirm="$router.back()">
			<template v-slot:title>
				{{ $t('SIRVASE.CREATE.ERROR.TITLE') }}
			</template>

			<p class="text-m-book">{{ $t('SIRVASE.CREATE.ERROR.DESC') }}</p>

			<c-button raised slot="buttons" data-testid="continue">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</c-operation-error>

		<div class="v-sirvase-create__content">
			<p class="text-m-medium">{{ $t('SIRVASE.CREATE.TITLE') }}</p>

			<div class="v-sirvase-create__select">
				<label
					class="v-sirvase-create__select-label text-m-medium"
					for="v-sirvase-create__typology"
				>
					{{ $t('SIRVASE.CREATE.WHAT_YOU_NEED') }}
				</label>

				<c-transfer-select-field
					id="v-sirvase-create__typology"
					:label="$t('SIRVASE.CREATE.TYPOLOGY.LABEL')"
					:options="selectOptions"
					v-model="typoId"
					data-testid="select"
				/>
			</div>

			<div class="v-sirvase-create__description">
				<label
					class="v-sirvase-create__select-label text-m-medium"
					for="v-sirvase-create__description"
				>
					{{ $t('SIRVASE.CREATE.DESCRIPTION.LABEL') }}
				</label>

				<c-transfer-textarea
					id="v-sirvase-create__description"
					v-model.trim="requestDescription"
					rows="5"
					cols="50"
					maxlength="1000"
					data-testid="comment-input"
					:placeholder="$t('SIRVASE.CREATE.DESCRIPTION.LABEL')"
					type="text"
					inputmode="text"
					aria-labelledby="label-comment"
				/>
			</div>
		</div>

		<c-button @click="submit" :disabled="validateButton" raised slot="buttons" data-testid="submit">
			{{ $t('ACTIONS.SEND_REQUEST') }}
		</c-button>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import LPage from '@layouts/l-page';
import CTransferTextarea from '@components/c-transfer-textarea';
import CTransferSelectField from '@components/c-transfer-select-field';
import CButton from '@components/c-button';
import COperationError from '@components/c-operation-error';
import COperationSuccess from '@components/c-operation-success';
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'v-sirvase-create',

	components: {
		LPage,
		CTransferTextarea,
		CTransferSelectField,
		CButton,
		COperationError,
		COperationSuccess,
		CListIconItem,
	},

	props: {
		typologyId: String,
		description: String,
	},

	data() {
		return {
			loading: false,
			success: false,
			error: false,
			requestDescription: this.description,
			typoId: this.typologyId,
			typoName: '',
			typologies: [],
		};
	},

	computed: {
		...mapState('session', ['lang']),

		selectOptions({ typologies, lang }) {
			const name = lang === 'en' ? 'name_en' : 'name_es';

			return typologies?.map((item) => ({
				id: item.id,
				label: item[name],
			}));
		},

		validateButton({ typoId, requestDescription }) {
			return !typoId || !requestDescription;
		},
	},

	methods: {
		submit() {
			this.loading = true;

			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
			const { typoId: id, requestDescription, typologies, lang } = this;
			const payload = { type: { id }, description: requestDescription };
			const name = lang === 'en' ? 'name_en' : 'name_es';
			const typology = typologies.find((item) => item.id === id);

			this.typoName = typology[name];

			wait(1000).then(() =>
				this.$store
					.dispatch('sirvase/request', { payload })
					.then(() => {
						this.success = true;
					})
					.catch(() => {
						this.error = true;
					})
					.finally(() => {
						this.loading = false;
					})
			);
		},

		async getTypologies() {
			const response = await this.$store.dispatch('sirvase/getTypologies');
			this.typologies = response?.data;
		},
	},

	created() {
		this.getTypologies();
	},
};
</script>

<style>
.v-sirvase-create__content {
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin: 20px 0;
	width: 100%;
}

.v-sirvase-create__select-label {
	display: block;
	padding-bottom: 10px;
}

.v-sirvase-create__success-content {
	display: flex;
	flex-direction: column;
	text-align: left;
	line-height: 1.5;
}

.v-sirvase-create__item {
	margin-bottom: 15px;
}

.v-sirvase-create__link {
	margin-top: 20px;
}
</style>
