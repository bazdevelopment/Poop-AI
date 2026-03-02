import type { ReactElement } from 'react';
import type { ToastProps } from 'sonner-native/lib/typescript/commonjs/src/types';
import { StyleSheet } from 'react-native';
import { toast } from 'sonner-native';

// Default styles
const styles = StyleSheet.create({
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    color: '#666666',
  },
});

// Default options that will be applied to all toasts
const defaultOptions = {
  duration: 12000,
  position: 'top-center',
} as ToastProps;

// Helper function to merge options
function mergeOptions(options?: ToastProps): ToastProps {
  return {
    ...defaultOptions,
    ...options,
  };
}

// Success toast
export function showSuccess(message: string, options?: ToastProps) {
  return toast.success(message, {
    ...mergeOptions(options),
    actionButtonStyle: styles.actionButton,
    actionButtonTextStyle: styles.actionButtonText,
    richColors: true,
  });
}

// Error toast
export function showError(message: string, options?: ToastProps) {
  return toast.error(message, {
    duration: 5000, // Longer duration for errors
    richColors: true,
    ...mergeOptions(options),
  });
}

// Warning toast
export function showWarning(message: string, options?: ToastProps) {
  return toast.warning(message, {
    ...mergeOptions(options),
    richColors: true,
  });
}

// Info toast
export function showInfo(message: string, options?: ToastProps) {
  return toast(message, {
    ...mergeOptions(options),
  });
}

// Loading toast
export function showLoading(message: string, options?: ToastProps) {
  return toast.loading(message, {
    ...mergeOptions(options),
  });
}

// Promise toast
export async function showPromise<T>(
  promise: Promise<T>,
  {
    loading = 'Loading...',
    success = 'Completed successfully!',
    error = 'Something went wrong',
    ...options
  }: {
    loading?: string;
    success?: string | ((data: T) => string);
    error?: string | ((error: any) => string);
  } & ToastProps,
) {
  return toast.promise(promise, {
    ...mergeOptions(options),
    loading,
    success,
    error,
    richColors: true,
  });
}

// Action toast
export function showWithAction(
  message: string,
  {
    actionLabel,
    onAction,
    ...options
  }: {
    actionLabel: string;
    onAction: () => void;
  } & ToastProps,
) {
  return toast(message, {
    ...mergeOptions(options),
    action: {
      label: actionLabel,
      onClick: onAction,
    },
    actionButtonStyle: styles.actionButton,
    actionButtonTextStyle: styles.actionButtonText,
  });
}

// Dismiss specific toast
export function dismiss(toastId?: string) {
  toast.dismiss(toastId);
}

// Dismiss all toasts
export function dismissAll() {
  toast.dismiss();
}

export function showCustomToast(jsx: ReactElement, options?: ToastProps) {
  toast.custom(jsx, {
    duration: 10000,
    ...mergeOptions(options),
  });
}
// Export all functions as a single object for convenience
const Toast = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  promise: showPromise,
  withAction: showWithAction,
  dismiss,
  dismissAll,
  showCustomToast,
};

export default Toast;
