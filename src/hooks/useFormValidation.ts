/**
 * @file useFormValidation.ts
 * @description Custom React hook for real-time form input validation with instant visual state toggles.
 * Provides `.is-valid` and `.is-invalid` CSS class generators, real-time regex checking,
 * touch state tracking, and inline field error text rendering below inputs.
 */

import { useState, useCallback } from 'react';
import type { ValidationRule } from '../utils/regexPatterns';

/** State map holding input field string values */
export type FormValues = Record<string, string>;
/** State map tracking which fields have been blurred / interacted with */
export type FormTouched = Record<string, boolean>;
/** State map storing current error messages per field */
export type FormErrors = Record<string, string>;

/** Configuration map linking field names to their respective validation rules */
export type FormRules = Record<string, ValidationRule>;

export interface UseFormValidationReturn {
  /** Map of current form input values */
  values: FormValues;
  /** Map of field touched states */
  touched: FormTouched;
  /** Map of active error messages */
  errors: FormErrors;
  /** Boolean flag indicating overall form validity */
  isValid: boolean;
  /** Input change handler function */
  handleChange: (field: string, value: string) => void;
  /** Input blur handler function */
  handleBlur: (field: string) => void;
  /** Utility function returning CSS class string '.form-input .is-valid' or '.is-invalid' */
  getFieldClass: (field: string, baseClass?: string) => string;
  /** Helper function returning inline error message if field is touched & invalid */
  getFieldError: (field: string) => string | null;
  /** Function to manually set or reset values */
  setValues: React.Dispatch<React.SetStateAction<FormValues>>;
  /** Reset form validation state back to initial values */
  resetForm: () => void;
  /** Trigger validation on all fields at once (e.g. before submit) */
  validateAll: () => boolean;
}

/**
 * Custom Hook: useFormValidation
 * @param initialValues Initial form values dictionary
 * @param rules Validation rules dictionary mapping field names to ValidationRule
 */
export function useFormValidation(
  initialValues: FormValues,
  rules: FormRules
): UseFormValidationReturn {
  // Line-by-line state initialization
  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState<FormTouched>({});
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Helper to validate a single field value against its rule
   * Returns error message string if invalid, or empty string if valid
   */
  const validateField = useCallback(
    (field: string, value: string): string => {
      const rule = rules[field];
      if (!rule) return ''; // No rule specified for this field

      // Test value against regex pattern
      if (!rule.pattern.test(value)) {
        return rule.errorMessage;
      }

      // Execute custom validator function if present
      if (rule.customValidator && !rule.customValidator(value)) {
        return rule.errorMessage;
      }

      return ''; // Field is valid
    },
    [rules]
  );

  /**
   * Input Change Handler: updates field value and runs real-time inline validation
   */
  const handleChange = useCallback(
    (field: string, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Run inline validation on change
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [validateField]
  );

  /**
   * Input Blur Handler: marks field as touched and updates validation state
   */
  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const currentValue = values[field] || '';
      const error = validateField(field, currentValue);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [values, validateField]
  );

  /**
   * Compute CSS Class Name for an input field:
   * Returns baseClass + ' is-valid' or ' is-invalid' based on touch & error state.
   */
  const getFieldClass = useCallback(
    (field: string, baseClass: string = 'form-input'): string => {
      const isFieldTouched = touched[field];
      const hasError = !!errors[field];
      const val = values[field] || '';

      if (!isFieldTouched) return baseClass;

      if (hasError) {
        return `${baseClass} is-invalid`;
      } else if (val.length > 0) {
        return `${baseClass} is-valid`;
      }

      return baseClass;
    },
    [touched, errors, values]
  );

  /**
   * Return error message string if the field has been touched and contains an error
   */
  const getFieldError = useCallback(
    (field: string): string | null => {
      if (touched[field] && errors[field]) {
        return errors[field];
      }
      return null;
    },
    [touched, errors]
  );

  /**
   * Validate all registered fields at once (used during form submit attempt)
   */
  const validateAll = useCallback((): boolean => {
    const newTouched: FormTouched = {};
    const newErrors: FormErrors = {};
    let valid = true;

    Object.keys(rules).forEach((field) => {
      newTouched[field] = true;
      const val = values[field] || '';
      const err = validateField(field, val);
      newErrors[field] = err;
      if (err) valid = false;
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return valid;
  }, [rules, values, validateField]);

  /**
   * Reset form state back to clean initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setErrors({});
  }, [initialValues]);

  // Overall form validity check (true if no errors and all required fields validated)
  const isFormValid =
    Object.keys(rules).every((field) => {
      const val = values[field] || '';
      return val.length > 0 && !validateField(field, val);
    });

  return {
    values,
    touched,
    errors,
    isValid: isFormValid,
    handleChange,
    handleBlur,
    getFieldClass,
    getFieldError,
    setValues,
    resetForm,
    validateAll,
  };
}
