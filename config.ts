/**
 * 配置图片上传
 * jinzhengkun
 * node 中转
 */
import * as path from 'path';
import * as fs from 'fs';
const crc = require('crc');
export const uploadPath: string = ''; // 中转地址
export const aucode: string = ''; // 可能需要认证参数
export const type = 0;
export const contentType = 'application/octet-stream'; // 上传至jd文件系统，直接以二级制流上传

/**
 * 指定图片暂存地址
 */
const uploadFilePath = path.join(__dirname, '../uploads/');

/**
 * 如果 图片暂存地址 不存在新建该目录
 */
export const existsAndMkdir = async () => {
    const isUploadFilePath = await fs.existsSync(uploadFilePath)
    if (isUploadFilePath) {
        return uploadFilePath;
    } else {
        await fs.mkdirSync(uploadFilePath)
        console.log('node 服务器 图片暂存目前创建成功');
        return uploadFilePath
    }
}

/**
 * 清除文件
 * @param filePath
 */
export const removeImage = async (filePath: string) => {
    await fs.unlinkSync(filePath)
    console.log(`图片: ${path.basename(filePath)} 已经成功上传至京东文件系统，node 服务器下已被清除`);
}

/**
 * 计算文件的16进制值
 * @param filePath
 */
export const sign = async (filePath: string) => {
    const file = await fs.readFileSync(filePath);
    return crc.crc32(file).toString(16)
}
