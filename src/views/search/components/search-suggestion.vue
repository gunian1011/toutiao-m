<template>
  <div class="search-suggestion">
    <van-cell 
    icon="search"
    v-for="(text, index) in suggestions"
    :key="index"
    @click="$emit('search', text)"
    >
    <div slot="title" v-html="text"></div>
    </van-cell>
    
  </div>
</template>

<script>

import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: "SearchSuggestion",
  components: {},
  props: {
    searchText: {
        type: String,
        required: true
    }
  },
  data() {
    return {
        suggestions: [], // 联想建议数据列表

    };
  },
  computed: {},
  watch: {
    searchText: {
        // 当 searchText 发生变化的时候就会调用handler 函数
        // handler 函数名是固定的

        // debounce 函数
        // 参数1 一个函数
        // 参数2 延迟时间，单位是毫秒
        // 返回值： 防抖之后的函数
        handler: debounce(function (value) {
            this.loadSearchSuggestions(value)
            console.log(value);
        }, 300),
        // handler (value) {
        //     this.loadSearchSuggestions(value)
        // },
        immediate: true   // 该回调函数会在监听开始之后一颗调用
    }
  },
  created() {},
  methods: {
    async loadSearchSuggestions (q) {
        try {
            const { data } = await getSearchSuggestions(q)
            this.suggestions = data.data.options
            console.log(data);
        } catch (err) {
            this.$toast('数据获取失败，请稍后重试')
            console.log(err);
        }
    },
    
  }
};
</script>

<style scoped lang="less">
    .search-suggestion {
        span.active {
            color: red;
        }
    }
</style>