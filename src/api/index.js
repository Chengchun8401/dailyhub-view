import { Message } from 'element-ui';
import axios from 'axios';
import router from '../router'
import Cookie from 'js-cookie';

axios.defaults.withCredentials = true;

// 请求拦截器
axios.interceptors.request.use(
    config=>{

        // 如果token存在，请求时携带token
        if(Cookie.get('token')){
            config.headers['Authorization'] = Cookie.get('token');
        }else{
            // 设置空字符串
            config.headers['Authorization'] = '';
        }
        return config;
    },error => {
        console.log('error')
    }
)


// 响应拦截器
axios.interceptors.response.use(resp=>{
    // 业务逻辑错误
    if(resp.data.success){
        if(resp.data.msg){
            Message.success({message: resp.data.msg});
        }
    }else{
        Message.error({message: resp.data.msg});
        if(resp.data.code === 1003){ // 用户未登录
            // 跳转首页
            router.replace('/');
        }

    }
    // 返回响应数据，业务需先判断是否为null
    return resp.data;
}, error => {
    if(error.response.code === 404 || error.response.code === 504){
        Message.error({message: '服务器被吃了T_T'});
    }else if(error.response.code === 403){
        Message.error({message: '权限不足，请联系管理员'});
    }else{
        if(error.response.data.message){
            Message.error({message: error.response.data.message});
        }else{
            Message.error({message: '未知错误T_T'});

        }
    }
    return;
});


// post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: url,
        data: params
    })
}

// get请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: url,
        data: params
    })
}

// put请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: url,
        data: params
    })
}

// delete请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: url,
        data: params
    })
}