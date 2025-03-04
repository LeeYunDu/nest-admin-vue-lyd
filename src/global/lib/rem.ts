// 配置基本大小
let baseSize = 16

// 设置 rem 函数
function setRem() {
  // let scaleW = document.documentElement.clientWidth / 1920;
  let scaleH = document.documentElement.clientHeight / 1080
  let scale = scaleH
  // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}

// 适配 - 重置函数
function resetRem(num) {
  if (num) baseSize = Number(num)
  setRem()
}

export default {
  install(app) {
    window.resetRem = resetRem // 全局可调用
    setRem() //初始化
    // 改变窗口大小时重置 rem
    window.onresize = function () {
      setRem()
    }
  }
}
