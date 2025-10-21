// 工具函数库

/**
 * 判断两个矩形是否碰撞
 * @param {Object} rect1 - 矩形1 {x, y, width, height}
 * @param {Object} rect2 - 矩形2 {x, y, width, height}
 * @returns {Boolean} 是否碰撞
 */
export function isCollide(rect1, rect2) {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  )
}

/**
 * 计算两点之间的距离
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 * @returns {Number} 距离
 */
export function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

/**
 * 生成随机整数
 * @param {Number} min - 最小值
 * @param {Number} max - 最大值
 * @returns {Number} 随机整数
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 限制数值在指定范围内
 * @param {Number} value - 数值
 * @param {Number} min - 最小值
 * @param {Number} max - 最大值
 * @returns {Number} 限制后的数值
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}


