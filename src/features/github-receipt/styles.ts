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
    width: 100%;
    max-width: 425px;
    margin: 1em auto;
    -webkit-font-smoothing: antialiased;
  }

  .gh-receipt__invoice-container {
    position: relative;
    margin-bottom: 2em;
  }

  /* Receipt printer machine + "printing out" effect */
  .gh-printer {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .gh-printer__machine {
    position: relative;
    z-index: 3;
    width: 92%;
    height: 62px;
    border-radius: 16px 16px 9px 9px;
    background: linear-gradient(#ececec, #c9c9c9);
    box-shadow:
      inset 0 9px 7px rgba(255, 255, 255, 0.9),
      inset 0 -12px 14px rgba(0, 0, 0, 0.12),
      inset 7px 0 9px rgba(0, 0, 0, 0.16),
      inset -7px 0 9px rgba(0, 0, 0, 0.16),
      0 12px 20px rgba(0, 0, 0, 0.28);
    /* Pull the paper up so its top tucks behind the machine and emerges
       through the slot, instead of sitting below as a separate sheet. */
    margin-bottom: -10px;
  }

  .gh-printer__brand {
    position: absolute;
    left: 16px;
    top: 13px;
    font-family: var(--mono);
    font-size: 0.55rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.42);
  }

  .gh-printer__led {
    position: absolute;
    right: 16px;
    top: 15px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 6px #22c55e;
    animation: gh-printer-blink 1.4s linear infinite;
  }

  @keyframes gh-printer-blink {
    0%, 70% { opacity: 1; }
    71%, 100% { opacity: 0.2; }
  }

  .gh-printer__mouth {
    position: absolute;
    left: 3%;
    right: 3%;
    bottom: 5px;
    height: 6px;
    border-radius: 4px;
    background: #161616;
    box-shadow:
      inset 0 2px 3px rgba(0, 0, 0, 0.85),
      0 1px 0 rgba(255, 255, 255, 0.5);
  }

  /* The paper lives inside this window. Its top is permanently clipped at
     the slot, so the receipt always reads as continuous paper emerging from
     the machine (never a separate card sitting below it). padding-bottom
     leaves room for the paper's drop-shadow. */
  .gh-printer__feed {
    position: relative;
    z-index: 5;
    width: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;
    padding-bottom: 72px;
  }

  .gh-receipt__paper {
    position: relative;
    width: 100%;
    will-change: transform;
  }

  .gh-receipt__paper--shadow {
    filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.18));
  }

  /* Flat top (continuous paper) + torn / perforated bottom edge */
  .gh-receipt__invoice--torn {
    border-radius: 0;
    -webkit-mask: radial-gradient(circle at bottom, transparent 0.45rem, #000 0.5rem);
    mask: radial-gradient(circle at bottom, transparent 0.45rem, #000 0.5rem);
    -webkit-mask-size: 10% 100%;
    mask-size: 10% 100%;
  }

  .gh-receipt__invoice {
    position: relative;
    width: 85%;
    margin: 0 auto;
    padding: 1.15em 1.25em;
    border-radius: 0.5em;
    box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.15);
    transition: background-color 0.4s ease, color 0.4s ease;
  }

  .gh-receipt__title {
    position: relative;
    font-size: 1.1rem;
    padding: 0.6em 0;
    letter-spacing: 0.3px;
    text-align: center;
    margin-bottom: 1em;
    font-weight: 600;
  }

  .gh-receipt__header {
    text-align: center;
    padding-bottom: 0.9em;
    margin-bottom: 0.9em;
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
    margin-top: 3px;
  }

  .gh-receipt__bio {
    font-size: 0.75rem;
    margin-top: 8px;
    font-style: italic;
    line-height: 1.45;
  }

  .gh-receipt__stats {
    display: flex;
    justify-content: space-around;
    padding: 0.75em 0;
    margin-bottom: 0.9em;
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
    margin-bottom: 0.4em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .gh-receipt__repos {
    list-style-type: none;
    margin-bottom: 0.9em;
  }

  .gh-receipt__repo {
    padding: 0.55em 0;
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
    gap: 12px;
    margin-top: 5px;
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
    margin-top: 4px;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gh-receipt__footer {
    padding-top: 0.9em;
    text-align: center;
  }

  .gh-receipt__total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75em;
    font-size: 0.78rem;
    letter-spacing: 0.5px;
    margin-bottom: 0.45em;
    white-space: nowrap;
  }

  .gh-receipt__total-value {
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: -0.2px;
    white-space: nowrap;
  }

  .gh-receipt__total-value--lead {
    font-size: 1.1rem;
  }

  .gh-receipt__date {
    font-size: 0.66rem;
    letter-spacing: 0.5px;
    margin-top: 0.9em;
    opacity: 0.85;
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
    margin-top: 8px;
    opacity: 0.5;
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
