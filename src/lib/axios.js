import 'core-js/es6/promise'
import 'core-js/'
import axios from 'axios'

var instance = axios.create({
  baseURL: config.site_url,
  headers:{
      'Content-type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [function (data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
  }],
})

instance.interceptors.request.use(function (config) {
  config.params = {t: Date.now(), ...config.params}
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

instance.interceptors.response.use(function ({data}) {
  // Do something with response data
  if (data.status && data.status !== 200) {
      return Promise.reject(data.msg);
  } 
  return Promise.resolve(data);
}, function ({response}) {
  if (response.data) {
    return Promise.reject(response.data.msg);    
  } 
  return Promise.reject(response);
});

export default instance;
