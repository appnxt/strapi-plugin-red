import './red.js';
import RED from 'node-red';
const { createProxyMiddleware } = require('http-proxy-middleware');
const k2c = require('koa2-connect');
const proxy = k2c(createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    ws: true,
})); 

const register = ({ strapi }) => {
  strapi.server.use(async (ctx, next) => {
    if (ctx.path.match(new RegExp(`^${RED.settings.httpAdminRoot}/`))) {  
      const jwtToken = ctx.cookies.get('jwtToken');
      const {payload, isValid} = strapi.service('admin::token').decodeJwtToken(jwtToken);
      if(isValid){
        const user = await strapi.service('admin::user').findOne(payload.id);
        const hasSuperAdminRole = strapi.service('admin::role').hasSuperAdminRole(user);
        if(hasSuperAdminRole){
          return proxy(ctx, next);
        }
      } else {
        const { hash } = strapi.service('admin::api-token');
        const tokenService = strapi.service('admin::api-token');
        const token = ctx.request.headers.authorization?.split(' ')[1];
        const apiToken = await tokenService.getBy({ accessKey: hash(token) });
        if(apiToken.permissions.includes('plugin::red.controller.index')){
          return proxy(ctx, next);
        }        
      }
      return ctx.forbidden();
    } 
    return next();  
  });
};

export default register;
