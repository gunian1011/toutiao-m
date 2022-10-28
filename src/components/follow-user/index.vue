<template>
    <van-button
        v-if="isFollowed"
        class="follow-btn"
        round
        size="small"
        @click="onFollow"
        :loading="loading"
    >已关注</van-button>
    <van-button
    v-else
        class="follow-btn"
        type="info"
        color="#3296fa"
        round
        size="small"
        icon="plus"
        @click="onFollow"
        :loading="loading"
    >关注</van-button>
</template>

<script>

import { deleteFollow, addFollow } from '@/api/user'

export default {
    name: 'FollowUser',
    // 自定义 v-model 的数据名称
    model: {
        prop: 'isFollowed', // 默认是 value
        event: 'update-is_followed' // 默认是 input
    },
    props: {
        isFollowed: {
            type: Boolean,
            required: true,
        },
        userId: {
            type: [Number, String, Object],
            required: true,
        }
    },
    data () {
        return {
            loading: false
        }
    },
    methods: {
        async onFollow () {
            this.loading = true // 展现关注按钮的 loading 状态
            try {
                if (this.isFollowed) {
                // 已经关注，取消关注
                    await deleteFollow(this.userId)
                    // this.article.is_followed = false
                } else {
                    // 没有关注，关注用户
                    await addFollow(this.userId)
                    // this.article.is_followed = true
                }
                    // 简写的形式
                    // this.article.is_followed = !this.article.is_followed
                    this.$emit('update-is_followed', !this.isFollowed)
            } catch (err) {
                console.log(err);
                let message = '操作失败，请重试'
                if (err.response && err.response.status === 400) {
                    message = '你不能关注你自己'
                }
                    this.$toast(message)
            }
            this.loading = false // 展现关注按钮的 loading 状态
        }
    }
}
</script>

<style>

</style>