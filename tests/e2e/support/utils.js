// Returns the Vuex store.
const getStore = () => cy.window().its('__app__.$store');

export default { getStore };
