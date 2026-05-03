export const githubReceiptStyles = `
  .gh-receipt *,
  .gh-receipt *::before,
  .gh-receipt *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .gh-receipt {
    --mono: 'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-family: var(--mono);
    width: 425px;
    min-width: 425px;
    margin: 1em auto;
    -webkit-font-smoothing: antialiased;
  }

  .gh-receipt__invoice-container {
    position: relative;
    margin-bottom: 2em;
  }

  .gh-receipt__invoice {
    position: relative;
    width: 85%;
    margin: 0 auto;
    padding: 1em;
    border-radius: 0.5em;
    box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.15);
    transition: background-color 0.4s ease, color 0.4s ease;
  }

  .gh-receipt__title {
    position: relative;
    font-size: 1.15rem;
    padding: 0.55em 0;
    letter-spacing: 0.5px;
    text-align: center;
    margin-bottom: 1.25em;
    font-weight: 500;
  }

  .gh-receipt__header {
    text-align: center;
    padding-bottom: 0.75em;
    margin-bottom: 0.75em;
  }

  .gh-receipt__avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid #e5e7eb;
    margin: 0 auto 0.5em;
    display: block;
    object-fit: cover;
  }

  .gh-receipt__name {
    font-family: var(--sans);
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.3px;
  }

  .gh-receipt__login {
    font-size: 0.78rem;
    margin-top: 2px;
  }

  .gh-receipt__bio {
    font-size: 0.75rem;
    margin-top: 6px;
    font-style: italic;
  }

  .gh-receipt__stats {
    display: flex;
    justify-content: space-around;
    padding: 0.6em 0;
    margin-bottom: 0.75em;
  }

  .gh-receipt__stat {
    text-align: center;
  }

  .gh-receipt__stat-value {
    font-weight: 700;
    font-size: 1rem;
    display: block;
  }

  .gh-receipt__stat-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    margin-top: 2px;
  }

  .gh-receipt__section-title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 0.5em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .gh-receipt__repos {
    list-style-type: none;
    margin-bottom: 0.75em;
  }

  .gh-receipt__repo {
    padding: 0.45em 0;
  }

  .gh-receipt__repo-name {
    font-weight: 600;
    font-size: 0.82rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: transform 120ms ease-out, opacity 120ms ease-out;
    transform-origin: left center;
  }

  .gh-receipt__repo-name:hover {
    transform: translateX(2px);
    opacity: 0.85;
  }

  .gh-receipt__repo-name:active {
    transform: translateX(2px) scale(0.98);
  }

  .gh-receipt__repo-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 2px;
    font-size: 0.7rem;
  }

  .gh-receipt__repo-meta span {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .gh-receipt__lang-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .gh-receipt__repo-desc {
    font-size: 0.7rem;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gh-receipt__footer {
    padding-top: 0.75em;
    text-align: center;
  }

  .gh-receipt__total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    margin-bottom: 0.4em;
  }

  .gh-receipt__total-value {
    font-weight: 700;
    font-size: 1rem;
  }

  .gh-receipt__date {
    font-size: 0.68rem;
    margin-top: 0.75em;
  }

  .gh-receipt__barcode {
    margin: 0.75em auto 0.25em;
    display: flex;
    justify-content: center;
    gap: 1.5px;
    height: 34px;
  }

  .gh-receipt__barcode-bar {
    border-radius: 0.5px;
    animation: gh-barcode-rise 280ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes gh-barcode-rise {
    from {
      transform: scaleY(0);
      transform-origin: bottom;
      opacity: 0;
    }
    to {
      transform: scaleY(1);
      transform-origin: bottom;
      opacity: 1;
    }
  }

  .gh-receipt__lang-dot {
    transition: transform 150ms ease-out;
  }

  .gh-receipt__repo:hover .gh-receipt__lang-dot {
    transform: scale(1.25);
  }

  @media (prefers-reduced-motion: reduce) {
    .gh-receipt *,
    .gh-receipt *::before,
    .gh-receipt *::after {
      animation: none !important;
      transition: none !important;
    }
  }

  .gh-receipt__tagline {
    font-size: 0.6rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 6px;
    opacity: 0.5;
  }

  .gh-receipt hr {
    border: none;
    height: 1px;
    background-color: #ddd;
    margin: 0.75em 0;
  }

  .gh-receipt__payment-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.75em 1em;
    font-size: 1rem;
    color: #6b7280;
  }

  .gh-receipt__card-info {
    display: flex;
    align-items: center;
    gap: 0.75em;
  }

  .gh-customize {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .gh-customize__section {
    margin-bottom: 1.25em;
  }

  .gh-customize__label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #9ca3af;
    margin-bottom: 0.6em;
    font-weight: 500;
  }

  .gh-customize__swatch {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 10px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform 0.15s ease-out, border-color 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .gh-customize__swatch:hover {
    transform: scale(1.08);
  }

  .gh-customize__swatch:active {
    transform: scale(0.95);
  }

  .gh-customize__swatch--selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }

  .gh-customize__swatch-name {
    font-size: 0.6rem;
    text-align: center;
    margin-top: 4px;
    color: #6b7280;
  }

  @media (max-width: 424px) {
    .gh-receipt__invoice {
      padding: 0.75em;
      width: 90%;
    }

    .gh-receipt__title {
      font-size: 1rem;
      padding: 0.5em 0;
    }

    .gh-receipt__name {
      font-size: 1rem;
    }
  }
`;
