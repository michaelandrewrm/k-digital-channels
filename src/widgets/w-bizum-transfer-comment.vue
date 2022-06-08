<template>
	<l-transfer-sheet class="w-bizum-transfer-comment">
		<div class="w-bizum-transfer-comment__content">
			<label class="w-bizum-transfer-comment__label text-m-medium">
				{{ $t(`BIZUM.MOVEMENT.JUSTIFICATION.${action.toUpperCase()}`) }}

				<c-transfer-field
					id="w-bizum-transfer-comment__comment"
					data-testid="comment"
					class="w-bizum-transfer-comment__field"
					ref="comment"
					v-model="comment"
					required
					:valid="!validations.comment.error"
					@input="validations.comment.dirty = true"
				/>

				<c-transfer-field-helper-text
					for="w-bizum-transfer-comment__comment"
					v-if="validations.comment.error && !validations.comment.maxLength"
				>
					{{ $t('TRANSFERS.ERROR_FIELD_LENGTH', { length: maxCommentLength }) }}
				</c-transfer-field-helper-text>
			</label>
		</div>

		<c-button raised slot="buttons" @click="submit" data-testid="submit">
			{{ $t('ACTIONS.CONTINUE') }}
		</c-button>
	</l-transfer-sheet>
</template>

<script>
import LTransferSheet from '@layouts/l-transfer-sheet';
import CTransferFieldHelperText from '@components/c-transfer-field-helper-text';
import CTransferField from '@components/c-transfer-field';
import CButton from '@components/c-button';
import bizumModule from '@modules/bizum/m-bizum';

export default {
	name: 'w-bizum-transfer-comment',

	modules: { bizum: bizumModule },

	components: {
		LTransferSheet,
		CTransferFieldHelperText,
		CTransferField,
		CButton,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		value: { type: Object, required: true },
		action: { type: String, required: true },
	},

	data() {
		return {
			comment: null,
			maxCommentLength: 255,

			validationState: {
				comment: { dirty: false },
			},
		};
	},

	computed: {
		localModel({ value, comment }) {
			return {
				...value,
				additionalJustification: comment,
				validated: true,
			};
		},

		assessment({ comment, maxCommentLength }) {
			return {
				comment: {
					required: true,
					maxLength: !comment || comment.length <= maxCommentLength,
				},
			};
		},

		validations({ assessment }) {
			const { validationState } = this;

			return Object.keys(assessment).reduce((reducer, key) => {
				const validationField = { ...assessment[key] };

				Object.defineProperties(validationField, {
					invalid: { get: () => !Object.values(assessment[key]).every(Boolean) },
					error: { get: () => this.validations[key].dirty && this.validations[key].invalid },
					dirty: {
						get: () => validationState[key].dirty,
						set: (value) => {
							validationState[key].dirty = value;
						},
					},
				});

				return { ...reducer, [key]: validationField };
			}, {});
		},

		formHasError({ validations }) {
			return Object.values(validations).some(({ error }) => Boolean(error));
		},
	},

	methods: {
		submit() {
			this.validationState.comment.dirty = true;

			if (this.formHasError) {
				return;
			}

			this.$emit('update:value', this.localModel);
		},
	},

	async created() {
		this.comment = this.value.additionalJustification;

		this.$emit('update:value', {
			...this.value,
			additionalJustification: null,
			validated: false,
		});
	},
};
</script>

<style lang="scss" scoped>
.w-bizum-transfer-comment__content {
	padding: 0 0 20px;
	margin: 15px 20px 0;
}

.w-bizum-transfer-comment__label {
	display: block;
}

.w-bizum-transfer-comment__label:not(:last-child) {
	margin-bottom: 20px;
}

.w-bizum-transfer-comment__field {
	margin-top: 10px;
}
</style>
