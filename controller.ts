import { Context } from 'koa';
import { resError, resSuccess, resValidate } from './response';
const Rp = require('request-promise');
import * as fs from 'fs'
import {
    uploadPath as url,
    aucode,
    type,
    contentType,
    existsAndMkdir,
    removeImage,
    sign
} from './config';
import * as path from 'path';

export default class FileUploadController {
    public static async uploadImage (ctx: Context) {
        const uploadNodeResult = await FileUploadController.uploadNode(ctx);
        // @ts-ignore
        if (uploadNodeResult && uploadNodeResult.filePath && uploadNodeResult.size) {
            // @ts-ignore
            const keycode = await sign(uploadNodeResult.filePath)
            // @ts-ignore
            const uploadResult = await FileUploadController.upload(uploadNodeResult.filePath, `${keycode}${uploadNodeResult.size}_`)
            // @ts-ignore
            removeImage(uploadNodeResult.filePath); // 清楚node图片
            resSuccess({ctx, result: uploadResult, message: '图片上传成功'})
        } else {
            // @ts-ignore
            resError({ctx, message: '图片上传失败', err: uploadNodeResult.error})
        }
    }

    /**
     * 上传至京东文件系统
     * @param filePath
     */
    public static async upload (filePath: any, keycode: string) {
        const options = {
            url,
            method: 'POST',
            body: fs.createReadStream(filePath),
            headers: {
                type,
                aucode,
                keycode,
                'Content-Type': contentType
            }
        };
        const uploadRes = await Rp(options).then((res: any) => {
            // 上传成功之后清楚 node 上的图片
            return JSON.parse(res)[0]
        });
        if (uploadRes && (uploadRes.id === '1' || uploadRes.id === 1)) {
            return uploadRes
        } else {
            return '图片上传失败'
        }
    }

    /**
     * 上传至 node 服务器
     * @param ctx
     */
    public static async uploadNode (ctx: Context) {
        // @ts-ignore
        const file = ctx.request.files.file;
        const serverPath = await existsAndMkdir() // node 服务器 图片暂存目录
        /**
         * 通过 Promise 机制，做到文件读入和写入同步
         */
        return new Promise((resolve, reject) => {
            const readStream: any = fs.createReadStream(file.path);
            const filePath: string = path.join(serverPath, file.name)
            const writeStream: any = fs.createWriteStream(filePath);

            readStream.once("open", () => {
                console.log('可读流已经打开');
            })

            readStream.once("close", () => {
                console.log('可读流已经关闭');
                writeStream.end()
            })

            writeStream.once("open", () => {
                console.log('可写流已经打开');
            })

            writeStream.once("close", () => {
                console.log('可写流已经关闭');
                resolve({
                    filePath,
                    size: file.size
                })
            })

            readStream.on("data", (data: any) => {
                writeStream.write(data)
            })

            writeStream.on("error", (error: any) => {
                reject({
                    error
                })
            })

            readStream.on("error", (error: any) => {
                reject({
                    error
                })
            })
        })
    }
}
