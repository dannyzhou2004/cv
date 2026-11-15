import type { Resume } from './types';

/** 简体中文内容 —— 与 resume.en.ts 结构 1:1 对应（无新增事实）。 */
export const zh: Resume = {
  lang: 'zh',
  htmlLang: 'zh-CN',
  meta: {
    title: '周悦杨 ZHOU YUEYANG — 电气工程 · 电力电子与拖动控制',
    description:
      '周悦杨（ZHOU YUEYANG）的个人简历：电气工程及其自动化专业工学学士（中德合作办学项目），上海理工大学（USST）专业排名 1/51，曾赴汉堡应用技术大学（HAW Hamburg）交流学习。方向为电力电子、拖动控制与工业自动化。',
    ogLocale: 'zh_CN',
  },
  ui: {
    nav: {
      about: '概况',
      education: '教育',
      experience: '实习',
      projects: '项目',
      honours: '荣誉',
      skills: '技能',
      languages: '语言',
    },
    sections: {
      about: '概况',
      education: '教育背景',
      experience: '实习经历',
      projects: '项目经历',
      honours: '荣誉奖项',
      skills: '专业技能',
      languages: '语言能力',
      coursework: '相关课程',
      contact: '联系方式',
    },
    labels: {
      supervisor: '指导教师',
      expected: '预计',
      playMusic: '播放背景音乐',
      pauseMusic: '暂停背景音乐',
      soundHint: '点击开启声音',
      switchLanguage: '切换语言',
      copyEmail: '复制邮箱',
      copied: '已复制',
      backToTop: '返回顶部',
      menu: '菜单',
      close: '关闭',
      print: '打印 / 存为 PDF',
    },
    footer: '基于 Astro 构建 · 托管于 GitHub Pages',
  },
  person: {
    name: 'ZHOU YUEYANG',
    nameZh: '周悦杨',
    title: '电气工程及其自动化（工学学士）· 中德合作项目',
    tagline:
      '专注电力电子、拖动控制与工业自动化——在上海与汉堡之间求学，也努力成为两个方向之间的桥梁。',
    location: '中国广东 · 上海 / 汉堡',
    phones: [],
    emails: ['Dannyzhou0218@gmail.com', '1532319620@qq.com'],
    links: [],
  },
  stats: [
    { value: '第 1 名', label: '专业排名', note: '共 51 人' },
    { value: '91.74', label: '加权平均分', note: '满分 100' },
    { value: '4.0', label: 'GPA', note: '满分 4.5 · 最高档' },
    { value: '66', label: '德语授课学分', note: '累计已修 250.5 学分' },
  ],
  education: [
    {
      org: '上海理工大学（USST）',
      orgSub: '上海-汉堡学院',
      place: '上海，中国',
      degree: '电气工程及其自动化 工学学士 · 中德合作项目',
      period: '2023.09 — 2027.07（预计）',
      bullets: [
        '**专业排名 1/51** · 加权平均分 **91.74/100** · GPA **4.0/4.5**（最高档）· 已修 **199/250.5** 学分',
        '德语、中文双语授课；**已完成 66 个德语授课学分**',
      ],
    },
    {
      org: '汉堡应用技术大学（HAW Hamburg）',
      orgSub: 'Hochschule für Angewandte Wissenschaften Hamburg',
      place: '汉堡，德国',
      degree: '交换学习 · 电气工程',
      period: '2025.09 — 2026.02 · 2026.11 — 2027.03',
      bullets: [
        '2025/26 与 2026/27 学年共安排两个交换学期；**2024 年暑期学校**',
      ],
    },
  ],
  experience: [
    {
      org: '广东广船国际海洋科技研究院',
      orgSub: '广州船舶国际（CSSC）',
      place: '广州，中国',
      role: '助理电气工程师',
      period: '2025.06 — 2025.08',
      bullets: [
        '为新造船项目搭建 **SRtP（安全返港）** 文件体系框架',
        '依据 IMO 安全返港要求，编制**船舶机械装置电气部分的 SRtP 文件**',
      ],
    },
  ],
  projects: [
    {
      title: '基于计算机视觉的遥感智能无人机巡检系统',
      role: '团队负责人',
      supervisor: 'Bin Chen',
      bullets: [
        '**铜奖** · 中国国际大学生创新大赛（2025）高教主赛道、国际项目',
        '**答辩主讲人**；负责计算机视觉流程的**数据集准备与标注**',
      ],
    },
  ],
  awards: [
    {
      title: '上海市奖学金',
      detail: '上海市教育委员会 · 市级',
      year: '2024–25',
    },
    {
      title: '铜奖',
      detail: '中国国际大学生创新大赛 · 国家级',
      year: '2025',
    },
    {
      title: 'DAAD 奖学金',
      detail: '2024 年暑期课程（国际）· 2026–27 年海外实习',
      year: '2024 · 2026',
    },
    {
      title: '优秀奖',
      detail: '第四届“沪江杯”科技翻译大赛 · 中译德',
      year: '2025',
    },
    {
      title: '优秀学生奖学金一等奖（×2）及特等奖',
      detail: '上海理工大学 · 德语辅导教师',
    },
  ],
  skills: [
    { group: '电力电子', items: ['整流器', '逆变器', '四象限变流器（4QS）'] },
    { group: '电机与拖动', items: ['直流电机', '异步电机（感应电机）', '变压器'] },
    {
      group: '控制',
      items: ['PID', '模最优（Magnitude optimum）', '对称最优（Symmetric optimum）', '拖动控制串级调节回路整定'],
    },
    { group: '自动化', items: ['PLC 编程', '嵌入式系统', '传感器与测量'] },
    {
      group: '软件与实验',
      items: ['MATLAB/Simulink', 'C 语言（Visual Studio 2022）', 'Java（IntelliJ IDEA）', '西门子 PLC', '数字控制'],
    },
  ],
  coursework: [
    { group: '电机与拖动', items: ['电力拖动（德语授课）— A'] },
    {
      group: '电力电子',
      items: ['电力电子（德语授课）— A', '电路 I 与 II（德语授课）', '模拟电路', '数字系统'],
    },
    {
      group: '控制与自动化',
      items: [
        '自动控制原理（德语授课）— A',
        '数字控制（德语授课）— A',
        '可编程工业控制系统',
        '嵌入式系统',
        '传感器技术',
      ],
    },
    {
      group: '编程与数学',
      items: ['高级 C 语言程序设计（德语授课）', '高等数学 A(1)(2)', '线性代数 B', '概率论与数理统计 B'],
    },
  ],
  languages: [
    { name: '英语', level: 'IELTS 7.5', detail: '听力 8.5 · 阅读 7.5 · 写作 6.5 · 口语 6.5', score: 78 },
    { name: '德语', level: '歌德 B2 · TestDaF', detail: '听力 4 · 口语 4 · 阅读 4 · 写作 3', score: 66 },
    { name: '中文', level: '母语', detail: '普通话 · 粤语', score: 100 },
  ],
};
