<template>
  <div class="article-list">
    <!-- 

        LIst 列表组件：瀑布流滚动加载 用于展示长列表

        LIst组件通过 loading 和finished 两个变量控制加载状态
        当组件初始化或滚动到底部时，会触发load 事件并将 loading设置为true
        此时可以发起异步操作并更新数据
        数据更新完毕后 将loading 设置成false即可
        若数据已经全部加载完毕 则直接将finished 设置成true即可

        load 事件：
        List 初始化后会触发一次 load 事件，用于加载第一屏的数据
        如果一次请求加载的数据条数比较少，导致列表内容无法铺满当前屏幕
        List会继续触发 load事件 直到铺满全屏或加载完全部数据

        loading 属性：控制加载中的 loading 状态
        非加载中 loading为false 此时会根据列表滚动位置判断是否触犯 load
        事件 列表内容不足一屏幕是 会直接触发）
        加载中：loading 为 true 表示正在发送异步请求 此时不会触发 load 事件

        finnished 属性： 控制加载结束的状态
        在每次请求完毕后，需要手动将loading 设置为false 表示加载结束
        所有的数据加载结束 finished 为 true 此时不会触发load 事件

     -->
     <van-pull-refresh v-model="isreFreshLoading" 
        @refresh="onRefresh"
        :success-text="refreshSuccessText"
        :success-duration="1000"
        >
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="onLoad"
        >
        <article-item
            v-for="(article, index) in list"
            :key="index"
            :article="article"
        />
        <!-- <van-cell 
            v-for="(article, index) in list" 
            :key="index" 
            :title="article.title" /> -->
        </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
    import { getArticles } from '@/api/article'
    import ArticleItem from '@/components/article-item/index.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
        list: [],  // 存储列表数据的数组
        loading: false,  // 控制加载中 loading 状态
        finished: false,  // 控制数据加载结束后的状态
        timestamp: null,  // 请求获取下一页的时间戳
        error: false,  // 控制列表提示失败的状态
        isreFreshLoading: false,  // 控制下拉刷新的loading状态
        refreshSuccessText: '刷新成功', // 下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {

    async onLoad() {
        try {
            // 1. 请求获取数据
            const { data } = await getArticles({
                channel_id: this.channel.id, // 频道id
                timestamp: this.timestamp || Date.now(),  // 时间戳 请求新的数据
                with_top: 1, // 是否包含置顶，1是包含，0是不包含
            })

        
            // 2. 把请求结果数据放到list数组中
            const { results } = data.data
            // 数组的展开操作符，他会把数组元素一个一个拿出来
            this.list.push(...results)


            // 3. 本次数据加载结束之后要把加载状态设置为结束
            this.loading = false

            // 4. 判断数据是否全部加载完成
            if (results.length) {
                // 更新获取下一页数据的时间戳
                this.timestamp = data.data.pre_timestamp
            } else {
                // 没有数据了，将finished 设置为true 不再load加载
                this.finished = true
            }
        } catch (err) {
            // 展示错误提示状态
            this.error = true

            // 请求失败了，loading 也需要关闭
            this.loading = false
        }

    
      
    },

    // 当下拉刷新的时候会触发这个函数
    async onRefresh () {
        try {
            // 1. 请求获取数据
            const { data } = await getArticles({
                channel_id: this.channel.id, // 频道id
                timestamp: Date.now(),  // 时间戳 请求新的数据
                with_top: 1, // 是否包含置顶，1是包含，0是不包含
            })

            //  模拟随机刷新失败的情况
            // if (Math.random() > 0.2) {
            //     JSON.parse('dadsagass')
            // }

            // 2. 将数据追加到列表的顶部
            const { results } = data.data
            this.list.unshift(...results)
            // 3. 关闭下拉刷新的loading状态
            this.isreFreshLoading = false

            // 更新下拉刷新成功提示文本
            this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
        } catch (err) {
            this.isreFreshLoading = false
            this.refreshSuccessText = '刷新失败'
        }
        
    }

    // 初始化或滚动到底部的时候会触发调用 onload事件
    // onLoad() {
    //   // 异步更新数据
    // //   1. 请求获取数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     // 2. 把请求结果数据放到list数组中
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }

    //     // 加载状态结束
    //     // 3. 本次数据加载结束之后要把加载状态设置为结束
    //     // loading 关闭之后才能触发下一次的而夹在更多
    //     this.loading = false;

    //     // 4. 判断数据是否全部加载完成
    //     if (this.list.length >= 40) {
    //         // 如果没有数据了，吧finished 设置为true 之后就不会在触发加载更多
    //       this.finished = true;
    //     }
    //   }, 1000);
    // },
  },
}
</script>

<style scoped lang="less">
    .article-list {
        // 相对于父元素的百分百
        // height: 100%;
        // vh是可视化的是响应的
        height: 79vh;
        overflow-y: auto;
    }
</style>