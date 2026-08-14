import type { TranslationKey } from '@/i18n';
import type { appIcon } from '@/ds/icons';

export interface NavItem { path: string; labelKey: TranslationKey; icon: appIcon }
export interface NavSection { titleKey?: TranslationKey; items: NavItem[] }

export const NAV_SECTIONS: NavSection[] = [
  {
    titleKey: 'nav.section.workspace',
    items: [
      { path: '/', labelKey: 'nav.intro', icon: 'OL_HAPPY' },
      { path: '/example', labelKey: 'nav.example', icon: 'OL_CHART_PIE' },
      { path: '/updates', labelKey: 'nav.updates', icon: 'OL_BELL' },
    ],
  },
  { items: [
    { path: '/design-principles', labelKey: 'nav.principles', icon: 'OL_SHIELD_CHECK' },
  ] },
  {
    titleKey: 'nav.section.foundations',
    items: [
      { path: '/foundations/grid', labelKey: 'nav.foundation.grid', icon: 'OL_TABLE_CELLS' },
      { path: '/foundations/elevation', labelKey: 'nav.foundation.elevation', icon: 'OL_INBOX_STACK' },
      { path: '/foundations/primitive-color', labelKey: 'nav.foundation.primitiveColor', icon: 'OL_SPARKLES' },
      { path: '/foundations/color-token', labelKey: 'nav.foundation.colorToken', icon: 'OL_CURSOR_ARROW_RAYS' },
      { path: '/foundations/typography', labelKey: 'nav.foundation.typography', icon: 'IO_TEXT' },
      { path: '/foundations/iconography', labelKey: 'nav.foundation.iconography', icon: 'OL_HAPPY' },
      { path: '/foundations/identity', labelKey: 'nav.foundation.identity', icon: 'OL_SHIELD_CHECK' },
      { path: '/foundations/common-image', labelKey: 'nav.foundation.commonImage', icon: 'OL_PHOTO' },
    ],
  },
  {
    titleKey: 'nav.section.content',
    items: [
      { path: '/content/voice-tone', labelKey: 'nav.content.voiceTone', icon: 'OL_BUBBLE_LEFT' },
      { path: '/content/writing-style', labelKey: 'nav.content.writingStyle', icon: 'MINI_PENCIL_SQUARE' },
      { path: '/content/vocabulary', labelKey: 'nav.content.vocabulary', icon: 'IO_TEXT' },
    ],
  },
  {
    titleKey: 'nav.section.components',
    items: [
      { path: '/components/button', labelKey: 'nav.component.button', icon: 'OL_CURSOR_ARROW_RAYS' },
      { path: '/components/label-helper', labelKey: 'nav.component.labelHelper', icon: 'IO_TEXT' },
      { path: '/components/text-field', labelKey: 'nav.component.textField', icon: 'MINI_PENCIL_SQUARE' },
      { path: '/components/text-area', labelKey: 'nav.component.textArea', icon: 'OL_DOCUMENT' },
      { path: '/components/selection-control', labelKey: 'nav.component.selectionControl', icon: 'OL_SHIELD_CHECK' },
      { path: '/components/dropdown', labelKey: 'nav.component.dropdown', icon: 'OL_CHEVRON_DOWN' },
      { path: '/components/date-picker', labelKey: 'nav.component.datePicker', icon: 'OL_CALENDAR' },
      { path: '/components/slider', labelKey: 'nav.component.slider', icon: 'OL_ARROW_EXPAND' },
      { path: '/components/chip', labelKey: 'nav.component.chip', icon: 'OL_FOLDER_PLUS' },
      { path: '/components/menu', labelKey: 'nav.component.menu', icon: 'OL_MENU_ALT_4' },
      { path: '/components/snackbar', labelKey: 'nav.component.snackbar', icon: 'OL_BUBBLE_LEFT' },
      { path: '/components/tab', labelKey: 'nav.component.tab', icon: 'OL_TABLE_CELLS' },
      { path: '/components/pagination', labelKey: 'nav.component.pagination', icon: 'OL_CHEVRON_DOUBLE_RIGHT' },
      { path: '/components/badge', labelKey: 'nav.component.badge', icon: 'OL_BELL' },
      { path: '/components/rating', labelKey: 'nav.component.rating', icon: 'OL_HAPPY' },
      { path: '/components/progress-indicator', labelKey: 'nav.component.progressIndicator', icon: 'OL_REFRESH' },
      { path: '/components/chart', labelKey: 'nav.component.chart', icon: 'OL_CHART_PIE' },
      { path: '/components/divider', labelKey: 'nav.component.divider', icon: 'OL_MINUS_SM' },
      { path: '/components/dialog', labelKey: 'nav.component.dialog', icon: 'OL_EXCLAMATION_CIRCLE' },
      { path: '/components/section-message', labelKey: 'nav.component.sectionMessage', icon: 'OL_BUBBLE_LEFT' },
      { path: '/components/description', labelKey: 'nav.component.description', icon: 'OL_DOCUMENT' },
    ],
  },
  {
    titleKey: 'nav.section.patterns',
    items: [
      { path: '/patterns/bottom-navigation', labelKey: 'nav.pattern.bottomNavigation', icon: 'OL_MENU_ALT_4' },
      { path: '/patterns/app-bar', labelKey: 'nav.pattern.appBar', icon: 'OL_INBOX_STACK' },
      { path: '/patterns/subheader', labelKey: 'nav.pattern.subheader', icon: 'IO_TEXT' },
      { path: '/patterns/list', labelKey: 'nav.pattern.list', icon: 'OL_TABLE_CELLS' },
      { path: '/patterns/image-list', labelKey: 'nav.pattern.imageList', icon: 'OL_PHOTO' },
    ],
  },
  {
    titleKey: 'nav.section.bestPractices',
    items: [
      { path: '/best-practices/content', labelKey: 'nav.practice.content', icon: 'OL_DOCUMENT' },
      { path: '/best-practices/setting', labelKey: 'nav.practice.setting', icon: 'OL_COG_6_TOOTH' },
      { path: '/best-practices/search', labelKey: 'nav.practice.search', icon: 'OL_SEARCH' },
      { path: '/best-practices/fieldset', labelKey: 'nav.practice.fieldset', icon: 'MINI_PENCIL_SQUARE' },
    ],
  },
];
