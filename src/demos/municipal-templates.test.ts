import { describe, expect, it } from 'vitest';
import { demos } from './municipal-templates.js';
import { renderContactTemplate, renderServiceTemplate, renderTopTemplate } from '../templates/municipal.js';

function extractVariantSection(html: string, variant: string): string {
  const marker = `data-template-variant="${variant}"`;
  const start = html.indexOf(marker);
  if (start < 0) return '';
  const next = html.indexOf('data-template-variant="', start + marker.length);
  return next < 0 ? html.slice(start) : html.slice(start, next);
}

describe('municipal templates demos', () => {
  it('top template demo renders three variants', () => {
    const html = demos.municipalTopTemplate();

    expect(html).toContain('Municipal Template: top');
    expect(html).toContain('top.prefecture-multi-depth');
    expect(html).toContain('top.prefecture-single-level');
    expect(html).toContain('top.municipal-quick-access');
    expect(html).toContain('data-template-variant="prefecture-multi-depth"');
    expect(html).toContain('data-template-variant="prefecture-single-level"');
    expect(html).toContain('data-template-variant="municipal-quick-access"');
    expect((html.match(/data-page-type="top"/g) ?? []).length).toBe(3);
  });

  it('contact template demo renders three variants', () => {
    const html = demos.municipalContactTemplate();

    expect(html).toContain('Municipal Template: contact');
    expect(html).toContain('contact.prefecture-contact-center');
    expect(html).toContain('contact.municipal-streamlined-form');
    expect(html).toContain('contact.prefecture-issue-specific');
    expect(html).toContain('data-template-variant="prefecture-contact-center"');
    expect(html).toContain('data-template-variant="municipal-streamlined-form"');
    expect(html).toContain('data-template-variant="prefecture-issue-specific"');
    expect((html.match(/data-page-type="contact"/g) ?? []).length).toBe(3);

    const streamlinedSection = extractVariantSection(html, 'municipal-streamlined-form');
    expect(streamlinedSection).toContain('dads-step-navigation');
    expect(streamlinedSection).not.toContain('シンプルフォーム');
  });

  it('service template demo renders three variants', () => {
    const html = demos.municipalServiceTemplate();

    expect(html).toContain('Municipal Template: service');
    expect(html).toContain('service.emergency-resilience-service');
    expect(html).toContain('service.digital-application-service');
    expect(html).toContain('service.basic-info-service');
    expect(html).toContain('data-template-variant="emergency-resilience-service"');
    expect(html).toContain('data-template-variant="digital-application-service"');
    expect(html).toContain('data-template-variant="basic-info-service"');
    expect((html.match(/data-page-type="service"/g) ?? []).length).toBe(3);
  });

  it('hub template demo renders three variants', () => {
    const html = demos.municipalHubTemplate();

    expect(html).toContain('Municipal Template: hub');
    expect(html).toContain('hub.card-portal');
    expect(html).toContain('hub.highlight-carousel');
    expect(html).toContain('hub.streamlined-news');
    expect(html).toContain('data-template-variant="card-portal"');
    expect(html).toContain('data-template-variant="highlight-carousel"');
    expect(html).toContain('data-template-variant="streamlined-news"');
    expect((html.match(/data-page-type="hub"/g) ?? []).length).toBe(3);
  });

  it('article template demo renders three variants', () => {
    const html = demos.municipalArticleTemplate();

    expect(html).toContain('Municipal Template: article');
    expect(html).toContain('article.meta-update');
    expect(html).toContain('article.service-flow');
    expect(html).toContain('article.news-stream');
    expect(html).toContain('data-template-variant="meta-update"');
    expect(html).toContain('data-template-variant="service-flow"');
    expect(html).toContain('data-template-variant="news-stream"');
    expect((html.match(/data-page-type="article"/g) ?? []).length).toBe(3);
  });

  it('contact.prefecture-issue-specific is phone/email focused', () => {
    const html = renderContactTemplate({
      id: 'contact-issue-specific-focus-test',
      variant: 'prefecture-issue-specific',
      formVariant: 'none',
      channelFocus: 'phone_email',
      filterMode: 'page_id',
    });

    expect(html).toContain('電話で問い合わせ');
    expect(html).toContain('メールで問い合わせ');
    expect(html).not.toContain('フォームで問い合わせ');
    expect(html).not.toContain('FAXで問い合わせ');
  });

  it('service.digital-application-service external vendor has secure outbound CTA', () => {
    const html = renderServiceTemplate({
      id: 'service-external-vendor-test',
      variant: 'digital-application-service',
      emergencyMode: 'content_notice',
      onlineApplyVendor: 'external',
      attachmentsVariant: 'mixed',
      faqEnabled: true,
    });

    expect(html).toContain('Gov e-Apply（外部ベンダー）');
    expect(html).toContain('href="https://example.com/external-apply"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('tabbed search UI does not expose broken tab aria-controls mapping', () => {
    const html = renderTopTemplate({
      id: 'top-tabbed-search-a11y-test',
      variant: 'prefecture-multi-depth',
      navVariant: 'dropdown',
      searchVariant: 'tabbed',
      emergencyPosition: 'header_banner',
      shortcutMode: 'hub-cards',
      carouselEnabled: false,
    });

    expect(html).toContain('aria-pressed="true"');
    expect(html).not.toContain('role="tab"');
    expect(html).not.toContain('aria-controls=');
  });
});
