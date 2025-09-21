import { computed } from 'vue'
import { useData } from 'vitepress'

// 加密规则接口
export interface EncryptRule {
  path: string
  password: string
  recursive?: boolean
}

// 加密配置接口
export interface EncryptConfig {
  globalPassword?: string
  rules: EncryptRule[]
}

// 生成密码哈希（简单实现，生产环境建议使用更安全的哈希）
export function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  return hash.toString()
}

// 存储密钥前缀
const STORAGE_PREFIX = 'vitepress-encrypt-'

// 存储已验证的路径
export function storeVerifiedPath(path: string, password: string): void {
  const key = STORAGE_PREFIX + hashPassword(path)
  const value = {
    hash: hashPassword(password),
    timestamp: Date.now()
  }
  localStorage.setItem(key, JSON.stringify(value))
}

// 检查路径是否已验证
export function isPathVerified(path: string, password: string): boolean {
  const key = STORAGE_PREFIX + hashPassword(path)
  const stored = localStorage.getItem(key)
  
  if (!stored) return false
  
  try {
    const { hash, timestamp } = JSON.parse(stored)
    // 检查是否过期（24小时）
    const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000
    if (isExpired) {
      localStorage.removeItem(key)
      return false
    }
    
    return hash === hashPassword(password)
  } catch {
    return false
  }
}

// 清除所有验证状态
export function clearAllVerified(): void {
  const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX))
  keys.forEach(key => localStorage.removeItem(key))
}

// 路径匹配函数
export function matchPath(pattern: string, path: string): boolean {
  // 处理通配符匹配
  if (pattern.includes('*')) {
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\//g, '\\/')
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(path)
  }
  
  // 精确匹配或前缀匹配
  return path === pattern || path.startsWith(pattern)
}

// 获取当前路径的加密规则
export function useEncryptRule() {
  const { site, page } = useData()
  
  return computed(() => {
    const encryptConfig = (site.value.themeConfig as any)?.encrypt as EncryptConfig
    if (!encryptConfig) return null
    
    const currentPath = page.value.relativePath.replace(/\.md$/, '.html')
    const normalizedPath = '/' + currentPath.replace(/\/index\.html$/, '/')
    
    // 查找匹配的规则
    for (const rule of encryptConfig.rules) {
      if (matchPath(rule.path, normalizedPath)) {
        return rule
      }
    }
    
    return null
  })
}

// 验证密码
export function verifyPassword(rule: EncryptRule, inputPassword: string): boolean {
  return rule.password === inputPassword
} 