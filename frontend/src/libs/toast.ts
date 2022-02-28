import { toast, ToastContent, ToastOptions } from 'react-toastify';

export const showToast = {
  success(content: ToastContent, options?: ToastOptions) {
    toast.success(content, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      ...options,
    });
  },
  info(content: ToastContent, options?: ToastOptions) {
    toast.info(content, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      ...options,
    });
  },
  error(content: ToastContent, options?: ToastOptions) {
    toast.error(content, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      ...options,
    });
  },
  warning(content: ToastContent, options?: ToastOptions) {
    toast.warning(content, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      ...options,
    });
  },
  dark(content: ToastContent, options?: ToastOptions) {
    toast.dark(content, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      ...options,
    });
  },
  warn(content: ToastContent, options?: ToastOptions) {
    toast.warn(content, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      ...options,
    });
  },
};

export const {
  success: showSuccessToast,
  error: showErrorToast,
  info: showInfoToast,
  warning: showWarningToast,
  dark: showDarkToast,
  warn: showWarnToast,
} = showToast;
