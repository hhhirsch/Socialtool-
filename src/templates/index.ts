import { businessPhotoQuoteTileTemplate } from './businessPhotoQuoteTileTemplate';
import { carouselSlideTemplate } from './carouselSlideTemplate';
import { decisionOutTemplate } from './decisionOutTemplate';
import { generalPostTemplate } from './generalPostTemplate';
import { iqwigOutTemplate } from './iqwigOutTemplate';
import { podcastPhotoQuoteTileTemplate } from './podcastPhotoQuoteTileTemplate';
import { podcastQuoteTileTemplate } from './podcastQuoteTileTemplate';
import { toWatchTemplate } from './toWatchTemplate';
import { podcastChatTileTemplate } from './podcastChatTileTemplate';
import { podcastStoryChatTemplate } from './podcastStoryChatTemplate';

export const GRAPHIC_TEMPLATES = [
  toWatchTemplate,
  decisionOutTemplate,
  iqwigOutTemplate,
  carouselSlideTemplate,
  generalPostTemplate,
  businessPhotoQuoteTileTemplate,
  podcastPhotoQuoteTileTemplate,
  podcastQuoteTileTemplate,
  podcastChatTileTemplate,
  podcastStoryChatTemplate,
];

export const DEFAULT_TEMPLATE_ID = GRAPHIC_TEMPLATES[0].id;

export * from './types';
export * from './sharedBaseCss';
export * from './toWatchTemplate';
export * from './decisionOutTemplate';
export * from './iqwigOutTemplate';
export * from './carouselSlideTemplate';
export * from './generalPostTemplate';
export * from './businessPhotoQuoteTileTemplate';
export * from './podcastPhotoQuoteTileTemplate';
export * from './podcastChatTileTemplate';
export * from './podcastQuoteTileTemplate';
export * from './podcastStoryChatTemplate';
