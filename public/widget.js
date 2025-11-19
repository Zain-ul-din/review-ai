(function () {
  'use strict';

  // Reviews Plethora Widget
  // Version: 1.0.0

  const WIDGET_STYLES = `
    .reviews-plethora-widget {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      --widget-primary-color: #000000;
      --widget-bg-color: #ffffff;
      --widget-text-color: #333333;
    }

    .reviews-plethora-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .reviews-plethora-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 10px 0;
      color: var(--widget-primary-color);
    }

    .reviews-plethora-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-top: 15px;
    }

    .reviews-plethora-rating {
      font-size: 32px;
      font-weight: 700;
      color: var(--widget-primary-color);
    }

    .reviews-plethora-stars {
      display: flex;
      gap: 3px;
    }

    .reviews-plethora-star {
      width: 20px;
      height: 20px;
    }

    .reviews-plethora-star-filled {
      color: #fbbf24;
      fill: #fbbf24;
    }

    .reviews-plethora-star-empty {
      color: #d1d5db;
      fill: none;
    }

    .reviews-plethora-count {
      font-size: 14px;
      color: #6b7280;
    }

    .reviews-plethora-list {
      display: grid;
      gap: 20px;
    }

    .reviews-plethora-list.layout-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .reviews-plethora-list.layout-carousel {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 20px;
      padding-bottom: 10px;
    }

    .reviews-plethora-list.layout-carousel .reviews-plethora-review {
      flex: 0 0 300px;
      scroll-snap-align: start;
    }

    .reviews-plethora-review {
      background: var(--widget-bg-color);
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      transition: box-shadow 0.2s;
      color: var(--widget-text-color);
    }

    .reviews-plethora-review:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .reviews-plethora-review-header {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .reviews-plethora-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }

    .reviews-plethora-author-info {
      flex: 1;
    }

    .reviews-plethora-author-name {
      font-weight: 600;
      color: var(--widget-text-color);
      margin: 0 0 4px 0;
      font-size: 14px;
    }

    .reviews-plethora-review-date {
      font-size: 12px;
      color: #6b7280;
    }

    .reviews-plethora-review-stars {
      display: flex;
      gap: 2px;
      margin-bottom: 12px;
    }

    .reviews-plethora-review-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--widget-text-color);
    }

    .reviews-plethora-review-text {
      font-size: 14px;
      line-height: 1.6;
      color: var(--widget-text-color);
      margin: 0;
      white-space: pre-wrap;
    }

    .reviews-plethora-loading {
      text-align: center;
      padding: 40px;
      color: #6b7280;
    }

    .reviews-plethora-error {
      text-align: center;
      padding: 40px;
      color: #ef4444;
    }

    .reviews-plethora-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    .reviews-plethora-powered {
      font-size: 12px;
      color: #6b7280;
    }

    .reviews-plethora-powered a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }

    .reviews-plethora-powered a:hover {
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      .reviews-plethora-widget {
        padding: 15px;
      }

      .reviews-plethora-title {
        font-size: 20px;
      }

      .reviews-plethora-rating {
        font-size: 28px;
      }
    }
  `;

  function createStarSVG(filled) {
    return `<svg class="reviews-plethora-star reviews-plethora-star-${filled ? 'filled' : 'empty'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>`;
  }

  function renderStars(rating, size = 20) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += createStarSVG(i <= rating);
    }
    return stars;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  async function loadWidget(element, campaignId, apiBaseUrl) {
    try {
      // Show loading state
      element.innerHTML = `<div class="reviews-plethora-widget">
        <div class="reviews-plethora-loading">Loading reviews...</div>
      </div>`;

      // Fetch reviews
      const response = await fetch(`${apiBaseUrl}/api/widget/${campaignId}`);

      if (!response.ok) {
        throw new Error('Failed to load reviews');
      }

      const data = await response.json();
      const customization = data.customization || {};

      // Apply customization CSS variables
      const widgetStyle = `
        --widget-primary-color: ${customization.primaryColor || '#000000'};
        --widget-bg-color: ${customization.backgroundColor || '#ffffff'};
        --widget-text-color: ${customization.textColor || '#333333'};
      `;

      // Render widget
      let html = `<div class="reviews-plethora-widget" style="${widgetStyle}">`;

      // Header
      html += `<div class="reviews-plethora-header">
        <h2 class="reviews-plethora-title">${escapeHtml(customization.headerText || data.campaign.name)}</h2>
        <div class="reviews-plethora-stats">
          <span class="reviews-plethora-rating">${data.stats.averageRating}</span>
          <div>
            <div class="reviews-plethora-stars">${renderStars(Math.round(data.stats.averageRating))}</div>
            <div class="reviews-plethora-count">${data.stats.totalReviews} review${data.stats.totalReviews !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>`;

      // Reviews list
      if (data.reviews.length > 0) {
        const layout = customization.layout || 'list';
        html += `<div class="reviews-plethora-list layout-${layout}">`;

        data.reviews.forEach(review => {
          html += `<div class="reviews-plethora-review">`;

          // Avatar and author info (conditionally shown)
          if (customization.showAvatars !== false || customization.showDates !== false) {
            html += `<div class="reviews-plethora-review-header">`;

            if (customization.showAvatars !== false) {
              html += `<img src="${escapeHtml(review.author.avatar)}" alt="${escapeHtml(review.author.name)}" class="reviews-plethora-avatar" />`;
            }

            html += `<div class="reviews-plethora-author-info">
              <p class="reviews-plethora-author-name">${escapeHtml(review.author.name)}</p>`;

            if (customization.showDates !== false) {
              html += `<p class="reviews-plethora-review-date">${formatDate(review.createdAt)}</p>`;
            }

            html += `</div></div>`;
          }

          // Stars
          html += `<div class="reviews-plethora-review-stars">${renderStars(review.rating)}</div>`;

          // Title (conditionally shown)
          if (customization.showTitles !== false) {
            html += `<h3 class="reviews-plethora-review-title">${escapeHtml(review.title)}</h3>`;
          }

          // Review text
          html += `<p class="reviews-plethora-review-text">${escapeHtml(review.review)}</p>`;
          html += `</div>`;
        });

        html += '</div>';
      } else {
        html += '<div class="reviews-plethora-loading">No reviews yet</div>';
      }

      // Footer with branding (non-customizable)
      html += `<div class="reviews-plethora-footer">
        <p class="reviews-plethora-powered">Powered by <a href="https://reviews-plethora.com" target="_blank" rel="noopener">Reviews Plethora</a></p>
      </div>`;

      html += '</div>';

      element.innerHTML = html;
    } catch (error) {
      element.innerHTML = `<div class="reviews-plethora-widget">
        <div class="reviews-plethora-error">Failed to load reviews. Please try again later.</div>
      </div>`;
      console.error('Reviews Plethora Widget Error:', error);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function init() {
    // Inject styles
    if (!document.getElementById('reviews-plethora-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'reviews-plethora-styles';
      styleEl.textContent = WIDGET_STYLES;
      document.head.appendChild(styleEl);
    }

    // Detect API base URL from script tag
    let apiBaseUrl = '';
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (src && src.includes('/widget.js')) {
        try {
          const url = new URL(src);
          apiBaseUrl = url.origin;
          break;
        } catch (e) {
          // Invalid URL, continue
        }
      }
    }

    // Fallback to data attribute or current origin
    if (!apiBaseUrl) {
      const firstContainer = document.querySelector('[data-reviews-plethora-campaign]');
      apiBaseUrl = firstContainer?.getAttribute('data-api-url') || window.location.origin;
    }

    // Find all widget containers
    const containers = document.querySelectorAll('[data-reviews-plethora-campaign]');

    containers.forEach(container => {
      const campaignId = container.getAttribute('data-reviews-plethora-campaign');
      const customApiUrl = container.getAttribute('data-api-url');
      if (campaignId) {
        loadWidget(container, campaignId, customApiUrl || apiBaseUrl);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
