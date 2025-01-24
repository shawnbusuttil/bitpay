import React from 'react'
import QRCode from './QRCode'

type Props = {
    address: string;
    amount: number;
}

const Send = ({ address, amount }: Props) => {
  return (
    <div className='flex flex-col items-center text-center justify-between h-[280px] lg:h-[260px] w-[95%]'>
        <p className='mx-2 w-full break-words'>Scan the QR code to send {amount} BTC to {address}:</p>
        <QRCode address={address} />
    </div>
  )
}

export default Send