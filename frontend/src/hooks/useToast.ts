import { ApolloError } from '@apollo/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

interface Option {
  error: ApolloError | string | null | undefined;
  message?: string;
  redirect?: string;
}

export const useErrorToast = ({ error, message, redirect }: Option) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.error(error);

      toast.error(message ?? error, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });

      if (redirect) {
        navigate(redirect);
      }
    }
  }, [error, message, redirect]);
};
