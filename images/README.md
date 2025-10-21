# 游戏图片资源目录

## 所需图片列表

请将以下图片放在此目录下：

### 1. princess.png - 公主图片
- **尺寸建议**: 200x200像素（或更大，保持方形）
- **要求**: 
  - 正面朝向（面对用户）
  - 表现出被追赶的紧张表情
  - 穿着公主裙装
  - PNG格式，透明背景
- **说明**: 公主会在屏幕下方显示（表示离镜头近），所以会比恐龙大

### 2. dinosaur.png - 恐龙图片
- **尺寸建议**: 150x150像素（或更大，保持方形）
- **要求**:
  - 正面朝向（面对用户）
  - 表现出凶猛的追赶姿态
  - PNG格式，透明背景
- **说明**: 恐龙会在屏幕上方显示（表示距离远），所以会比公主小

### 3. princess-happy.png - 开心的公主（可选）
- **尺寸**: 与princess.png相同
- **要求**: 表现出获救后开心的表情
- **说明**: 如果不提供，将使用princess.png

### 4. dinosaur-defeated.png - 被击败的恐龙（可选）
- **尺寸**: 与dinosaur.png相同
- **要求**: 表现出被击中的样子
- **说明**: 如果不提供，将使用dinosaur.png

## 图片获取建议

1. **AI生成**: 使用 Midjourney、DALL-E、Stable Diffusion 等工具生成
   - 提示词示例（公主）: "cute princess character, front view, worried expression, pink dress, transparent background, game art style"
   - 提示词示例（恐龙）: "fierce dinosaur character, front view, chasing pose, transparent background, game art style"

2. **免费图库**: 
   - OpenGameArt.org
   - itch.io (免费游戏素材)
   - Freepik (需注明来源)

3. **购买素材**: 
   - Unity Asset Store
   - GameArt2D.com

## 使用示例

在游戏代码中加载图片：

```javascript
// 创建图片对象
const image = wx.createImage()
image.src = 'images/princess.png'

// 监听图片加载完成
image.onload = () => {
  console.log('图片加载完成')
  // 在canvas上绘制图片
  ctx.drawImage(image, x, y, width, height)
}

// 监听加载失败
image.onerror = () => {
  console.error('图片加载失败')
}
```

## 注意事项

- 使用 PNG 格式支持透明背景
- 合理压缩图片大小以提升加载速度（建议单张不超过100KB）
- 图片比例尽量保持1:1（正方形）
- 确保图片主体居中，方便在游戏中显示


