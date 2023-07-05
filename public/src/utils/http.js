const { default: axios } = require("axios");

axios.interceptors.request.use(config=>{
    //加上请求头
        config.headers.Authorization='Bearer '+localStorage.getItem("token")
 
})