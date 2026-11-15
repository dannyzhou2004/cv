/**
 * Shared content model for the bilingual CV site.
 * Every visible string in the site comes from one of these objects, so a page
 * never hard-codes copy: `resume.en.ts` and `resume.zh.ts` are the only sources
 * of truth. Keep both files structurally identical.
 *
 * Inline emphasis: any string marked "rich" may contain **bold** segments.
 * The site renders those by splitting on `**` — no HTML, no markdown library.
 */

export type Lang = 'en' | 'zh';

/** A link shown in the hero / contact block. */
export interface ContactLink {
  label: string;
  href: string;
}

export interface Person {
  /** Display name, e.g. "ZHOU YUEYANG". */
  name: string;
  /** Optional Chinese name (hanzi). Leave empty to fall back to `name`. */
  nameZh: string;
  /** Current programme or professional title. */
  title: string;
  /** One-sentence positioning line, 1–2 lines on screen. */
  tagline: string;
  /** Where the person is based. */
  location: string;
  phones: string[];
  emails: string[];
  links: ContactLink[];
}

/** A headline number in the hero (rank, average, GPA, credits …). */
export interface Stat {
  value: string;
  label: string;
  /** Optional second line, already includes its own unit/qualifier. */
  note?: string;
}

export interface EducationEntry {
  org: string;
  /** Short name or native-language name shown under `org`. */
  orgSub?: string;
  place: string;
  degree: string;
  period: string;
  bullets: string[];
}

export interface ExperienceEntry {
  org: string;
  orgSub?: string;
  place: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface ProjectEntry {
  title: string;
  role: string;
  supervisor?: string;
  bullets: string[];
}

export interface AwardEntry {
  title: string;
  detail: string;
  year?: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface CourseGroup {
  group: string;
  items: string[];
}

export interface LanguageEntry {
  name: string;
  level: string;
  /** Certificate / sub-scores, shown as a small line under the level. */
  detail?: string;
  /** 0–100 fill for the proficiency bar; omit to hide the bar. */
  score?: number;
}

/**
 * Background music hosted by Bilibili's official embed player.
 * Nothing is re-hosted on GitHub Pages: clicking the header button mounts
 * `player.bilibili.com/player.html?bvid=…`, so playback happens on Bilibili's
 * own player and the source video stays one link away.
 */
export interface MusicSource {
  /** BV id of the source video, e.g. `BV1d3Yi6jEmb`. */
  bvid: string;
  /** Canonical video page URL, used for the credit link. */
  url: string;
  /** Localized title shown in the panel header. */
  title: string;
  /** Localized credit line, e.g. "音频来源：B 站 BV…". */
  credit: string;
}

/** Static interface copy: navigation, buttons, section headings. */
export interface UiText {
  nav: {
    about: string;
    education: string;
    experience: string;
    projects: string;
    honours: string;
    skills: string;
    languages: string;
  };
  sections: {
    about: string;
    education: string;
    experience: string;
    projects: string;
    honours: string;
    skills: string;
    languages: string;
    coursework: string;
    contact: string;
  };
  labels: {
    supervisor: string;
    expected: string;
    /** Opens the background-music panel. */
    openMusic: string;
    /** Closes it (also stops playback). */
    closeMusic: string;
    /** Shown under the embedded player. */
    musicHint: string;
    /** Link label: open the source video on Bilibili. */
    openSource: string;
    switchLanguage: string;
    copyEmail: string;
    copied: string;
    backToTop: string;
    menu: string;
    close: string;
    print: string;
  };
  /** Footer note, e.g. "Built with Astro · hosted on GitHub Pages". */
  footer: string;
}

export interface Resume {
  lang: Lang;
  /** Value for <html lang>. */
  htmlLang: string;
  /** Used for <title>, meta description, og:locale. */
  meta: {
    title: string;
    description: string;
    ogLocale: string;
  };
  ui: UiText;
  person: Person;
  stats: Stat[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  awards: AwardEntry[];
  skills: SkillGroup[];
  coursework: CourseGroup[];
  languages: LanguageEntry[];
  /** Optional: hide the music control entirely when absent. */
  music?: MusicSource;
}
