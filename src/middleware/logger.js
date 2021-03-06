/*
 * @Description: 日志中间件
 * @Author: chenzhen
 * @Date: 2019-12-11 16:25:57
 * @LastEditTime: 2019-12-12 23:18:35
 * @LastEditors: chenzhen
 */

const { getLogger } = require('../utils/log4jsUtil')
const logger = getLogger()
// module.exports =  function(ctx, next) {
//   log4js.connectLogger(getLogger(), {
// 		format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]'//自定义输出格式
//   })(ctx.req, ctx.res, next)
// }


module.exports =  async function(ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  const userAgent= ctx.header['user-agent']
  logger.info(`[${ctx.ip} ${ctx.method} ${ctx.url} ${ms}ms] [${userAgent}]`)
}
