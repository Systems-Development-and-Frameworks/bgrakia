import jwt_decode from 'jwt-decode';


export const state = () => ({
    user: {
        token: '',
        id: undefined
    }
})

export const mutations = {

    setPrincipal(state, token) {
        try {
            console.log(token);
            const decodedToken = jwt_decode(token)
            const uId = decodedToken.uId;
            state.user = { token, id: uId };
        }
        catch (e) {}
       
    },

    removePrincipal(state) {
        state.user = {token: '', id: undefined};
    }
    
}
export const getters = {

    getPrincipal(state) {
        return state.user;
    },

    isAuthenticated(state)  {
        return state.user.token.length > 0 && state.user.id !== undefined;
    }
}