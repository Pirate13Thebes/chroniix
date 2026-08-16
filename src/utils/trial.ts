import type { BusinessSettings } from '../types';

const TRIAL_DAYS = 7;

export function getTrialStatus(settings: BusinessSettings) {
  if (!settings.trialStartedAt || settings.trialCancelled) {
    return { active: false, daysRemaining: 0, daysElapsed: 0, expired: false };
  }
  const startedAt = new Date(settings.trialStartedAt).getTime();
  const daysElapsed = Math.floor((Date.now() - startedAt) / 86400000);
  const daysRemaining = Math.max(0, TRIAL_DAYS - daysElapsed);
  return { active: true, daysRemaining, daysElapsed, expired: daysRemaining <= 0 };
}

// Guess a card brand from the leading digit — cosmetic only, this is a
// frontend-only prototype with no payment processor behind it. We never
// store more than last4 + expiry; the full number/CVV are used to derive
// those two fields and then discarded.
export function guessCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  return 'Card';
}
