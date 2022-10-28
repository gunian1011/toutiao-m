<template>
  <van-button 
    class="like-border"
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class=" {
        liked: value === 1
    }"
    :loading="loading"
    @click="onCollect"
  />


</template>

<script>
    import { addLike, deleteLike } from '@/api/article'
export default {
    name: 'LikeArticle',
    data () {
        return {
            loading: false
        }
    },
    props: {
        value: {
            type: Number,
            required: true
        },
        articleId: {
            type: [Number, String, Object],
            required: true
        }
    },
    methods: {
        async onCollect () {
            this.loading = true
            try {
                let status = -1
                if (this.value === 1) {
                    // 已点赞，取消点赞
                    await deleteLike(this.articleId)
                } else {
                    // 没有点赞，添加点赞
                    await addLike(this.articleId)
                    status = 1
                }
                // 更新视图
                this.$emit('input', status)
                this.$toast.success(status === 1 ? '点赞成功' : '取消失败')
            } catch (err) {
                console.log(err);
                this.$toast.fail('操作失败，请重试')
            }
            this.loading = false
        }
    }

}
</script>

<style lang="less">
    .van-button--default {
        border: 0rem solid #ebedf0
    }
    .liked {
        .van-icon {
            color: #e5645f;   
        }
    }
</style>