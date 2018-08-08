/**
 * @Author: jinzhengkun
 * @Date: 2018-06-19 15:53:43
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-07-31 19:42:56
 */
import * as koa from 'koa';

export interface IParams {
    ctx: koa.Context;
    message: string;
    err?: any;
    result?: any;
}

export const resError = (
    {ctx, message = '请求失败, 服务器内部错误，请联系管理员', err = ''}: IParams
) => {
    ctx.body = {code: 1, message, success: false,  debug: err };
};

export const resSuccess = (
    { ctx, message = '请求成功', result = ''}: IParams
) => {
    ctx.response.body = { code: 0, message, success: true, result };
};

export const resValidate = (
    {ctx, message = '接口协议出错', result = ''}: IParams
) => {
    ctx.response.body = { code: 2, message, success: false, result };
};
