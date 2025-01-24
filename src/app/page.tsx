"use client"

import React, { useEffect, useState } from 'react'
import Send from '@/components/Send';
import Message from '@/components/Message';
import useGeneratePaymentRequest from '@/hooks/generatePaymentRequest';
import useCheckPaymentStatus from '@/hooks/checkPaymentStatus';

const Home = () => {
  const [amount, setAmount] = useState(0);
  const { generatePaymentRequest, paymentRequestError, isLoading, paymentRequest } = useGeneratePaymentRequest();
  const { paymentStatus, paymentStatusError, isPolling, isPaymentReceived, startPolling } = useCheckPaymentStatus(paymentRequest?.address, paymentRequest?.amount);

  const handleGeneratePaymentRequest = (event: React.FormEvent) => {
    event.preventDefault();
    generatePaymentRequest(amount);
  };

  useEffect(() => {
    if (paymentRequest && 'address' in paymentRequest) {
      startPolling();
    }
  }, [paymentRequest, startPolling]);

  return (
    <div className='flex flex-col py-5 items-center min-w-[250px] text-center'>
      <h1 className='font-bold text-2xl mb-5'>Bitcoin Testnet Payment</h1>

      {!paymentRequest && (
        <form className='flex flex-col justify-between items-center h-[150px]' onSubmit={handleGeneratePaymentRequest}>
        <label className='block'>Enter the amount of Bitcoin you wish to send:</label>
        <input className='w-[200px] text-black p-1 rounded-md' type='number' step="0.00000001" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />

        <button className='block bg-orange-700 p-2 rounded-full w-[250px]' type='submit' disabled={isLoading || !amount}>
          {isLoading ? 'Generating...' : 'Generate Payment Request'}
        </button>
      </form>
      )}

      {paymentRequest?.address && (
        <Send address={paymentRequest.address} amount={paymentRequest.amount} />
      )}
      
      {/* Messages */}
      <div className='mt-5'>
        {isPolling && <p>Checking the blockchain for payment...</p>} 
        {/* Improvement suggestion: Loader Component */}
        
        {isPaymentReceived && <Message message={`The payment of ${paymentStatus?.receivedAmount}₿ received!`} />}
        {paymentRequestError && <Message message={paymentRequestError} type='error' />}
        {paymentStatusError && <Message message={paymentStatusError} type='error' />}
      </div>
    </div>
  )
}

export default Home;