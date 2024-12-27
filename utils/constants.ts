import { __STAGING__ } from '~/utils/dev';

// @TODO: Move the file to constants dir
export const PATH = {
  SHARE_HOST: 'https://affine.pro',

  AFFINE_WEB_APP: 'https://app.affine.pro',
  AFFINE_DOWNHILLS: 'https://app.affine.pro',
  AFFINE_INSIDER: 'https://insider.affine.pro',
  AFFINE_PRE_ALPHA: 'https://livedemo.affine.pro',
  // AFFINE_AI_TRY: "https://ai.affine.pro",
  AFFINE_AI_TRY: __STAGING__
    ? 'https://affine.fail/try-cloud'
    : 'https://app.affine.pro/try-cloud',

  AFFiNE_GITHUB: 'https://github.com/toeverything/AFFiNE',
  AFFiNE_GITHUB_ORG: 'https://github.com/toeverything',
  AFFiNE_BLOCK_SUITE: 'https://github.com/toeverything/blocksuite',
  AFFiNE_OCTO_BASE: 'https://github.com/toeverything/octobase',
  AFFiNE_HOME_PAGE: 'https://github.com/toeverything/affine.pro',
  AFFiNE_COMMUNITY: 'https://community.affine.pro/',
  AFFiNE_DOCS: 'https://docs.affine.pro/docs',

  SNS_REDDIT: 'https://www.reddit.com/r/Affine/',
  SNS_DISCORD: 'https://discord.com/invite/q3N9SnMfx2',
  SNS_TELEGRAM: 'https://t.me/affineworkos',
  SNS_TWITTER: 'https://twitter.com/AffineOfficial',
  SNS_YOUTUBE: 'https://www.youtube.com/@affinepro',

  INTERN_APPLY_FORM: 'https://6dxre9ihosp.typeform.com/to/lnHWRsVS',
  SING_UP: 'https://app.affine.pro',
  LOGIN: __STAGING__
    ? 'https://affine.fail/try-cloud'
    : 'https://app.affine.pro/try-cloud',
  PRICING_JOIN_WAITLIST: __STAGING__
    ? 'https://affine.fail/subscribe?plan=ai&recurring=yearly'
    : 'https://app.affine.pro/subscribe?plan=ai&recurring=yearly',
  PRICING_CONTACT_FORM_TEAM: 'https://6dxre9ihosp.typeform.com/to/niBcdkvs',
  PRICING_TEAM_MONTHLY: __STAGING__
    ? 'https://affine.fail/upgrade-to-team?recurring=Monthly'
    : 'https://app.affine.pro/upgrade-to-team?recurring=Monthly',
  PRICING_TEAM_YEARLY: __STAGING__
    ? 'https://affine.fail/upgrade-to-team?recurring=Yearly'
    : 'https://app.affine.pro/upgrade-to-team?recurring=Yearly',
  PRICING_PRO_MONTHLY: __STAGING__
    ? 'https://affine.fail/subscribe?plan=pro&recurring=monthly'
    : 'https://app.affine.pro/subscribe?plan=pro&recurring=monthly',
  PRICING_PRO_YEARLY: __STAGING__
    ? 'https://affine.fail/subscribe?plan=pro&recurring=yearly'
    : 'https://app.affine.pro/subscribe?plan=pro&recurring=yearly',
  PRICING_BELIEVER_TIER: __STAGING__
    ? 'https://affine.fail/subscribe?plan=pro&recurring=lifetime'
    : 'https://app.affine.pro/subscribe?plan=pro&recurring=lifetime',
  GET_NOTIFIED_FORM: 'https://6dxre9ihosp.typeform.com/to/B8IHwuyy',
  COPILOT_FORM: 'https://6dxre9ihosp.typeform.com/to/MjaI1NIV',
};

export const COMMUNITY_SNS_LIST = [
  {
    name: 'Twitter',
    iconName: 'twitter',
    link: PATH.SNS_TWITTER,
  },
  {
    name: 'GitHub',
    iconName: 'github',
    link: PATH.AFFiNE_GITHUB,
  },
  {
    name: 'Telegram',
    iconName: 'telegram',
    link: PATH.SNS_TELEGRAM,
  },
  {
    name: 'Discord',
    iconName: 'discord',
    link: PATH.SNS_DISCORD,
  },
  {
    name: 'YouTube',
    iconName: 'youtube',
    link: PATH.SNS_YOUTUBE,
  },
  {
    name: 'Reddit',
    iconName: 'reddit',
    link: PATH.SNS_REDDIT,
  },
];

export const INFO = {
  CONTACT_EMAIL: 'contact@toeverything.info',
};

export const CONFIG = {
  // UI & Context
  IS_SHOW_CAMPAIGN_ENTRY: true,
  ENABLE_LANG_SWITCHER: false,
  ENABLE_THEME_SWITCHER: false,
  ENABLE_BLACK_FRIDAY: false,
  ENABLE_PRODUCT_HUNT: false,

  // Service
  API_HOST:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : 'https://affine.pro',
};
