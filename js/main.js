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

// 游戏区域配置（中间50%，上下各留25%空白）
const gameArea = {
  top: screenHeight * 0.25,      // 游戏区域顶部
  bottom: screenHeight * 0.75,    // 游戏区域底部
  height: screenHeight * 0.5      // 游戏区域高度
}

// 图片资源
const images = {
  princess: null,
  princessHappy: null,
  dinosaur: null,
  dinosaurDefeated: null
}

// 图片加载状态
let imagesLoaded = false

// 加载图片资源
function loadImages() {
  const imagesToLoad = [
    { key: 'princess', src: 'images/princess.png' },
    { key: 'princessHappy', src: 'images/princess-happy.png' },
    { key: 'dinosaur', src: 'images/dinosaur.png' },
    { key: 'dinosaurDefeated', src: 'images/dinosaur-defeated.png' }
  ]
  
  let loadedCount = 0
  const totalImages = imagesToLoad.length
  
  imagesToLoad.forEach(({ key, src }) => {
    const img = wx.createImage()
    img.src = src
    
    img.onload = () => {
      images[key] = img
      loadedCount++
      console.log(`图片加载成功: ${src}`)
      
      if (loadedCount === totalImages) {
        imagesLoaded = true
        console.log('所有图片加载完成')
      }
    }
    
    img.onerror = () => {
      console.log(`图片加载失败（将使用默认表情）: ${src}`)
      loadedCount++
      
      if (loadedCount === totalImages) {
        imagesLoaded = true
        console.log('图片加载完成（部分使用默认表情）')
      }
    }
  })
}

// 游戏状态
const GAME_STATE = {
  START: 'start',
  PLAYING: 'playing',
  SUCCESS: 'success',
  FAIL: 'fail'
}

let currentState = GAME_STATE.START
let score = 0
let level = 1  // 当前关卡
const BASE_SPEED = 3  // 基础速度
const SPEED_INCREMENT = 1.5  // 每关速度增量

// 兑换按钮对象
const exchangeButton = {
  width: 110,
  height: 40,
  x: 15,  // 左下角，与总分对齐
  y: 0,  // 将在绘制时动态计算（总分下方）
  text: '兑换',
  cost: 1000
}

// 公主对象（在前面，大一些）
const princess = {
  x: screenWidth / 2,
  y: gameArea.bottom - 100,  // 在游戏区域下方
  width: 120,  // 更大
  height: 150,  // 更大
  color: '#FFB6C1',
  imageSize: 100  // 表情符号大小
}

// 恐龙对象（在后面，小一些）
const dinosaur = {
  x: screenWidth / 2,
  y: gameArea.top + 120,  // 在游戏区域上方，表示距离远，避免与分数重叠
  width: 60,  // 更小
  height: 80,  // 更小
  color: '#228B22',
  imageSize: 60  // 表情符号大小
}

// 瞄准器对象
const crosshair = {
  x: screenWidth / 2,
  y: 0,  // 将在初始化时设置
  radius: 20,
  speed: BASE_SPEED,  // 初始速度
  direction: 1, // 1表示向右，-1表示向左
  minX: 50,
  maxX: screenWidth - 50
}

// 初始化瞄准器Y坐标（在恐龙中心）
crosshair.y = dinosaur.y + dinosaur.height / 2

// 初始化函数
function init() {
  console.log('游戏初始化完成')
  console.log('屏幕尺寸:', screenWidth, 'x', screenHeight)
  
  // 加载图片资源
  loadImages()
  
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
  }
}

// 计算当前关卡的速度（每5关一个轮回）
function calculateSpeed() {
  const levelInCycle = ((level - 1) % 5) + 1  // 1-5循环
  return BASE_SPEED + (levelInCycle - 1) * SPEED_INCREMENT
}

// 渲染游戏画面
function render() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制全屏背景
  ctx.fillStyle = '#F5F5F5'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  if (currentState === GAME_STATE.START) {
    drawStartScreen()
  } else if (currentState === GAME_STATE.PLAYING) {
    drawGameScreen()
  } else if (currentState === GAME_STATE.SUCCESS) {
    drawSuccessScreen()
  } else if (currentState === GAME_STATE.FAIL) {
    drawFailScreen()
  }
  
  // 绘制游戏区域边界（可选，如不需要可注释掉）
  drawGameAreaBorder()
}

// 绘制开始画面
function drawStartScreen() {
  // 背景
  drawGradientBackground('#87CEEB', '#E0F6FF')
  
  // 标题（在游戏区域顶部）
  ctx.fillStyle = '#FF1493'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🏰 救救公主 🏰', canvas.width / 2, gameArea.top + gameArea.height * 0.2)
  
  // 说明（在游戏区域中部）
  ctx.fillStyle = '#333'
  ctx.font = '22px Arial'
  ctx.fillText('点击屏幕开始游戏', canvas.width / 2, gameArea.top + gameArea.height * 0.45)
  
  ctx.font = '18px Arial'
  ctx.fillStyle = '#666'
  ctx.fillText('瞄准恐龙射击', canvas.width / 2, gameArea.top + gameArea.height * 0.55)
  ctx.fillText('拯救公主！', canvas.width / 2, gameArea.top + gameArea.height * 0.62)
  
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
  
  // 绘制关卡和分数（在游戏区域内左上角）
  ctx.fillStyle = '#333'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('第 ' + level + ' 关', 15, gameArea.top + 30)
  ctx.font = '18px Arial'
  ctx.fillText('分数: ' + score, 15, gameArea.top + 55)
  
  // 提示文字（在游戏区域内顶部中间）
  ctx.font = '18px Arial'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#333'
  ctx.fillText('点击屏幕射击！', canvas.width / 2, gameArea.top + 40)
}

// 绘制成功画面
function drawSuccessScreen() {
  // 背景
  drawGradientBackground('#FFD700', '#FFA500')
  
  // 成功文字（在游戏区域顶部）
  ctx.fillStyle = '#FF1493'
  ctx.font = 'bold 42px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🎉 公主得救了！🎉', canvas.width / 2, gameArea.top + 50)
  
  ctx.fillStyle = '#333'
  ctx.font = '28px Arial'
  ctx.fillText('第 ' + level + ' 关完成！', canvas.width / 2, gameArea.top + 100)
  
  // 总分显示在左下角
  ctx.font = '22px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('总分: ' + score, 15, gameArea.bottom - 80)
  
  // 绘制兑换按钮（在总分下方）
  drawExchangeButton(gameArea.bottom - 50)
  
  // 绘制被击中的恐龙（在游戏区域中间偏上）
  const defeatedDinoImage = images.dinosaurDefeated || images.dinosaur
  const dinoY = gameArea.top + gameArea.height * 0.38
  if (defeatedDinoImage) {
    // 使用图片
    const drawWidth = dinosaur.width
    const drawHeight = dinosaur.height
    ctx.drawImage(
      defeatedDinoImage,
      screenWidth / 2 - drawWidth / 2,
      dinoY - drawHeight / 2,
      drawWidth,
      drawHeight
    )
  } else {
    // 使用表情符号
    ctx.fillStyle = '#90EE90'
    ctx.font = dinosaur.imageSize + 'px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🦖', screenWidth / 2, dinoY + 15)
  }
  
  // 击中特效
  ctx.font = '40px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('💫', screenWidth / 2 - 40, dinoY - 5)
  ctx.fillText('💫', screenWidth / 2 + 40, dinoY - 5)
  
  // 绘制开心的公主（在下方）
  drawPrincess(true)
  
  // 提示文字（在游戏区域内底部）
  ctx.font = '20px Arial'
  ctx.fillStyle = '#666'
  const nextLevel = level + 1
  ctx.fillText('点击进入第 ' + nextLevel + ' 关', canvas.width / 2, gameArea.bottom - 40)
}

// 绘制失败画面
function drawFailScreen() {
  // 背景
  drawGradientBackground('#696969', '#808080')
  
  // 失败文字（在游戏区域顶部）
  ctx.fillStyle = '#FF0000'
  ctx.font = 'bold 38px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('😱 射偏了！😱', canvas.width / 2, gameArea.top + 50)
  
  ctx.fillStyle = '#FFF'
  ctx.font = '24px Arial'
  ctx.fillText('第 ' + level + ' 关失败！', canvas.width / 2, gameArea.top + 100)
  
  // 总分显示在左下角
  ctx.font = '22px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('总分: ' + score, 15, gameArea.bottom - 80)
  
  // 绘制兑换按钮（在总分下方）
  drawExchangeButton(gameArea.bottom - 50)
  
  // 绘制庆祝的恐龙（在游戏区域中间偏上）
  const dinoY = gameArea.top + gameArea.height * 0.38
  if (images.dinosaur) {
    // 使用图片，稍微放大一些表示庆祝
    const drawWidth = dinosaur.width * 1.3
    const drawHeight = dinosaur.height * 1.3
    ctx.drawImage(
      images.dinosaur,
      screenWidth / 2 - drawWidth / 2,
      dinoY - drawHeight / 2,
      drawWidth,
      drawHeight
    )
  } else {
    // 使用表情符号
    ctx.fillStyle = '#228B22'
    ctx.font = (dinosaur.imageSize * 1.5) + 'px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🦖', screenWidth / 2, dinoY + 15)
  }
  
  // 庆祝特效
  ctx.font = '35px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('🎊', screenWidth / 2 - 50, dinoY - 5)
  ctx.fillText('🎉', screenWidth / 2 + 50, dinoY - 5)
  
  // 绘制伤心的公主（在下方）
  ctx.fillStyle = '#FFB6C1'
  ctx.font = princess.imageSize + 'px Arial'
  ctx.fillText('👸', princess.x, princess.y)
  ctx.font = '50px Arial'
  ctx.fillText('😢', princess.x - 40, princess.y - 30)
  ctx.fillText('😢', princess.x + 40, princess.y - 30)
  
  // 提示文字（在游戏区域内底部）
  ctx.font = '20px Arial'
  ctx.fillStyle = '#FFF'
  ctx.fillText('点击屏幕再试一次', canvas.width / 2, gameArea.bottom - 40)
}

// 绘制公主（在前面，正面朝向，被追赶的样子）
function drawPrincess(happy = false) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // 如果有图片资源，使用图片
  const princessImage = happy ? (images.princessHappy || images.princess) : images.princess
  
  if (princessImage) {
    // 使用图片绘制
    const drawWidth = princess.width
    const drawHeight = princess.height
    ctx.drawImage(
      princessImage,
      princess.x - drawWidth / 2,
      princess.y - drawHeight / 2,
      drawWidth,
      drawHeight
    )
  } else {
    // 使用表情符号作为后备方案
    // 绘制公主身体（粉色裙子）
    ctx.fillStyle = princess.color
    ctx.beginPath()
    ctx.moveTo(princess.x, princess.y - princess.height / 3)
    ctx.lineTo(princess.x - princess.width / 2, princess.y + princess.height / 3)
    ctx.lineTo(princess.x + princess.width / 2, princess.y + princess.height / 3)
    ctx.closePath()
    ctx.fill()
    
    // 绘制公主头部（圆形）
    ctx.fillStyle = '#FFDAB9'
    ctx.beginPath()
    ctx.arc(princess.x, princess.y - princess.height / 3, 30, 0, Math.PI * 2)
    ctx.fill()
    
    // 绘制公主表情（更大）
    ctx.font = princess.imageSize + 'px Arial'
    if (happy) {
      ctx.fillText('😊', princess.x, princess.y - 15)
    } else {
      ctx.fillText('👸', princess.x, princess.y - 15)
    }
  }
}

// 绘制恐龙（在后面，小一些，正面朝向，追赶的样子）
function drawDinosaur(defeated = false) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // 如果有图片资源，使用图片
  const dinosaurImage = defeated ? (images.dinosaurDefeated || images.dinosaur) : images.dinosaur
  
  if (dinosaurImage) {
    // 使用图片绘制
    const drawWidth = dinosaur.width
    const drawHeight = dinosaur.height
    ctx.drawImage(
      dinosaurImage,
      dinosaur.x - drawWidth / 2,
      dinosaur.y - drawHeight / 2,
      drawWidth,
      drawHeight
    )
  } else {
    // 使用表情符号作为后备方案
    // 绘制恐龙身体（绿色）
    ctx.fillStyle = dinosaur.color
    ctx.fillRect(
      dinosaur.x - dinosaur.width / 2,
      dinosaur.y,
      dinosaur.width,
      dinosaur.height
    )
    
    // 绘制恐龙表情（更小）
    ctx.font = dinosaur.imageSize + 'px Arial'
    ctx.fillText('🦖', dinosaur.x, dinosaur.y + 35)
    
    // 绘制愤怒表情
    if (!defeated) {
      ctx.fillStyle = '#FF0000'
      ctx.font = (dinosaur.imageSize / 3) + 'px Arial'
      ctx.fillText('😈', dinosaur.x, dinosaur.y + 10)
    }
  }
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

// 绘制渐变背景（只在游戏区域内）
function drawGradientBackground(color1, color2) {
  const gradient = ctx.createLinearGradient(0, gameArea.top, 0, gameArea.bottom)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  ctx.fillStyle = gradient
  ctx.fillRect(0, gameArea.top, canvas.width, gameArea.height)
}

// 绘制游戏区域边界（调试用）
function drawGameAreaBorder() {
  ctx.strokeStyle = '#CCC'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.strokeRect(0, gameArea.top, canvas.width, gameArea.height)
  ctx.setLineDash([])
}

// 绘制兑换按钮
function drawExchangeButton(yPosition) {
  // 更新按钮Y坐标
  exchangeButton.y = yPosition
  
  // 判断是否有足够的分数
  const canExchange = score >= exchangeButton.cost
  
  // 绘制按钮背景
  ctx.fillStyle = canExchange ? '#4CAF50' : '#999'
  ctx.fillRect(exchangeButton.x, exchangeButton.y, exchangeButton.width, exchangeButton.height)
  
  // 绘制按钮边框
  ctx.strokeStyle = canExchange ? '#45a049' : '#666'
  ctx.lineWidth = 2
  ctx.strokeRect(exchangeButton.x, exchangeButton.y, exchangeButton.width, exchangeButton.height)
  
  // 绘制按钮文字
  ctx.fillStyle = '#FFF'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(exchangeButton.text + ' -' + exchangeButton.cost, 
    exchangeButton.x + exchangeButton.width / 2, 
    exchangeButton.y + exchangeButton.height / 2)
}

// 检测是否点击了兑换按钮
function isClickOnExchangeButton(x, y) {
  return x >= exchangeButton.x && 
         x <= exchangeButton.x + exchangeButton.width &&
         y >= exchangeButton.y && 
         y <= exchangeButton.y + exchangeButton.height
}

// 兑换分数
function exchangeScore() {
  if (score >= exchangeButton.cost) {
    score -= exchangeButton.cost
    console.log('兑换成功！剩余分数: ' + score)
    // 这里可以添加兑换成功的效果或奖励
    return true
  } else {
    console.log('分数不足，无法兑换')
    return false
  }
}

// 检测瞄准器是否对准恐龙
function isCrosshairOnDinosaur() {
  // 判断瞄准器的X坐标是否在恐龙范围内
  const dinosaurLeft = dinosaur.x - dinosaur.width / 2
  const dinosaurRight = dinosaur.x + dinosaur.width / 2
  
  return crosshair.x >= dinosaurLeft && crosshair.x <= dinosaurRight
}

// 射击
function shoot() {
  if (currentState === GAME_STATE.PLAYING) {
    // 立即判定是否击中恐龙
    if (isCrosshairOnDinosaur()) {
      currentState = GAME_STATE.SUCCESS
      // 根据关卡给分，关卡越高分数越高
      score += 100 + (level - 1) * 20
    } else {
      currentState = GAME_STATE.FAIL
    }
  }
}

// 开始游戏或进入下一关
function startGame() {
  currentState = GAME_STATE.PLAYING
  
  // 重置恐龙和瞄准器位置
  dinosaur.x = screenWidth / 2
  crosshair.x = screenWidth / 2
  crosshair.direction = 1
  
  // 根据当前关卡设置速度
  crosshair.speed = calculateSpeed()
  console.log('第 ' + level + ' 关开始，速度: ' + crosshair.speed)
}

// 进入下一关
function nextLevel() {
  level++
  startGame()
}

// 重新开始（失败后）
function restartLevel() {
  startGame()
}

// 监听触摸事件
wx.onTouchStart((e) => {
  const touch = e.touches[0]
  console.log('触摸位置:', touch.clientX, touch.clientY)
  
  // 检查是否点击了兑换按钮（只在成功或失败画面显示）
  if ((currentState === GAME_STATE.SUCCESS || currentState === GAME_STATE.FAIL) &&
      isClickOnExchangeButton(touch.clientX, touch.clientY)) {
    exchangeScore()
    return  // 点击了按钮就不执行其他操作
  }
  
  if (currentState === GAME_STATE.START) {
    startGame()
  } else if (currentState === GAME_STATE.PLAYING) {
    shoot()
  } else if (currentState === GAME_STATE.SUCCESS) {
    // 成功后进入下一关
    nextLevel()
  } else if (currentState === GAME_STATE.FAIL) {
    // 失败后重新开始当前关
    restartLevel()
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

