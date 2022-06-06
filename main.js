// 引入框架
const express=require('express')
// 实例化
const app=express()
// 解析参数格式
const bodyParser = require('body-parser')
// 跨域
const cors = require('cors')
// 解决跨域问题
app.use(cors());
// 文件路径
const path = require('path')
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// 解析 application/json
app.use(bodyParser.json());
//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})
// 访问
const runserve=require('./router/runserve')
app.use(runserve)
// 静态文件
app.use('/static', express.static(path.join(__dirname, 'static')));
app.listen('8081',(res)=>{
    console.log('Server running http://0.0.0.0:8081');
})