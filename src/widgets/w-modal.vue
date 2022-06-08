<template>
	<div class="w-modal">
		<section v-for="(layer, index) in layers" :key="index">
			<keep-alive>
				<component
					:key="layer.uid"
					aria-labelledby="modal-title"
					role="dialog"
					@keydown.esc="closeModal(layer.uid)"
					@keydown.tab.native="trapTabKey"
					:is="layer.item.component"
					v-bind="layer.item.props"
					:ref="`externalComponent-${layer.uid}`"
					:id="layer.name"
					data-testid="modal"
					@close="closeModal(layer.uid)"
					@close.native="closeModal(layer.uid)"
				/>
			</keep-alive>
		</section>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'w-modal',

	computed: {
		...mapGetters({
			lastOpenedModal: 'modal/lastOpened',
		}),

		layers({
			$store: {
				state: {
					modal: { queue },
				},
			},
		}) {
			return Object.entries(queue).reduce(
				(reducer, [uid, item]) => ({
					...reducer,
					[item.layer]: {
						uid,
						item,
						name: item?.component?.options?.name,
					},
				}),
				{}
			);
		},
	},

	data() {
		return {
			focusedElementBeforeModal: null,
			focusableElementsString: [
				'[a11y-focusable]',
				'a[href]',
				'input:not([disabled])',
				'select:not([disabled])',
				'textarea:not([disabled])',
				'button:not([disabled])',
				'iframe',
				'object',
				'embed',
				'[tabindex]:not([tabindex="-1"])',
				'[contenteditable]',
			].join(', '),
		};
	},

	methods: {
		/**
		 * Closes current modal
		 */
		closeModal(id) {
			this.$store.dispatch('modal/close', {
				id,
				payload: this.$refs[`externalComponent-${id}`][0].value,
			});
		},

		/**
		 * Returns a list of focusable children elements
		 */
		getFocusableItems() {
			return [...this.$el.querySelectorAll(this.focusableElementsString)];
		},

		trapTabKey(evt) {
			const focusableItems = this.getFocusableItems();
			const focusedItemIndex = focusableItems.indexOf(this.$el.ownerDocument.activeElement);

			/* istanbul ignore next */
			if (!focusableItems.length) {
				return;
			}

			const {
				0: firstElement,
				length: numberOfFocusableItems,
				[numberOfFocusableItems - 1]: lastElement,
			} = focusableItems;

			// if focused on first item and user preses back-tab, go to the last focusable item
			/* istanbul ignore else */
			if (evt.shiftKey && focusedItemIndex === 0) {
				lastElement.focus();
				evt.preventDefault();

				// if focused on the last item and user preses tab, go to the first focusable item
			} else if (!evt.shiftKey && focusedItemIndex === numberOfFocusableItems - 1) {
				firstElement.focus();
				evt.preventDefault();
			}
		},

		setFocusToFirstItemInModal() {
			const nodes = this.getFocusableItems();

			if (nodes.length) {
				nodes[0].focus();
			}
		},
	},

	watch: {
		lastOpenedModal(modal) {
			if (modal) {
				/* istanbul ignore else */
				if (!this.focusedElementBeforeModal) {
					this.focusedElementBeforeModal = this.$el.ownerDocument.activeElement;
				}

				this.$nextTick(this.setFocusToFirstItemInModal);
			} else {
				// set focus back to element that had it before the modal was opened
				if (this.focusedElementBeforeModal) {
					this.focusedElementBeforeModal.focus();
				}

				this.focusedElementBeforeModal = null;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.w-modal {
	z-index: 999;
}
</style>
