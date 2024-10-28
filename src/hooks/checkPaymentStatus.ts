import { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorResponse, PaymentStatus } from '@/types';

const useCheckPaymentStatus = (address: string | undefined, amount: number | undefined) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>();
  const [isPolling, setPolling] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  const checkPaymentStatus = async () => {
    try {
      const { data } = await axios.get<PaymentStatus | ErrorResponse>(`/api/check-payment`, {
        params: {
          address,
          expectedAmount: amount,
        },
      });

      if ('error' in data) {
        setError(data.error);
        return;
      }

      setPaymentStatus(data);
    } catch (error: any) {
      setError('Error checking payment status.');
    }
  };

  useEffect(() => {
    if (isPolling && !pollInterval) {
      const interval = setInterval(checkPaymentStatus, 10000);
      setPollInterval(interval);
      return () => clearInterval(interval);
    }
  }, [isPolling]);

  useEffect(() => {
    if (paymentStatus?.isConfirmed) {
      setPolling(false);
      setPollInterval(null);
    }
  }, [paymentStatus]);

  const startPolling = () => {
    if (address && amount !== undefined) {
      setPolling(true);
    }
  };

  return {
    paymentStatus,
    paymentStatusError: error,
    isPolling,
    isPaymentReceived: paymentStatus?.isConfirmed,
    startPolling
  };
};

export default useCheckPaymentStatus;