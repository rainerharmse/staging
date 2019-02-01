import Vue from 'vue';
import axios from '../../axios-auth';
import axiosFire from '../../firebase';
import { VueAuthenticate } from 'vue-authenticate'
import routes from '../../routes';

const vueAuth = new VueAuthenticate(Vue.prototype.$http, {
    providers: {
        google: {
          clientId: process.env.VUE_APP_GOOGLE_APP_ID,
        }
      }
})

const state = {
    idToken: null,
    userId: null,
    user: null
}

const mutations = {
    authUser (state, userData){
        state.idToken = userData.token
        state.userId = userData.userId
    },
    storeUser(state, user){
        state.user = user
    },
    clearAuthData(state){
        state.idToken = null
        state.userId = null
    }
}

const actions = {
    setLogoutTimer({commit}, expirationTime){
        setTimeout( () => {
            commit('clearAuthData')
        }, expirationTime * 1000)
    },
    signup({commit, dispatch}, authData){
        axios.post('/signupNewUser?key=AIzaSyCcTH0420zy9uBWNdtdS-GGezjDEtvyaiU', {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
            })
            .then( res =>  {
                console.log(res);
                routes.push('/dashboard')
                commit('authUser', {
                    token: res.data.idToken,
                    userId: res.data.localId
                })
                const now = new Date()
                const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
                localStorage.setItem('token', res.data.idToken)
                localStorage.setItem('expirationDate', expirationDate)
                localStorage.setItem('userId', res.data.localId)
                dispatch('storeUser', authData)
                dispatch('setLogoutTimer', res.data.expiresIn)
            })
            .catch(function (error) {
            console.log(error);
            });
    },

    login({commit, dispatch}, authData){
        axios.post('/verifyPassword?key=AIzaSyCcTH0420zy9uBWNdtdS-GGezjDEtvyaiU', {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then( res =>  {
            console.log(res);
            commit('authUser', {
                token: res.data.idToken,
                userId: res.data.localId
            })
            const now = new Date()
            const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
            localStorage.setItem('token', res.data.idToken)
            localStorage.setItem('expirationDate', expirationDate)
            localStorage.setItem('userId', res.data.localId)
            dispatch('setLogoutTimer', res.data.expiresIn)
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    tryAutoLogin({commit}){
        const token = localStorage.getItem('token')
        if(!token){
            return
        }
        const expirationDate = localStorage.getItem('expirationDate')
        const now = new Date()
        if(now >= expirationDate){
            return
        }
        const userId = localStorage.getItem('userId')
        commit('authUser', {
            token: token,
            userId: userId
        })

    },
    logout({commit}) {
        commit('clearAuthData')
        localStorage.removeItem('token')
        localStorage.removeItem('expirationDate')
        localStorage.removeItem('userId')
        routes.replace('/signin')
    },
    storeUser({commit, state}, userData){
        if(!state.idToken) {
            return
        }
        axiosFire.post('/users.json' + '?auth=' + state.idToken, userData)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.log(error)
            })
    },
    fetchUser({commit, state}){
        if(!state.idToken) {
            return
        }
        axiosFire.get('/users.json' + '?auth=' + state.idToken)
            .then(res => {
                console.log(res)
                const data = res.data
                const users = []
                for (let key in data){
                    const user = data[key]
                    user.id = key
                    users.push(user)
                }
                console.log(users)
                commit('storeUser', users[0])
            })
            .catch(error => {
                console.log(error)
            })
    },
    providerAuth ({ commit }, provider) {
		return new Promise((resolve, reject) => {
			vueAuth.authenticate(provider)
			.then(authResponse => {
                console.log('google authenticated')
                console(authResponse)
				resolve(authResponse)
			})
			.catch(error => {
				console.log('Trying to catch the error!!')
				reject(error)
			})
		})
	},
}

const getters = {
    user(state){
        return state.user
    },
    isAuthenticated(state){
        return state.idToken !== null
    }
}

export default {
    vueAuth,
    state,
    mutations,
    actions,
    getters
}