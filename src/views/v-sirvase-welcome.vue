<template>
	<l-page>
		<div class="v-sirvase-welcome__popup" slot="state">
			<div class="v-sirvase-welcome__desc text-s-book">
				<p>
					{{ $t('SIRVASE.WELCOME.DESCRIPTION.PART1') }}
					<i class="text-s-medium">{{ $t('SIRVASE.WELCOME.DESCRIPTION.PART2') }}</i>
					{{ $t('SIRVASE.WELCOME.DESCRIPTION.PART3') }}
				</p>
			</div>
			<div class="v-sirvase-welcome__image" />
			<p class="v-sirvase-welcome__desc text-s-book">
				{{ $t('SIRVASE.WELCOME.DESCRIPTION.PART4') }}
			</p>
			<c-button class="v-sirvase-welcome__button" raised data-testid="create" @click="goto">
				{{ $t('ACTIONS.NEW_SIRVASE_REQUEST') }}
			</c-button>
		</div>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CButton from '@components/c-button';

export default {
	name: 'v-sirvase-welcome',

	components: { LPage, CButton },

	methods: {
		goto() {
			window.history.replaceState({}, '', this.$router.resolve({ name: 'sirvase' }).href);
			this.$router.push({ name: 'sirvase-create' });
		},
	},
};
</script>

<style lang="scss" scoped>
.v-sirvase-welcome__popup {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background-image: var(--color-gradient-menu);
}

.v-sirvase-welcome__desc {
	color: RGB(var(--color-text-primary-light));
	max-width: 280px;
	margin-top: 30px;
	margin-bottom: 10px;
	text-align: center;
}

p.v-sirvase-welcome__desc {
	margin-top: 10px;
	margin-bottom: 20px;
}

.v-sirvase-welcome__desc p {
	margin-bottom: 10px;
}

.v-sirvase-welcome__desc p i {
	color: RGB(var(--color-text-secondary));
	font-style: normal;
}

.v-sirvase-welcome__image {
	width: 100%;
	height: 100%;
	max-width: 280px;
	max-height: 500px;
	background-image: url(~@project/assets/img/mockup-sirvase.png);
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	background-origin: content-box;
	margin-left: 20px;
}

.v-sirvase-welcome__button {
	width: 100%;
	max-width: 280px;
	margin-bottom: 30px;
	flex-shrink: 0;
}
</style>
