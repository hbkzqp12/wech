# 图片资源目录

将游戏所需的图片资源放在此目录下。

## 使用示例

在游戏代码中加载图片：

```javascript
// 创建图片对象
const image = wx.createImage()
image.src = 'images/your-image.png'

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

## 建议

- 使用 PNG 格式支持透明背景
- 合理压缩图片大小以提升加载速度
- 为不同分辨率准备 @2x、@3x 资源

