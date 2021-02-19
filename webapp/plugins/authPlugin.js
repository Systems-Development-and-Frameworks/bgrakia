export default ( { app, store }) => {
    const token = app.$apolloHelpers.getToken();
    store.commit('setPrincipal', token);
}