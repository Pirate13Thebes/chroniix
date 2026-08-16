/**
 * @file regexPatterns.ts
 * @description Centralized Institutional Regex Validation Patterns for Chronix.
 * Contains validated regular expressions for institutional inputs, employee IDs,
 * phone numbers, email validation, national identification numbers (NIN), and passwords.
 */

/**
 * Regex pattern for Employee ID format: EMP-XXXX-YY (e.g., EMP-1024-MU)
 * - Must start with 'EMP-'
 * - Followed by 4 digits
 * - Followed by '-' and 2 uppercase letters (country/branch code)
 */
export const REGEX_EMP_ID = /^EMP-\d{4}-[A-Z]{2}$/;

/**
 * Regex pattern for Institutional / Corporate Email Addresses:
 * - Requires standard user@domain.tld format
 * - Disallows invalid special characters at start/end of username
 */
export const REGEX_INSTITUTIONAL_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Regex pattern for Mauritian & International Phone Numbers:
 * - Supports optional +230 or 230 country code prefix
 * - Followed by 8-digit mobile/landline number starting with 5, 7, 8, or 9
 */
export const REGEX_MAURITIAN_PHONE = /^(\+230|230)?\s?[5789]\d{7}$/;

/**
 * Regex pattern for National Identity Card Number (Mauritian NIN):
 * - Starts with 1 uppercase letter (matching surname initial)
 * - Followed by 13 digits (date of birth + serial)
 * - Ends with 1 uppercase checksum letter
 * Example: A120485123456B
 */
export const REGEX_MAURITIAN_NIN = /^[A-Z]\d{13}[A-Z]$/;

/**
 * Regex pattern for Strong Passwords:
 * - Minimum 8 characters in length
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 numeric digit (0-9)
 * - At least 1 special character (@$!%*?&)
 */
export const REGEX_STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Interface representing field validation rule options.
 */
export interface ValidationRule {
  /** Regular expression pattern to test field value against */
  pattern: RegExp;
  /** Error message string displayed when validation fails */
  errorMessage: string;
  /** Optional custom validator function for non-regex rule logic */
  customValidator?: (value: string) => boolean;
}

/**
 * Dictionary of standard pre-configured validation rules by field key.
 */
export const VALIDATION_RULES: Record<string, ValidationRule> = {
  employeeId: {
    pattern: REGEX_EMP_ID,
    errorMessage: 'Employee ID must match format EMP-XXXX-XX (e.g. EMP-1024-MU)',
  },
  email: {
    pattern: REGEX_INSTITUTIONAL_EMAIL,
    errorMessage: 'Please enter a valid institutional email address (e.g. user@company.com)',
  },
  phone: {
    pattern: REGEX_MAURITIAN_PHONE,
    errorMessage: 'Please enter a valid Mauritian phone number (8 digits, starting with 5, 7, 8, or 9)',
  },
  nationalId: {
    pattern: REGEX_MAURITIAN_NIN,
    errorMessage: 'National ID must match format A120485123456B (1 letter, 13 digits, 1 letter)',
  },
  password: {
    pattern: REGEX_STRONG_PASSWORD,
    errorMessage: 'Password must be at least 8 chars with uppercase, lowercase, digit, & special char (@$!%*?&)',
  },
};
