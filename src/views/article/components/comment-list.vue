<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="已显示全部评论"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
    >
    <comment-item 
        v-for="(item, index) in list" 
        :key="index"  
        :comment="item"
        @reply-click="$emit('reply-click',$event)"
        />
</van-list>
</template>

<script>
    import { getComments } from '@/api/comment'
    import CommentItem from './comment-item.vue'
export default {
    name: 'CommentList',
    components: {
        CommentItem,
    },
    props: {
        source: {
            type: [Number, String, Object],
            required: true
        },
        list: {
            type: Array,
            default: () => []
        },
        type: {
            type: String,
            // 自定义 Prop 数据验证
            validator (value) {
                return ['a','c'].includes(value)
            },
            default: 'a'
        }
    },
    data() {
        return {
            // list: [],
            loading: false,
            finished: false,
            offset: null,   // 获取下一页的数据
            limit: 10,
            error: false
        }
    },
    created () {
        this.loading = true
        this.onLoad()
    },
    methods: {
        async onLoad() {
            try {
                // 获取文章的评论和获取评论的回复是同有个接口
                // 唯一的区别是接口参数不一样
                // 1. 请求获取数据
                const { data } = await getComments({
                    type: this.type,  // 评论类型，a对文章(article)的评论c对评论的评论
                    source: this.source.toString(),  // 源id，文章id或评论id
                    offset: this.offset,  // 获取评论的偏移量
                    limit: this.limit,  // 评论数量
                })
                console.log(data);

                // 2. 将数据添加到列表中
                const { results } = data.data
                this.list.push(...results)

                // 把文章评论的总数量传递到外部
                this.$emit('onload-success', data.data)

                // 3. 将 loading 设置为true
                this.loading = false

                // 4. 列表是否还有数据
                if (results.length) {
                    // 有数据更新下一页的数据
                    this.offset = data.data.last_id
                } else {
                    // 没有数据将 finished 设置结束
                    this.finished = true
                }
            } catch (err) {
                this.error = true
                this.loading = false
            }
        }
    },
}
</script>

<style>

</style>