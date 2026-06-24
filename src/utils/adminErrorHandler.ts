import { toast } from 'sonner';
import { AxiosError } from 'axios';

export class AdminServiceError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AdminServiceError';
  }
}

export const handleApiError = (error: unknown): AdminServiceError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 500;
    const data = error.response?.data as any;
    
    const code = data?.error?.code ?? 'UNKNOWN_ERROR';
    const message = data?.error?.message ?? data?.message ?? error.message ?? 'An error occurred';
    const details = data?.error?.details;

    // Specific error handling
    if (status === 401) {
      // Unauthorized - user needs to login
      toast.error('Session expired. Please login again.');
    } else if (status === 403) {
      // Forbidden - no permission
      toast.error('You do not have permission to perform this action.');
    } else if (status === 404) {
      // Not found
      toast.error('Resource not found.');
    } else if (status === 409) {
      // Conflict
      toast.error('Conflict: ' + message);
    } else if (status === 429) {
      // Rate limited
      toast.error('Too many requests. Please try again later.');
    } else if (status >= 500) {
      // Server error
      toast.error('Server error. Please try again later.');
    } else {
      // Other client errors
      toast.error(message);
    }

    return new AdminServiceError(status, code, message, details);
  }

  // Network error
  if (error instanceof Error) {
    toast.error('Network error: ' + error.message);
    return new AdminServiceError(0, 'NETWORK_ERROR', error.message);
  }

  // Unknown error
  toast.error('An unexpected error occurred');
  return new AdminServiceError(0, 'UNKNOWN_ERROR', 'An unexpected error occurred');
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showInfoToast = (message: string) => {
  toast.info(message);
};
