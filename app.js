﻿/*
 * @Description: 程序入口
 * @Author: icony/精武陈真
 * @Date: 2019-11-19 15:28:27
 * @LastEditTime: 2019-12-09 20:03:36
 * @LastEditors: chenzhen
 */
const Koa = require('koa')
const path = require('path')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const responseTime = require('koa-response-time')
const cors = require('@koa/cors')
const koaJwt = require("koa-jwt")
const { JWT_SECRET_KEY, API_ROOT } = require('./config')
const routes = require('./routes')
const { error } = require('./utils/resultUtil')
const HttpStatus = require('http-status-codes')

// error handler
onerror(app)



// middlewares


app.use(async function(ctx, next) {
  try {
    await next()
    if (ctx.status === 404) {
      ctx.body = error({
        code: HttpStatus.NOT_FOUND, 
        msg: '地址不存在'
      })
    }
  } catch (err) {
    if (err.status == 401) {
      ctx.body = error({
          code: HttpStatus.UNAUTHORIZED, 
          msg: '未授权或过期，请重新登录',
          errMsg: err
        })
    } else {
      ctx.body = error({
        code: HttpStatus.INTERNAL_SERVER_ERROR, 
        msg: '服务内部错误',
        errMsg: err
      })
    }
  }
})



app.use(responseTime())

app.use(cors({
  maxAge: 60*60,
  allowHeaders: ['content-type','Authorization'],
}));

app.use(koaBody({
  multipart:true, // 支持文件上传
  formidable:{
    uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    multipart: true,
    maxFieldsSize:10 * 1024 * 1024, // 文件上传大小
    onFileBegin:(name,file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    },
  }
}))

// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))

// Pretty (non-compressed) json response middleware
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))


const login = new RegExp(`${API_ROOT}/user/login`)
const signup = new RegExp(`${API_ROOT}/user/signup`)
app.use(
  koaJwt({
    secret:JWT_SECRET_KEY
  }).unless({
    path:[login,signup,/^\/public/]
  })
)


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})



// routes
routes(app)

// error-handling
app.on('error', (err, ctx) => {
  ctx.body = {
    code: 200
  }
  console.error('server error', err, ctx)
});

module.exports = app
