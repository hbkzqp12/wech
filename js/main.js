// 游戏主逻辑文件

// 获取系统信息
const systemInfo = wx.getSystemInfoSync()
const screenWidth = systemInfo.windowWidth
const screenHeight = systemInfo.windowHeight

// 创建canvas上下文
const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

// 设置canvas尺寸
canvas.width = screenWidth
canvas.height = screenHeight

// 游戏状态
let gameRunning = true

// 初始化函数
function init() {
  console.log('游戏初始化完成')
  console.log('屏幕尺寸:', screenWidth, 'x', screenHeight)
  
  // 启动游戏循环
  gameLoop()
}

// 游戏主循环
function gameLoop() {
  if (!gameRunning) return
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制背景
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制欢迎文字
  ctx.fillStyle = '#333'
  ctx.font = '32px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('欢迎来到微信小游戏', canvas.width / 2, canvas.height / 2 - 40)
  
  ctx.font = '20px Arial'
  ctx.fillStyle = '#666'
  ctx.fillText('点击屏幕开始游戏', canvas.width / 2, canvas.height / 2 + 20)
  
  // 继续循环
  requestAnimationFrame(gameLoop)
}

// 监听触摸事件
wx.onTouchStart((e) => {
  const touch = e.touches[0]
  console.log('触摸位置:', touch.clientX, touch.clientY)
  // 在这里添加游戏交互逻辑
})

wx.onTouchMove((e) => {
  const touch = e.touches[0]
  // 处理滑动事件
})

wx.onTouchEnd((e) => {
  // 处理触摸结束事件
})

// 监听游戏显示
wx.onShow(() => {
  console.log('游戏显示')
  gameRunning = true
  gameLoop()
})

// 监听游戏隐藏
wx.onHide(() => {
  console.log('游戏隐藏')
  gameRunning = false
})

// 启动游戏
init()

