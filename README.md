# 微信小游戏项目

这是一个微信小游戏项目的基础模板。

## 项目结构

```
wech/
├── game.json                    # 游戏配置文件
├── game.js                      # 游戏入口文件
├── project.config.json          # 项目配置文件
├── project.private.config.json  # 私有配置文件
├── js/                          # JavaScript源码目录
│   ├── main.js                  # 主逻辑文件
│   └── utils.js                 # 工具函数库
└── images/                      # 图片资源目录
```

## 开发说明

1. 使用微信开发者工具打开项目
2. 在 `js/main.js` 中编写游戏逻辑
3. 在 `game.json` 中配置游戏参数

## 主要文件说明

- **game.json**: 配置游戏的屏幕方向、状态栏显示等全局参数
- **game.js**: 游戏入口，引入主逻辑文件
- **js/main.js**: 游戏主循环和核心逻辑
- **js/utils.js**: 常用工具函数（碰撞检测、距离计算等）

## 开始开发

项目已经包含一个基础的游戏循环和触摸事件监听，你可以在此基础上开发自己的游戏逻辑。

## API文档

微信小游戏官方文档：https://developers.weixin.qq.com/minigame/dev/guide/
