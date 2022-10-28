import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    //  一个对象，存储当前登录用户信息(Token)
    user: getItem(TOKEN_KEY)
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    // user: null
  },
  mutations: {
    setUser (state, data) {
        state.user = data

        // 为防止页面刷新丢失，需要把数据备份到本地存储
        setItem(TOKEN_KEY, state.user)
        // window.localStorage.setItem(TOKEN_KEY,JSON.stringify(state.user))
    }
  },
  actions: {
  },
  modules: {
  }
})
