import jwt_decode from 'jwt-decode';

export const state = () => ({
    user: {
        token: '',
        id: undefined
    }
})

export const mutations = {

    setPrincipal(state, token) {
        const uId = jwt_decode(token).uId;
        state.user = { token, id: uId };
    },

    removePrincipal(state) {
        state.user = {token: '', id: undefined};
    }
    
}
export const getters = {

    getPrincipa(state) {
        return state.user;
    },

    isAuthenticated(state)  {
        return state.user.token.length > 0 && state.user.id !== undefined;
    }
}