/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'


// JSONBig 可以处理数据中超出JavaScript安全整数范围的问题
// JSONBig.parse()  // 把JSON格式的字符串转为JavaScript 对象
// JSONBig.stringify() // 把javascript对象转为JSON格式的字符串转

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net', // 接口的基准路径

  // 自定义后端返回的原始数据
  // data 后端返回的原始数据，  就是JSON格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config ：本次请求的配置对象
  // config 里面有一个属性：headers
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 这里必须要返回 config 配置对象，否则请求就会停在这里出去
  return config
}, function (error) {
  // 如果请求出错了(还没有发出去) 会进入这里
  return Promise.reject(error)
})
// 响应拦截器

export default request
