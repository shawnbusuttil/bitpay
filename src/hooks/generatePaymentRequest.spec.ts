import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import useGeneratePaymentRequest from './generatePaymentRequest';
import { PaymentResponse, ErrorResponse } from '@/types';

const mockAxios = new MockAdapter(axios);

describe('useGeneratePaymentRequest hook', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGeneratePaymentRequest());

    expect(result.current.paymentRequest).toBeUndefined();
    expect(result.current.paymentRequestError).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should generate a payment request successfully', async () => {
    const mockResponse: PaymentResponse = {
      address: 'testAddress',
      amount: 0.1,
    };

    mockAxios.onPost('/api/get-payment-details').reply(200, mockResponse);

    const { result } = renderHook(() => useGeneratePaymentRequest());

    await result.current.generatePaymentRequest(0.1);
    
    expect(result.current.paymentRequest).toEqual(mockResponse);
    expect(result.current.paymentRequestError).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle error responses from the API', async () => {
    const mockErrorResponse: ErrorResponse = { error: 'Server error' };

    mockAxios.onPost('/api/get-payment-details').reply(500, mockErrorResponse);

    const { result } = renderHook(() => useGeneratePaymentRequest());

    await result.current.generatePaymentRequest(0.1);
    
    expect(result.current.paymentRequest).toBeUndefined();
    expect(result.current.paymentRequestError).toBe('Error generating payment request.');
    expect(result.current.isLoading).toBe(false);
  });

  it('should set an error if amount is empty', async () => {
    const { result } = renderHook(() => useGeneratePaymentRequest());

    await result.current.generatePaymentRequest(0);
    
    expect(result.current.paymentRequest).toBeUndefined();
    expect(result.current.paymentRequestError).toBe("The BTC amount cannot be empty.");
    expect(result.current.isLoading).toBe(false);
  });
});