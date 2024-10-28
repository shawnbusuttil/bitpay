import React from 'react'

type Props = {
  message: string;
  type?: 'success' | 'error';
}

const Message = ({ type = 'success', message }: Props) => {
  return (
    <div className={`mt-5 ${type === 'success' ? 'text-green-700' : 'text-red-700'} `}>
      <p>{message}</p>
    </div>
  )
}

export default Message;