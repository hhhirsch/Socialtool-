import { carouselSlideTemplate } from './carouselSlideTemplate';
import { decisionOutTemplate } from './decisionOutTemplate';
import { generalPostTemplate } from './generalPostTemplate';
import { iqwigOutTemplate } from './iqwigOutTemplate';
import { podcastQuoteTileTemplate } from './podcastQuoteTileTemplate';
import { toWatchTemplate } from './toWatchTemplate';

export const GRAPHIC_TEMPLATES = [
  toWatchTemplate,
  decisionOutTemplate,
  iqwigOutTemplate,
  carouselSlideTemplate,
  generalPostTemplate,
  podcastQuoteTileTemplate,
];

export const DEFAULT_TEMPLATE_ID = GRAPHIC_TEMPLATES[0].id;

export * from './types';
export * from './sharedBaseCss';
export * from './toWatchTemplate';
export * from './decisionOutTemplate';
export * from './iqwigOutTemplate';
export * from './carouselSlideTemplate';
export * from './generalPostTemplate';
export * from './podcastQuoteTileTemplate';
