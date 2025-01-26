'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Page() {
  const [codeUrl, setCodeUrl] = useState<string>('');

  async function handleClick() {
    const resp = await fetch('http://localhost:8000/api/wechat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (resp.ok) {
      console.log('ok =>', await resp.json());
    } else {
      console.error('error =>', await resp.text());
    }
  }

  return (
    <main className="container mx-auto">
      <div className="w-full flex justify-center items-center ">
        <button className="p-4 rounded-xl" onClick={handleClick}>
          点击支付
        </button>
        <div>{codeUrl && <QRCodeSVG id="wechat-pay-qrcode" value={codeUrl} size={300} level={'H'} />}</div>
      </div>
    </main>
  );
}
