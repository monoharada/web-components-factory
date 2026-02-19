import {
  renderArticleTemplate,
  renderContactTemplate,
  renderHubTemplate,
  renderServiceTemplate,
  renderTopTemplate,
} from '../templates/municipal.js';

type TemplateSample = Readonly<{
  title: string;
  html: string;
}>;

function renderTemplatePageDemo(pageTitle: string, samples: readonly TemplateSample[]): string {
  const sampleSections = samples
    .map(
      (sample) => `
        <section data-dads-typeset aria-label="${sample.title}">
          <h2>${sample.title}</h2>
          ${sample.html}
        </section>
      `,
    )
    .join('');

  return `
    <div data-dads-typeset>
      <h1>${pageTitle}</h1>
      ${sampleSections}
    </div>
  `;
}

const topTemplateSamples: readonly TemplateSample[] = [
  {
    title: 'top.prefecture-multi-depth',
    html: renderTopTemplate({
      id: 'top-prefecture-multi-depth',
      variant: 'prefecture-multi-depth',
      navVariant: 'dropdown',
      searchVariant: 'tabbed',
      emergencyPosition: 'header_banner',
      shortcutMode: 'hub-cards',
      carouselEnabled: true,
    }),
  },
  {
    title: 'top.prefecture-single-level',
    html: renderTopTemplate({
      id: 'top-prefecture-single-level',
      variant: 'prefecture-single-level',
      navVariant: 'horizontal',
      searchVariant: 'header',
      emergencyPosition: 'content_notice',
      shortcutMode: 'hub-cards',
      carouselEnabled: false,
    }),
  },
  {
    title: 'top.municipal-quick-access',
    html: renderTopTemplate({
      id: 'top-municipal-quick-access',
      variant: 'municipal-quick-access',
      navVariant: 'drawer',
      searchVariant: 'full',
      emergencyPosition: 'none',
      shortcutMode: 'quick-task',
      carouselEnabled: true,
    }),
  },
];

const contactTemplateSamples: readonly TemplateSample[] = [
  {
    title: 'contact.prefecture-contact-center',
    html: renderContactTemplate({
      id: 'contact-prefecture-contact-center',
      variant: 'prefecture-contact-center',
      formVariant: 'multi_step',
      channelFocus: 'all_channels',
      filterMode: 'both',
    }),
  },
  {
    title: 'contact.municipal-streamlined-form',
    html: renderContactTemplate({
      id: 'contact-municipal-streamlined-form',
      variant: 'municipal-streamlined-form',
      formVariant: 'multi_step',
      channelFocus: 'all_channels',
      filterMode: 'department',
    }),
  },
  {
    title: 'contact.prefecture-issue-specific',
    html: renderContactTemplate({
      id: 'contact-prefecture-issue-specific',
      variant: 'prefecture-issue-specific',
      formVariant: 'none',
      channelFocus: 'phone_email',
      filterMode: 'page_id',
    }),
  },
];

const serviceTemplateSamples: readonly TemplateSample[] = [
  {
    title: 'service.emergency-resilience-service',
    html: renderServiceTemplate({
      id: 'service-emergency-resilience',
      variant: 'emergency-resilience-service',
      emergencyMode: 'header_banner',
      onlineApplyVendor: 'internal',
      attachmentsVariant: 'pdf',
      faqEnabled: true,
    }),
  },
  {
    title: 'service.digital-application-service',
    html: renderServiceTemplate({
      id: 'service-digital-application',
      variant: 'digital-application-service',
      emergencyMode: 'content_notice',
      onlineApplyVendor: 'external',
      attachmentsVariant: 'mixed',
      faqEnabled: true,
    }),
  },
  {
    title: 'service.basic-info-service',
    html: renderServiceTemplate({
      id: 'service-basic-info',
      variant: 'basic-info-service',
      emergencyMode: 'none',
      onlineApplyVendor: 'internal',
      attachmentsVariant: 'none',
      faqEnabled: false,
    }),
  },
];

const hubTemplateSamples: readonly TemplateSample[] = [
  {
    title: 'hub.card-portal',
    html: renderHubTemplate({
      id: 'hub-card-portal',
      variant: 'card-portal',
      searchVariant: 'header',
      hubCardsVariant: 'card_grid',
      hubCardsEnabled: true,
      carouselEnabled: false,
      localNavEnabled: true,
      emergencyAssist: 'none',
    }),
  },
  {
    title: 'hub.highlight-carousel',
    html: renderHubTemplate({
      id: 'hub-highlight-carousel',
      variant: 'highlight-carousel',
      searchVariant: 'full',
      hubCardsVariant: 'category_list',
      hubCardsEnabled: true,
      carouselEnabled: true,
      localNavEnabled: true,
      emergencyAssist: 'banner',
    }),
  },
  {
    title: 'hub.streamlined-news',
    html: renderHubTemplate({
      id: 'hub-streamlined-news',
      variant: 'streamlined-news',
      searchVariant: 'tabbed',
      hubCardsVariant: 'text',
      hubCardsEnabled: false,
      carouselEnabled: false,
      localNavEnabled: false,
      emergencyAssist: 'none',
    }),
  },
];

const articleTemplateSamples: readonly TemplateSample[] = [
  {
    title: 'article.meta-update',
    html: renderArticleTemplate({
      id: 'article-meta-update',
      variant: 'meta-update',
      metaLevel: 'full',
      attachmentsVariant: 'mixed',
      contactFormVariant: 'simple',
      tocEnabled: false,
      localNavEnabled: true,
      newsStreamMode: 'article_focus',
    }),
  },
  {
    title: 'article.service-flow',
    html: renderArticleTemplate({
      id: 'article-service-flow',
      variant: 'service-flow',
      metaLevel: 'full',
      attachmentsVariant: 'pdf',
      contactFormVariant: 'multi_step',
      tocEnabled: true,
      localNavEnabled: true,
      newsStreamMode: 'article_focus',
    }),
  },
  {
    title: 'article.news-stream',
    html: renderArticleTemplate({
      id: 'article-news-stream',
      variant: 'news-stream',
      metaLevel: 'minimal',
      attachmentsVariant: 'none',
      contactFormVariant: 'none',
      tocEnabled: false,
      localNavEnabled: false,
      newsStreamMode: 'list_focus',
    }),
  },
];

export const demos = {
  municipalTopTemplate: () => renderTemplatePageDemo('Municipal Template: top', topTemplateSamples),
  municipalContactTemplate: () => renderTemplatePageDemo('Municipal Template: contact', contactTemplateSamples),
  municipalServiceTemplate: () => renderTemplatePageDemo('Municipal Template: service', serviceTemplateSamples),
  municipalHubTemplate: () => renderTemplatePageDemo('Municipal Template: hub', hubTemplateSamples),
  municipalArticleTemplate: () => renderTemplatePageDemo('Municipal Template: article', articleTemplateSamples),
} as const;
