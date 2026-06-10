import type { TrustLabel } from '../types';

const COPY: Record<TrustLabel, { label: string; tooltip: string }> = {
  pending: {
    label: 'Pending verification',
    tooltip: 'Domain not yet checked against the bMail registry.'
  },
  certified: {
    label: 'Verified sender',
    tooltip: 'Domain is certified in the bMail registry (KT-attested).'
  },
  fake: {
    label: 'Suspicious domain',
    tooltip: 'Domain is not in the bMail registry. Looks like a lookalike of a certified domain.'
  },
  unknown: {
    label: 'Unverified domain',
    tooltip: 'A regular domain outside the bMail registry. No identifiability guarantee.'
  }
};

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M4.2 7.2L6.1 9.1L9.8 5.0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 1.4L13 12.0H1L7 1.4Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="7" y1="5.4" x2="7" y2="8.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="10.4" r="0.75" fill="currentColor" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M5.0 5.2C5.0 4.1 5.9 3.5 7.0 3.5C8.1 3.5 9.0 4.2 9.0 5.2C9.0 6.6 7.0 6.6 7.0 8.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="7" cy="10.4" r="0.75" fill="currentColor" />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 2" />
    </svg>
  );
}

type Props = { label: TrustLabel };

export function TrustBadge({ label }: Props) {
  const copy = COPY[label];
  const Icon =
    label === 'certified'
      ? CheckIcon
      : label === 'fake'
        ? WarningIcon
        : label === 'unknown'
          ? QuestionIcon
          : PendingIcon;
  return (
    <span className={`trust-badge trust-${label}`} title={copy.tooltip}>
      <span className="trust-icon">
        <Icon />
      </span>
      <span>{copy.label}</span>
    </span>
  );
}
