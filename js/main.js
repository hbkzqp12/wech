// 游戏主逻辑文件 - 射击救公主

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
const GAME_STATE = {
  START: 'start',
  PLAYING: 'playing',
  SUCCESS: 'success',
  FAIL: 'fail'
}

let currentState = GAME_STATE.START
let score = 0

// 公主对象
const princess = {
  x: screenWidth / 2,
  y: screenHeight - 80,
  width: 60,
  height: 80,
  color: '#FFB6C1'
}

// 恐龙对象
const dinosaur = {
  x: screenWidth / 2,
  y: screenHeight / 2 - 50,
  width: 80,
  height: 100,
  color: '#228B22'
}

// 瞄准器对象
const crosshair = {
  x: screenWidth / 2,
  y: dinosaur.y + dinosaur.height / 2,
  radius: 20,
  speed: 3,
  direction: 1, // 1表示向右，-1表示向左
  minX: 50,
  maxX: screenWidth - 50
}

// 子弹对象
let bullet = null

// 初始化函数
function init() {
  console.log('游戏初始化完成')
  console.log('屏幕尺寸:', screenWidth, 'x', screenHeight)
  
  // 启动游戏循环
  gameLoop()
}

// 游戏主循环
function gameLoop() {
  // 更新游戏状态
  update()
  
  // 绘制游戏画面
  render()
  
  // 继续循环
  requestAnimationFrame(gameLoop)
}

// 更新游戏逻辑
function update() {
  if (currentState === GAME_STATE.PLAYING) {
    // 更新瞄准器位置
    crosshair.x += crosshair.speed * crosshair.direction
    
    // 瞄准器到达边界时反向
    if (crosshair.x <= crosshair.minX || crosshair.x >= crosshair.maxX) {
      crosshair.direction *= -1
    }
    
    // 更新子弹
    if (bullet) {
      bullet.y -= bullet.speed
      
      // 检查子弹是否命中恐龙
      if (isHit(bullet, dinosaur)) {
        currentState = GAME_STATE.SUCCESS
        score += 100
        bullet = null
      }
      
      // 子弹飞出屏幕
      if (bullet && bullet.y < 0) {
        currentState = GAME_STATE.FAIL
        bullet = null
      }
    }
  }
}

// 渲染游戏画面
function render() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  if (currentState === GAME_STATE.START) {
    drawStartScreen()
  } else if (currentState === GAME_STATE.PLAYING) {
    drawGameScreen()
  } else if (currentState === GAME_STATE.SUCCESS) {
    drawSuccessScreen()
  } else if (currentState === GAME_STATE.FAIL) {
    drawFailScreen()
  }
}

// 绘制开始画面
function drawStartScreen() {
  // 背景
  drawGradientBackground('#87CEEB', '#E0F6FF')
  
  // 标题
  ctx.fillStyle = '#FF1493'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🏰 救救公主 🏰', canvas.width / 2, canvas.height / 3)
  
  // 说明
  ctx.fillStyle = '#333'
  ctx.font = '22px Arial'
  ctx.fillText('点击屏幕开始游戏', canvas.width / 2, canvas.height / 2)
  
  ctx.font = '18px Arial'
  ctx.fillStyle = '#666'
  ctx.fillText('瞄准恐龙射击', canvas.width / 2, canvas.height / 2 + 50)
  ctx.fillText('拯救公主！', canvas.width / 2, canvas.height / 2 + 80)
  
  // 绘制示例公主
  drawPrincess()
}

// 绘制游戏画面
function drawGameScreen() {
  // 背景
  drawGradientBackground('#FFE4E1', '#FFF0F5')
  
  // 绘制公主
  drawPrincess()
  
  // 绘制恐龙
  drawDinosaur()
  
  // 绘制瞄准器
  drawCrosshair()
  
  // 绘制子弹
  if (bullet) {
    drawBullet()
  }
  
  // 绘制分数
  ctx.fillStyle = '#333'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('分数: ' + score, 20, 40)
  
  // 提示文字
  ctx.font = '18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('点击屏幕射击！', canvas.width / 2, 40)
}

// 绘制成功画面
function drawSuccessScreen() {
  // 背景
  drawGradientBackground('#FFD700', '#FFA500')
  
  // 绘制开心的公主
  drawPrincess(true)
  
  // 绘制被击中的恐龙
  ctx.fillStyle = '#90EE90'
  ctx.font = '80px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('🦖', screenWidth / 2 + 20, dinosaur.y + 50)
  ctx.fillText('💫', dinosaur.x, dinosaur.y - 20)
  
  // 成功文字
  ctx.fillStyle = '#FF1493'
  ctx.font = 'bold 42px Arial'
  ctx.fillText('🎉 公主得救了！🎉', canvas.width / 2, canvas.height / 3)
  
  ctx.fillStyle = '#333'
  ctx.font = '28px Arial'
  ctx.fillText('得分: ' + score, canvas.width / 2, canvas.height / 3 + 60)
  
  ctx.font = '20px Arial'
  ctx.fillStyle = '#666'
  ctx.fillText('点击屏幕继续游戏', canvas.width / 2, canvas.height - 60)
}

// 绘制失败画面
function drawFailScreen() {
  // 背景
  drawGradientBackground('#696969', '#808080')
  
  // 绘制伤心的公主
  ctx.fillStyle = '#FFB6C1'
  ctx.font = '60px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('👸', princess.x, princess.y + 30)
  ctx.fillText('😢', princess.x, princess.y - 30)
  
  // 绘制庆祝的恐龙
  ctx.fillStyle = '#228B22'
  ctx.font = '90px Arial'
  ctx.fillText('🦖', screenWidth / 2, dinosaur.y + 60)
  ctx.fillText('🎊', dinosaur.x - 50, dinosaur.y)
  ctx.fillText('🎉', dinosaur.x + 50, dinosaur.y)
  
  // 失败文字
  ctx.fillStyle = '#FF0000'
  ctx.font = 'bold 38px Arial'
  ctx.fillText('😱 射偏了！😱', canvas.width / 2, canvas.height / 3)
  
  ctx.fillStyle = '#333'
  ctx.font = '24px Arial'
  ctx.fillText('恐龙逃脱了...', canvas.width / 2, canvas.height / 3 + 60)
  
  ctx.font = '20px Arial'
  ctx.fillStyle = '#666'
  ctx.fillText('点击屏幕再试一次', canvas.width / 2, canvas.height - 60)
}

// 绘制公主
function drawPrincess(happy = false) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // 绘制公主身体
  ctx.fillStyle = princess.color
  ctx.beginPath()
  ctx.moveTo(princess.x, princess.y)
  ctx.lineTo(princess.x - princess.width / 2, princess.y + princess.height / 2)
  ctx.lineTo(princess.x + princess.width / 2, princess.y + princess.height / 2)
  ctx.closePath()
  ctx.fill()
  
  // 绘制公主表情
  ctx.font = '50px Arial'
  if (happy) {
    ctx.fillText('😊', princess.x, princess.y - 10)
  } else {
    ctx.fillText('👸', princess.x, princess.y - 10)
  }
}

// 绘制恐龙
function drawDinosaur() {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // 绘制恐龙身体
  ctx.fillStyle = dinosaur.color
  ctx.fillRect(
    dinosaur.x - dinosaur.width / 2,
    dinosaur.y,
    dinosaur.width,
    dinosaur.height
  )
  
  // 绘制恐龙表情
  ctx.font = '70px Arial'
  ctx.fillText('🦖', dinosaur.x, dinosaur.y + 40)
  
  // 绘制眼睛和牙齿
  ctx.fillStyle = '#FF0000'
  ctx.font = '20px Arial'
  ctx.fillText('😈', dinosaur.x, dinosaur.y + 10)
}

// 绘制瞄准器
function drawCrosshair() {
  ctx.strokeStyle = '#FF0000'
  ctx.lineWidth = 3
  
  // 外圈
  ctx.beginPath()
  ctx.arc(crosshair.x, crosshair.y, crosshair.radius, 0, Math.PI * 2)
  ctx.stroke()
  
  // 十字线
  ctx.beginPath()
  ctx.moveTo(crosshair.x - crosshair.radius - 5, crosshair.y)
  ctx.lineTo(crosshair.x + crosshair.radius + 5, crosshair.y)
  ctx.moveTo(crosshair.x, crosshair.y - crosshair.radius - 5)
  ctx.lineTo(crosshair.x, crosshair.y + crosshair.radius + 5)
  ctx.stroke()
  
  // 中心点
  ctx.fillStyle = '#FF0000'
  ctx.beginPath()
  ctx.arc(crosshair.x, crosshair.y, 3, 0, Math.PI * 2)
  ctx.fill()
}

// 绘制子弹
function drawBullet() {
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2)
  ctx.fill()
  
  // 子弹光晕
  ctx.strokeStyle = '#FFA500'
  ctx.lineWidth = 2
  ctx.stroke()
}

// 绘制渐变背景
function drawGradientBackground(color1, color2) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// 检测子弹是否命中恐龙
function isHit(bullet, target) {
  const dx = bullet.x - target.x
  const dy = bullet.y - (target.y + target.height / 2)
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  return distance < (bullet.radius + target.width / 2)
}

// 射击
function shoot() {
  if (currentState === GAME_STATE.PLAYING && !bullet) {
    bullet = {
      x: crosshair.x,
      y: crosshair.y,
      radius: 8,
      speed: 10
    }
  }
}

// 开始游戏
function startGame() {
  currentState = GAME_STATE.PLAYING
  bullet = null
  
  // 重置恐龙和瞄准器位置
  dinosaur.x = screenWidth / 2
  crosshair.x = screenWidth / 2
  crosshair.direction = 1
}

// 监听触摸事件
wx.onTouchStart((e) => {
  const touch = e.touches[0]
  console.log('触摸位置:', touch.clientX, touch.clientY)
  
  if (currentState === GAME_STATE.START) {
    startGame()
  } else if (currentState === GAME_STATE.PLAYING) {
    shoot()
  } else if (currentState === GAME_STATE.SUCCESS || currentState === GAME_STATE.FAIL) {
    startGame()
  }
})

// 监听游戏显示
wx.onShow(() => {
  console.log('游戏显示')
})

// 监听游戏隐藏
wx.onHide(() => {
  console.log('游戏隐藏')
})

// 启动游戏
init()

