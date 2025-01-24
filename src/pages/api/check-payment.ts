import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { PaymentStatus, ErrorResponse } from "@/types";

const API_URL = 'https://blockstream.info/testnet/api/address';
const ERROR_400 = 'Missing address or expected amount.';
const ERROR_500 = 'Error checking payment status.';

const checkPayment = async (
    req: NextApiRequest,
    res: NextApiResponse<PaymentStatus | ErrorResponse>
  ) => {
    const { address, expectedAmount } = req.query;
  
    if (!address || !expectedAmount) {
      res.status(400).json({ error: ERROR_400 });
      return;
    }
  
    try {
      const apiUrl = `${API_URL}/${address}`;
      const response = await axios.get(apiUrl);

      if (response.status !== 200) {
        res.status(response.status).json({ error: 'Failed to fetch payment status.' });
        return;
      }

      const data = response.data;

      const balanceInSats = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
      const balanceInBTC = balanceInSats / 100_000_000;

      const paymentConfirmed = balanceInBTC >= parseFloat(expectedAmount as string);
      res.status(200).json({ isConfirmed: paymentConfirmed, receivedAmount: balanceInBTC });
    } catch (error) {
      res.status(500).json({ error: ERROR_500 });
    }
  }

  export default checkPayment;