// 引入http模块，用于创建http服务器
import http from "http";

// 引入URL模块，用于处理和解析URLs
import { URL } from "url";

// 引入UAParser模块，该模块能够从http请求头中解析出用户代理字符串，并返回一个包含设备，操作系统，浏览器等信息的对象
import UAParser from "ua-parser-js";

// 引入formidable模块，该模块用于处理http的multipart/form-data类型的请求体，可以解析和操作POST请求中的表单数据
import formidable from "formidable";

// 引入自定义错误处理模块，该模块应该导出了一个或多个错误处理函数
import error from "./sserr.js";

// 导出一个默认的函数，该函数接收一个参数n，默认为空对象{}
export default function (n){
    // 如果n不是对象，则抛出类型错误
    n = n || {};
    if (typeof n !== 'object') {
        throw new TypeError('path must be an object,not a ' + typeof n);
    }
    // 使用http模块创建一个新的http服务器
    return http.createServer(function (req, res) {
        // 在http请求对象req上定义一个cookie方法，用于设置http响应中的cookie
        req.cookie = function (id, value, json = {path: '/', maxAge: null, expires: null, domain: null}) {
            // 如果maxAge属性存在，则在cookie中添加max-age属性，值为maxAge的值
            if (json.maxAge) {
                json.maxAge = '; max-age=' + json.maxAge;
            } else {
                // 如果maxAge属性不存在，则在cookie中不添加max-age属性
                json.maxAge = '';
            }
            // 如果expires属性存在，则在cookie中添加expires属性，值为expires的值
            if (json.expires) {
                json.expires = '; expires=' + json.expires;
            } else {
                // 如果expires属性不存在，则在cookie中不添加expires属性
                json.expires = '';
            }
            // 如果domain属性存在，则在cookie中添加domain属性，值为domain的值
            if (json.domain) {
                json.domain = '; domain=' + json.domain;
            } else {
                // 如果domain属性不存在，则在cookie中不添加domain属性
                json.domain = '';
            }
            // 如果path属性不存在，则在cookie中设置path属性为'/'
            if (!json.path) {
                json.path = '/';
            }
            // 在http响应头中设置set-cookie，值为id、value、以及之前设置的其他属性的组合
            this.setHeader('set-cookie', id + '=' + value + '; path=' + json.path + json.maxAge + json.expires + json.domain);
        }
        // 在http请求对象req上定义一个clearCookie方法，用于清除特定的cookie
        req.clearCookie = function (id, path = '/') {
            // 在http响应头中设置set-cookie，值为id、空字符串、以及最大年龄为0的组合，这样会使得该cookie立即过期
            this.setHeader('set-cookie', id + '=; maxAge=0; path=' + path);
        }
        // 打印请求的URL，调试用，注释掉这一行可以在生产环境中禁用该功能
        //console.log(req.url);  
        // 使用URL模块创建一个URL对象，包含请求的URL信息，以方便处理和访问URL的各个部分
        let url = new URL(req.url, "http://"+ (req.headers.host || "0.0.0.0"))       req.url = {                href: url.href,            origin: url.origin,            protocol: url.protocol,            username: url.username,            password: url.password,            host: url.host,            hostname: url.hostname,            port: url.port,            pathname: url.pathname,            search: url.search,            searchParams: url.searchParams,            hash: url.hash,            query: url.search.slice(1),            path: url.pathname + url.search       }       req.getQueryVariable = function (variable, err) {  // 在http请求对象req上定义一个getQueryVariable方法，用于获取请求