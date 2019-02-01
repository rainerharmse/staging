import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './routes'; 
import store from './store/store'

Vue.filter('currency', function(value){
    return '$' + value.toLocaleString()
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
