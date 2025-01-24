import { useState } from 'react';
import axios from 'axios';
import { ErrorResponse, PaymentResponse } from '@/types';

const useGeneratePaymentRequest = () => {
  const [paymentRequest, setPaymentRequest] = useState<PaymentResponse>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setLoading] = useState(false);

  const generatePaymentRequest = async (amount: number) => {
    paymentRequest && setPaymentRequest(undefined);
    error && setError(undefined);

    if (!amount) {
      setError("The BTC amount cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post<PaymentResponse | ErrorResponse>('/api/get-payment-details', { amount });

      if ('error' in data) {
        setError(data.error);
      } else {
        setPaymentRequest(data);
      }
    } catch (error: any) {
      setError('Error generating payment request.');
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentRequest,
    paymentRequestError: error,
    isLoading,
    generatePaymentRequest,
  };
};

export default useGeneratePaymentRequest;