import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './components/Home.vue';
import Dashboard from './components/Dashboard.vue';
import Portfolio from './components/portfolio/Portfolio.vue';
import Stocks from './components/stocks/Stocks.vue';
import SignupPage from './components/auth/Signup.vue';
import SigninPage from './components/auth/Signin.vue';
import auth from './store/modules/auth';

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Home},
    { 
        path: '/portfolio', 
        component: Portfolio,
        beforeEnter(to, from, next){
            if(auth.state.idToken){
                next()
            }else{
                next('/signin')
            }
        }
    },
    { path: '/stocks', component: Stocks},
    { path: '/dashboard', component: Dashboard },
    { path: '/signup', component: SignupPage },
    { path: '/signin', component: SigninPage },
]

export default new VueRouter({mode: 'history', routes})