import type { Lang } from '../data/types';

/**
 * The only layout chrome copy that the shared `Resume` model does not carry:
 * accessibility labels and the small fact keys used by the profile block.
 * Anything that is *content* lives in `src/data/resume.en.ts` / `resume.zh.ts`.
 */
export interface ChromeText {
  skipLink: string;
  primaryNav: string;
  home: string;
  facts: {
    programme: string;
    institution: string;
    period: string;
    focus: string;
    interests: string;
  };
}

export const chrome: Record<Lang, ChromeText> = {
  en: {
    skipLink: 'Skip to content',
    primaryNav: 'Primary',
    home: 'Home',
    facts: {
      programme: 'Programme',
      institution: 'Institution',
      period: 'Period',
      focus: 'Focus',
      interests: 'Interests',
    },
  },
  zh: {
    skipLink: '跳到主要内容',
    primaryNav: '主导航',
    home: '首页',
    facts: {
      programme: '学位项目',
      institution: '院校',
      period: '时间',
      focus: '专业方向',
      interests: '爱好',
    },
  },
};
