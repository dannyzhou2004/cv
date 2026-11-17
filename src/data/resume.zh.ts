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
      moreProjects: '在 GitHub 查看全部项目',
      updated: '最近更新',
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
      '以电气工程与自动化为基础，聚焦机器人，并向具身智能延伸：电力电子、运动控制与嵌入式系统的交叉实践。',
    location: '广东佛山',
    hobbies: ['国画', '健身', '长跑'],
    phones: [],
    emails: ['Dannyzhou0218@gmail.com', '1532319620@qq.com'],
    links: [
      { label: 'GitHub 项目', href: 'https://github.com/dannyzhou2004' },
    ],
  },
  stats: [
    { value: '第 1 名', label: '专业排名', note: '共 51 人' },
    { value: '91.74', label: '加权平均分', note: '满分 100' },
    { value: '4.0', label: 'GPA', note: '满分 4.5 · 最高档' },
    { value: '26%', label: '德语授课学分占比', note: '占 250.5 总学分' },
  ],
  education: [
    {
      org: '上海理工大学（USST）',
      orgSub: '中德国际学院（SHC）',
      place: '上海，中国',
      degree: '电气工程及其自动化 工学学士 · 中德合作项目（本科在读，预计 2027.07 毕业）',
      period: '2023.09 — 2027.07（预计）',
      bullets: [
        '**专业排名 1/51** · 加权平均分 **91.74/100** · GPA **4.0/4.5**（最高档）· **德语授课学分占总学分 26%**',
      ],
    },
    {
      org: '汉堡应用技术大学（HAW Hamburg）',
      orgSub: 'Hochschule für Angewandte Wissenschaften Hamburg',
      place: '汉堡，德国',
      degree: '交换学习 · 电气工程',
      period: '2025.09 — 2026.02 · 2026.11 — 2027.03',
      bullets: [
        '2025/26 与 2026/27 学年共安排两个交换学期；2024 年暑期学校',
      ],
    },
    {
      org: '佛山市第一中学',
      orgSub: 'Foshan No. 1 High School',
      place: '佛山，中国',
      degree: '中学阶段',
      period: '2019.09 — 2023.06',
      bullets: ['担任班长、体育部部长'],
      subEntries: [
        {
          period: '2021.09 — 2022.06',
          org: '瑞士沙夫豪森州立中学',
          orgSub: 'Kantonsschule Schaffhausen · AFS 国际文化交流项目',
          place: '沙夫豪森，瑞士',
          text: '一年交换：就读于瑞士公立文理中学（Kantonsschule Schaffhausen），全程德语浸润，入住 AFS 寄宿家庭。',
        },
      ],
    },
  ],
  experience: [
    {
      org: 'Stucke Elektronik GmbH',
      orgSub: 'stuckeGROUP · 汉堡 · 必修实习学期 · DAAD 全额奖学金资助',
      place: '汉堡，德国',
      role: '研发部门 · 硬件工程师',
      period: '2026.11 — 2027.03',
      bullets: [
        '使用 **STM32H753ZI** 与 **Arduino Nano** 开发并完善 **Morticron 波形发生器**固件',
        '负责**新功能验证与添加**、**固件适配**与烧录',
        '完成整机组装与调试，覆盖从板级 bring-up 到系统级测试',
      ],
    },
    {
      org: '广东广船国际海洋科技研究院',
      place: '广州，中国',
      role: '助理电气工程师',
      period: '2025.06 — 2025.08',
      bullets: [
        '为新造船项目编纂 **SRtP（安全返港）文件体系框架**，覆盖**电气部分**与**轮机电气部分**，符合 IMO 安全返港要求',
      ],
    },
  ],
  projects: [
    {
      title: 'Morticron 波形发生器 — 固件与硬件',
      role: '硬件工程师 · Stucke Elektronik',
      bullets: [
        '使用 **STM32H753ZI** 与 **Arduino Nano** 开发并扩展波形发生器固件',
        '**新功能验证与实现**、固件适配、烧录，以及整机组装与调试',
      ],
    },
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
      title: 'DAAD 奖学金 — 海外实习学期（Praxissemester）',
      detail: 'DAAD 资助汉堡必修实习学期（18 周）· 992 €/月 + 差旅补贴',
      year: '2026–27',
    },
    {
      title: '铜奖',
      detail: '中国国际大学生创新大赛 · 国家级',
      year: '2025',
    },
    {
      title: 'DAAD 奖学金 — 暑期课程',
      detail: '德国国际暑期课程',
      year: '2024',
    },
    {
      title: '优秀奖',
      detail: '第四届“沪江杯”科技翻译大赛 · 中译德',
      year: '2025',
    },
    {
      title: '优秀学生奖学金一等奖（多次）',
      detail: '上海理工大学 · 德语课助教',
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
      items: [
        'MATLAB/Simulink',
        'C 语言（Visual Studio 2022）',
        'Java（IntelliJ IDEA）',
        '西门子 PLC',
        '数字控制',
        '台式电脑整机组装与系统安装',
      ],
    },
    {
      group: 'AI 与 Agent 工具',
      items: ['DeepSeek Harness', 'WorkBuddy', 'Agent 工作流自动化', '独立项目开发', 'STM32 / Arduino 固件'],
    },
  ],
  coursework: [
    { group: '电机与拖动', items: ['电力拖动（德语授课）'] },
    {
      group: '电力电子',
      items: ['电力电子（德语授课）', '电路 I 与 II（德语授课）', '模拟电路', '数字系统'],
    },
    {
      group: '控制与自动化',
      items: [
        '自动控制原理（德语授课）',
        '数字控制（德语授课）',
        '可编程工业控制系统',
        '嵌入式系统',
        '传感器技术',
      ],
    },
    {
      group: '编程与数学',
      items: ['高级 C 语言程序设计（德语授课）', '高等数学（1）（2）', '线性代数', '概率论与数理统计'],
    },
  ],
  languages: [
    { name: '英语', level: 'IELTS 7.5', detail: '听力 8.5 · 阅读 7.5 · 写作 6.5 · 口语 6.5' },
    { name: '德语', level: '歌德 B2 · TestDaF' },
    { name: '普通话', level: '母语', detail: '中文母语' },
    { name: '粤语', level: '母语', detail: '母语 · 日常与工作交流' },
  ],
};
