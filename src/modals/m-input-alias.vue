<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="m-input-alias__icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('ALIAS.INPUT_TITLE') }}
		</template>

		<article class="m-input-alias__wrapper">
			<p>{{ $t('ALIAS.INPUT_DESCRIPTION') }}</p>

			<div>
				<c-text-field
					class="m-input-alias__input"
					id="inputAlias"
					data-testid="send-alias-input"
					v-model.trim="alias"
					type="text"
					inputmode="text"
					:valid="!validationCode.invalid"
					@input="validationCode.dirty = true"
					:useNativeValidation="false"
					maxlength="40"
					minlength="1"
					outlined
				/>
				<span
					v-if="validationCode.dirty && validationCode.invalid"
					class="m-input-alias__input-helper text-m-medium"
					data-testid="alias-validation"
				>
					{{ $t('ALIAS.VALIDATION.MESSAGE') }}
				</span>
			</div>
		</article>

		<template v-slot:buttons>
			<c-button
				raised
				@click="doEdit"
				:disabled="validationCode.invalid || !canEdit"
				data-testid="send-alias-button"
			>
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CTextField from '@components/c-text-field';
import CIcon from '@components/c-icon';
import CButton from '@components/c-button';

export default {
	name: 'm-input-alias',

	components: {
		LModal,
		CTextField,
		CIcon,
		CButton,
	},

	data() {
		return {
			alias: '',
			validationCode: { dirty: false, invalid: true },
			canEdit: true,
		};
	},

	props: {
		detail: {
			type: String,
			required: true,
		},
		productId: {
			type: String,
			required: true,
		},
	},

	watch: {
		alias(newVal) {
			const MIN_LENGTH = 1;
			this.validationCode.invalid =
				newVal.trim().length < MIN_LENGTH || !/^[A-Za-z0-9\s@]*$/.test(newVal);

			/* istanbul ignore next */
			if (newVal === this.detail) {
				this.validationCode.invalid = false;
			}
		},
	},

	methods: {
		openNotification(text) {
			return this.$store.dispatch('notification/open', { text, timeout: 5000 });
		},

		doEdit() {
			this.canEdit = false;
			const ON_SUCCESS = this.$t('ALIAS.INPUT_SUCCESS');
			const ON_ERROR = this.$t('ALIAS.INPUT_ERROR');
			const { productId, alias } = this;

			this.$store
				.dispatch('products/putAlias', { productId, alias })
				.then(() => {
					this.openNotification(ON_SUCCESS);
					this.value = alias;
				})
				.catch(() => {
					this.openNotification(ON_ERROR);
				})
				.finally(() => {
					this.$emit('close');
				});
		},
	},

	mounted() {
		this.alias = this.detail;
	},
};
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

article > *:not(:last-child) {
	margin-bottom: 20px;
}

.m-input-alias__icon {
	margin: 20px 0px;
}

.m-input-alias__input {
	margin: 10px 0;
}

.m-input-alias__input-helper {
	color: RGB(var(--color-accent-error));
}

@media ($on-tablet) {
	article > *:not(:last-child) {
		margin-bottom: 30px;
	}
}

@media ($on-tablet) {
	.m-input-alias__wrapper {
		max-width: 290px;
	}
}
</style>
