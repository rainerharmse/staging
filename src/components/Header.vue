<template>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <router-link to="/" class="navbar-brand">Stock Trader</router-link>
            </div>

            <div class="collapse navbar-collapse">
                <ul v-if="auth" class="nav navbar-nav">
                    <router-link to="/portfolio" activeClass="active" tag="li"><a>Portfolio</a></router-link>
                    <router-link to="/stocks" activeClass="active" tag="li"><a>Stocks</a></router-link>
                    <router-link to="/dashboard" activeClass="active" tag="li"><a>Dashboard</a></router-link>
                </ul>
                <strong class="navbar-text navbar-right">Funds: {{funds | currency}}</strong>
                <ul class="nav navbar-nav navbar-right">
                    <li v-if="auth"><a href="#" @click="endDay">End Day</a></li>
                    <li v-if="auth" class="dropdown"
                        :class="{open: isDropdownOpen}"
                        @click="isDropdownOpen = !isDropdownOpen">
                        <a
                            href="#"
                            class="dropdown-toggle"
                            data-toggle="dropdown"
                            role="button"
                            aria-haspopup="true"
                            aria-expanded="false">Save & Load <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#" @click="saveNewStocks">Save Data</a></li>
                            <li><a href="#" @click="loadData">Load Data</a></li>
                        </ul>
                    </li>
                    <li v-if="auth">
                        <button @click="logout" class="logout">Logout</button>
                    </li>
                    <li v-if="!auth">
                        <router-link to="/signup">Sign Up</router-link>
                    </li>
                    <li v-if="!auth">
                        <router-link to="/signin">Sign In</router-link>
                    </li>
                </ul>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>
</template>

<style scoped>
    .logout{
        background-color: transparent;
        border: none;
        padding-top: 15px;
        padding-bottom: 15px;
    }
</style>

<script>
import axios from '../axios-auth';
import axiosFire from '../firebase';
import {mapActions} from 'vuex';

    export default {
        data(){
            return{
                isDropdownOpen: false
            }
        },
        computed:{
            auth(){
                return this.$store.getters.isAuthenticated;
            },
            funds(){
                return this.$store.getters.funds;
            }
        },
        methods:{
            ...mapActions({
                randomizeStocks:'randomizeStocks',
                fetchData:'loadData',
                saveData : 'saveStockData'
            }),
            endDay(){
                this.randomizeStocks();
            },
            saveNewStocks(){
                const data = {
                    funds: this.$store.getters.funds,
                    stockPortfolio: this.$store.getters.stockPortfolio,
                    stocks: this.$store.getters.stocks
                };
                this.saveData(data)
            },
            loadData(){
                this.fetchData();
                this.$store.dispatch('fetchUser')
            },
            logout(){
                this.$store.dispatch('logout')
            }
        }
    }
</script>

<style scoped lang="scss">
    
</style>