import sm4 from 'gm-crypt'

const pwdKey = 'zjhcbaitukj@2013' // 密钥  前后端一致即可,后端提供
// const iv = '28575a0d1ed14d23'; //初始化加密函数的变量，也叫初始向量
const sm4Config = {
  key: pwdKey, //这里这个key值要与后端的一致，后端解密是根据这个key
  mode: 'ecb', // 加密的方式有两种，ecb和cbc两种，也是看后端如何定义的，不过要是cbc的话下面还要加一个iv的参数，ecb不用
  // iv: iv, //iv是cbc模式的第二个参数，也需要跟后端配置的一致 iv是initialization vector的意思，就是加密的初始矢量，初始化加密函数的变量，也叫初始向量。（本来应该动态生成的，由于项目没有严格的加密要求，直接写死一个）
  outType: 'base64'
}

const sm4Util = new sm4.sm4(sm4Config) // new一个sm4函数，将上面的sm4Config作为参数传递进去。

/*
 * 加密工具函数
 * @param {String} text 待加密文本
 */
export function encrypt(text) {
  return sm4Util.encrypt(text)
}

/*
 * 解密工具函数
 * @param {String} text 待解密密文
 */
export function decrypt(text) {
  return sm4Util.decrypt(text)
}
