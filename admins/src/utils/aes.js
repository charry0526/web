// 引入库
import CryptoJS from 'crypto-js'
import { getUUID } from './base.js'

// 加密格式
const cfg = {
  // iv: CryptoJS.enc.Utf8.parse("76b0bd54dd08a02e"),//偏移量, mode === ECB 时, 不需要 iv，随机秘钥MD5后取16个字符（小写）。这里前后端写死了
  mode: CryptoJS.mode.ECB, //可取值(CBC, CFB, CTR, CTRGladman, OFB, ECB)
  padding: CryptoJS.pad.Pkcs7// 填充方式, 可取值(Pkcs7, AnsiX923, Iso10126, Iso97971, ZeroPadding, NoPadding)
}
// 对称加密
export const encAes = (message, key) => {
  let keyBytes = CryptoJS.enc.Utf8.parse(key)
  const ciphertext = CryptoJS.AES.encrypt(message, keyBytes, cfg).toString()
  return ciphertext
}
// 对称解密
export const decAes = (message, key) => {
  let keyBytes = CryptoJS.enc.Utf8.parse(key)
  const plaintext = CryptoJS.AES.decrypt(message, keyBytes, cfg).toString(CryptoJS.enc.Utf8); return plaintext
}
// 生成随机密钥
export const genRandKey = () => {
  return CryptoJS.MD5(getUUID()).toString().toUpperCase()
}
