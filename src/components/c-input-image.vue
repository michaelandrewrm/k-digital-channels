<template>
	<label class="c-input-image" for="file-input">
		<span class="c-input-image__icon">
			<c-icon v-if="!src" src="@icons/camera" size="xl" />
			<img
				v-else
				data-testid="icon-image"
				:src="src"
				alt=""
				class="c-input-image__uploaded-img"
				@click.prevent="openImage(src)"
			/>
		</span>
		<span class="c-input-image__label"><slot /></span>
		<c-icon-button
			data-testid="remove-file"
			v-if="src"
			icon="@icons/trash"
			size="l"
			@click.prevent="removeImage"
		/>
		<input
			id="file-input"
			@change="loadImage"
			type="file"
			name="file"
			class="c-input-image__file-input"
		/>
	</label>
</template>

<script>
import CIcon from '@components/c-icon';
import CIconButton from '@components/c-icon-button';
import MImage from '@modals/m-image';
import MConfirmImageDeletion from '@modals/m-confirm-image-deletion';

export default {
	name: 'c-input-image',

	components: {
		CIcon,
		CIconButton,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	data() {
		return {
			src: '',
		};
	},

	props: {
		value: { type: String, default: '' },
		imageMaxSize: { type: Number, default: 400 },
		imageQuality: { type: Number, default: 0.5 },
		imageType: { type: String, default: 'image/jpeg' },
	},

	watch: {
		value: {
			immediate: true,
			handler(value) {
				this.src = value;
			},
		},

		src(src) {
			this.$emit('update:value', src);
		},
	},

	methods: {
		/* istanbul ignore next */
		async loadImage({ target }) {
			if (target?.files?.length) {
				const url = URL.createObjectURL(target.files[0]);
				this.src = await this.downscaleImage(
					url,
					this.imageMaxSize,
					this.imageType,
					this.imageQuality
				);
				// eslint-disable-next-line no-param-reassign
				target.value = '';
			}
		},

		/* istanbul ignore next */
		async downscaleImage(dataUrl, newWidth, imageType, imageArguments) {
			const image = await new Promise((resolve) => {
				const img = new Image();
				img.onload = () => resolve(img);
				img.src = dataUrl;
			});

			const oldWidth = image.width;
			const oldHeight = image.height;
			const newHeight = Math.floor((oldHeight / oldWidth) * newWidth);

			const canvas = document.createElement('canvas');
			canvas.width = newWidth;
			canvas.height = newHeight;
			canvas.getContext('2d').drawImage(image, 0, 0, newWidth, newHeight);

			return canvas.toDataURL(imageType, imageArguments);
		},

		openImage(image) {
			return this.$store.dispatch('modal/open', {
				component: MImage,
				props: { image },
			});
		},

		async removeImage() {
			const confirmation = await this.$store.dispatch('modal/open', MConfirmImageDeletion);

			/* istanbul ignore else */
			if (confirmation) {
				this.src = '';
				return this.$store.dispatch('notification/open', {
					text: this.$t('IMAGE_REMOVED'),
					timeout: 5000,
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.c-input-image {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	cursor: pointer;
}

.c-input-image__icon {
	flex-shrink: 0;
	display: flex;
	width: 40px;
	height: 40px;
	background-color: RGB(var(--color-surface-light));
	border-radius: $border-radius-s;
	box-shadow: 0px 5px 10px -8px rgba(0, 0, 0, 0.5);
	align-items: center;
	justify-content: center;
	color: RGB(var(--color-accent-secondary));
}

.c-input-image__label {
	flex-grow: 1;
	margin-left: 10px;
}

.c-input-image__uploaded-img {
	width: 40px;
	height: 40px;
	object-fit: cover;
	object-position: center;
	background-color: RGB(var(--color-surface-light));
	border-radius: $border-radius-s;
	box-shadow: 0px 5px 10px -8px rgba(0, 0, 0, 0.5);
	cursor: zoom-in;
}

.c-input-image__file-input {
	display: none;
}

.c-input-image__remove {
	position: relative;
	width: 20px;
	height: 20px;
	border: 0;
	background: RGB(var(--color-accent-secondary));
	border-radius: 50%;
	margin: 0 0 0 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
}
</style>
