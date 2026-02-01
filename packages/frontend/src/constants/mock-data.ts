import type { Pet, Agent, LogEntry } from '../types/pet-management'

export const MOCK_PETS: Pet[] = [
  {
    id: '402',
    name: '小奶油',
    breed: '金吉拉波斯猫',
    level: 12,
    health: 98,
    growthStage: '幼年期',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&h=400&auto=format&fit=crop',
    status: 'monitoring',
    statusLabel: '宠医博守护中',
    age: '2岁3个月',
    birthday: '2021.10.15',
    gender: '女生',
    weight: '3.5kg'
  },
  {
    id: '109',
    name: '旺财',
    breed: '柯基犬',
    level: 8,
    health: 72,
    growthStage: '成年期',
    image: 'https://images.unsplash.com/photo-1513284499445-c8a9150aee97?q=80&w=400&h=400&auto=format&fit=crop',
    status: 'analyzing',
    statusLabel: '营养汪分析中'
  },
  {
    id: '088',
    name: '墨汁',
    breed: '黑足猫',
    level: 24,
    health: 95,
    growthStage: '成年期',
    image: 'https://images.unsplash.com/photo-1511275539165-cc46b1ee8960?q=80&w=400&h=400&auto=format&fit=crop',
    status: 'ready',
    statusLabel: '元气喵待命'
  }
]

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'med',
    name: '宠医博',
    role: '健康管理助手',
    status: 'running',
    lastAction: '2分钟前',
    icon: 'medical_services',
    color: '#22d3ee'
  },
  {
    id: 'nut',
    name: '营养汪',
    role: '营养膳食专家',
    status: 'analyzing',
    lastAction: '正在调配',
    icon: 'restaurant',
    color: '#ee8c2b'
  },
  {
    id: 'act',
    name: '元气喵',
    role: '运动与行为助手',
    status: 'idle',
    lastAction: '1小时前',
    icon: 'bolt',
    color: '#3b82f6'
  }
]

export const MOCK_LOGS: LogEntry[] = [
  {
    id: '1',
    timestamp: '14:22:05',
    agentName: '营养汪',
    agentColor: '#ee8c2b',
    message: '根据 宠医博 的健康扫描结果调整了食谱。Buddy 需要增加 15% 的蛋白质摄入以辅助恢复。',
    type: 'analysis'
  },
  {
    id: '2',
    timestamp: '14:15:10',
    agentName: '元气喵',
    agentColor: '#3b82f6',
    message: '监测到 Luna 活跃度偏低。已计划在 15:00 开启互动激光逗宠模式。',
    type: 'info'
  },
  {
    id: '3',
    timestamp: '13:58:32',
    agentName: '宠医博',
    agentColor: '#22d3ee',
    message: '分析了睡眠模式。REM 循环稳定性验证为 94%,状态良好。',
    type: 'analysis'
  }
]
