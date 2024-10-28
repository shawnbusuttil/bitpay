import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import useCheckPaymentStatus from './checkPaymentStatus';

jest.mock('axios');
const mockAxios = new MockAdapter(axios);

describe('useCheckPaymentStatus hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCheckPaymentStatus(undefined, undefined));

    expect(result.current.paymentStatus).toBeUndefined();
    expect(result.current.paymentStatusError).toBeUndefined();
    expect(result.current.isPolling).toBe(false);
    expect(result.current.isPaymentReceived).toBeUndefined();
  });

  it('should start polling when startPolling is called', async () => {
    const { result } = renderHook(() => useCheckPaymentStatus('testAddress', 0.001));

    act(() => result.current.startPolling());

    expect(result.current.isPolling).toBe(true);

    await act(async () => jest.advanceTimersByTime(10000));

    expect(axios.get).toHaveBeenCalledWith('/api/check-payment', {
      params: { address: 'testAddress', expectedAmount: 0.001 },
    });
  });
  
  it('should handle error responses from the API', async () => {
    const { result } = renderHook(() => useCheckPaymentStatus('testAddress', 0.001));
    mockAxios.onGet('/api/check-payment').reply(500);
  
    act(() => {
      result.current.startPolling();
    });
  
    await act(async () => {
      jest.advanceTimersByTime(10000);
    });
  
    expect(result.current.paymentStatusError).toBe('Error checking payment status.');
  });

  it('should not poll if address or amount is undefined', () => {
    const { result } = renderHook(() => useCheckPaymentStatus(undefined, undefined));
  
    act(() => {
      result.current.startPolling();
    });
  
    // Since address and amount are undefined, polling should not start
    expect(result.current.isPolling).toBe(false);
  });
});