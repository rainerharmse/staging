<template>
   <div>
       <p>This user email is {{email}}</p>
       <stock v-for="stock in stocks" :key="stock.id" :stock="stock"></stock>
   </div>
</template>

<script>
import Stock from './Stock.vue';

export default {
    computed:{
        stocks(){
            return this.$store.getters.stockPortfolio;
        },
        email(){
            return !this.$store.getters.user ? false : this.$store.getters.user.email
        }
    },
    created(){
        
    },
    components:{
        Stock
    }
}
</script>