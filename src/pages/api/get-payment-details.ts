import * as bip32 from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { randomBytes } from 'crypto';
import * as tinySecp from 'tiny-secp256k1';

import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentResponse } from "@/types/PaymentResponse";
import { ErrorResponse } from '@/types';

const TESTNET = bitcoin.networks.testnet;
const ERROR_400 = 'Invalid or missing amount.';
const ERROR_500 = "Failed to generate address.";

bitcoin.initEccLib(tinySecp);

const getPaymentDetails = (
    req: NextApiRequest,
    res: NextApiResponse<PaymentResponse | ErrorResponse>
 ) => {
    const amount = req.body.amount;

    if (!amount || isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: ERROR_400 });
        return;
    }

    const keyPair = bip32.BIP32Factory(tinySecp).fromSeed(randomBytes(32), TESTNET);

    const { address } = bitcoin.payments.p2tr({
        internalPubkey: Buffer.from(keyPair.publicKey.slice(1, 33)), 
        network: TESTNET 
    });

    if (!address) {
        res.status(500).json({ error: ERROR_500 });
        return;
    }

    return res.status(200).json({
        address,
        amount
    });
}

export default getPaymentDetails;
