import Vue from 'vue';
import axiosFire from '../firebase'


  const loadData = ({commit, state}) => {
    console.log(state)
    axiosFire.get('/data.json' + '?auth=' + state.auth.idToken)
        .then(res => {
            if(res.data){
                const stocks = res.data.stocks;
                const funds = res.data.funds;
                const stockPortfolio = res.data.stockPortfolio;

                const portfolio = {
                    stockPortfolio,
                    funds
                }
                console.log('portfolio below')
                console.log(portfolio)
                commit('SET_STOCKS', stocks)
                commit('SET_PORTFOLIO', portfolio)
            }
        })
};
const saveStockData = ({commit, state}, stockData) => {
        console.log(state)
        console.log(stockData)
        axiosFire.put('/data.json' + '?auth=' + state.auth.idToken, stockData)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.log(error)
            })
    }

export default {
    loadData,
    saveStockData
}

