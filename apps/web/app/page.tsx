'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Page() {
  const [codeUrl, setCodeUrl] = useState<string>('');

  async function handleClick() {
    const resp = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (resp.ok) {
      const res = await resp.json();
      const url = res.data?.code_url;
      if (url) {
        setCodeUrl(url);
      }
      console.log('ok =>', res);
    } else {
      console.error('error =>', await resp.text());
    }
  }

  return (
    <main className="container mx-auto">
      <div className="w-full min-h-screen flex flex-col gap-10 justify-center items-center py-16 bg-gray-800">
        <button className="p-4 rounded-xl bg-green-400 text-white hover:opacity-85" onClick={handleClick}>
          微信支付
        </button>
        <div className="bg-white rounded-2xl p-5">
          <span className="size-[240px]">{codeUrl && <QRCodeSVG id="wechat-pay-qrcode" value={codeUrl} size={240} level={'H'} />}</span>
        </div>
        <p className="text-center text-gray-100 text-sm">使用微信扫描二维码进行支付</p>
      </div>
    </main>
  );
}
