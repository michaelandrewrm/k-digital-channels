export default {
	name: 'l-modal',
	template: `
		<div class="l-modal" @keydown.capture="keyHandler">
			<slot name="header" />
			<slot />
			<slot name="buttons" />
		</div>
	`,
};
