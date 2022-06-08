<template>
	<l-page>
		<div class="v-ontime-welcome__popup" slot="state">
			<div class="v-ontime-welcome__desc text-s-book">
				<p>
					{{ $t('ONTIME.WELCOME.DESCRIPTION.PART1') }}
					<i class="text-s-medium">{{ $t('ONTIME.WELCOME.DESCRIPTION.PART2') }}</i>
					{{ $t('ONTIME.WELCOME.DESCRIPTION.PART3') }}
				</p>
			</div>
			<div class="v-ontime-welcome__image" />
			<c-button class="v-ontime-welcome__button" raised data-testid="create" @click="goto">
				{{ $t('ACTIONS.CONFIGURE') }}
			</c-button>
		</div>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CButton from '@components/c-button';

export default {
	name: 'v-ontime-welcome',

	components: { LPage, CButton },

	methods: {
		goto() {
			this.$store.dispatch('ontime/setWelcome');
			window.history.replaceState({}, '', this.$router.resolve({ name: 'ontime' }).href);
			this.$router.push({ name: 'ontime-create' });
		},
	},
};
</script>

<style lang="scss" scoped>
.v-ontime-welcome__popup {
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

.v-ontime-welcome__desc {
	color: RGB(var(--color-text-primary-light));
	max-width: 280px;
	margin-top: 30px;
	margin-bottom: 10px;
	text-align: center;
}

.v-ontime-welcome__desc p i {
	color: RGB(var(--color-text-secondary));
	font-style: normal;
}

.v-ontime-welcome__image {
	width: 100%;
	height: 100%;
	max-width: 280px;
	max-height: 500px;
	background-image: url(~@project/assets/img/mockup-ontime.png);
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	background-origin: content-box;
}

.v-ontime-welcome__button {
	width: 100%;
	max-width: 280px;
	margin-bottom: 30px;
}
</style>
