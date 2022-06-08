<template>
	<div class="m-accept-cookies">
		<transition name="fade" appear>
			<div class="m-accept-cookies__overlay" tabindex="-1"></div>
		</transition>

		<div class="m-accept-cookies__wrapper text-s-book" data-testid="modal-cookies">
			<p class="text-m-medium">{{ $t('COOKIES.DESC1') }}</p>
			<p>{{ $t('COOKIES.DESC2') }}</p>
			<p>{{ $t('COOKIES.DESC3') }}</p>

			<c-button
				raised
				class="m-accept-cookies__button"
				@click="accept"
				data-testid="accept-cookies"
			>
				{{ $t('COOKIES.ACTION.ACCEPT') }}
			</c-button>

			<p>
				<a
					href="#"
					class="color-text-secondary text-m-medium"
					@click.prevent="cancel"
					data-testid="reject-cookies"
				>
					{{ $t('COOKIES.ACTION.CANCEL') }}
				</a>
			</p>

			<p>
				<a
					class="color-text-secondary text-m-medium"
					:href="$store.state.app.cookiesDetail"
					rel="noopener"
					target="_blank"
				>
					{{ $t('COOKIES.ACTION.MORE_INFO') }}
				</a>
			</p>
		</div>
	</div>
</template>

<script>
import CButton from '@components/c-button';

export default {
	name: 'm-accept-cookies',

	components: {
		CButton,
	},

	data() {
		return {
			value: false,
		};
	},

	methods: {
		accept() {
			this.value = true;
			this.$emit('close');
		},

		cancel() {
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.m-accept-cookies__overlay {
	width: 100%;
	height: 100%;
	background-color: RGBA(var(--color-primary), 0.7);
	position: fixed;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
}

.m-accept-cookies__wrapper {
	background-color: RGB(var(--color-primary-dark));
	color: RGB(var(--color-text-primary-light));
	padding: 20px;
	position: absolute;
	bottom: 20px;
	left: 20px;
	right: 20px;
	width: calc(100% - 40px);
	max-width: 450px;
	margin: 0 auto;
	border-radius: $border-radius-m;
	z-index: $layer-modal-z-index;
}

.m-accept-cookies__wrapper p:not(:last-child) {
	margin-bottom: 10px;
}

.m-accept-cookies__link {
	text-decoration: underline;
}

.m-accept-cookies__button {
	display: block;
	margin-top: 30px;
	margin-bottom: 30px;
	height: 40px;
	width: 100%;
}

.fade-enter-active {
	animation: fade 200ms ease;
}

@keyframes fade {
	from {
		opacity: 0;
	}
}
</style>
