'use server';

import { NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';
import { Payment } from 'wechatpay-nextjs-v3';
import { API_KEY, APP_ID, MCH_ID, PRIVATE_KEY, PUBLIC_KEY } from './config';

const nanoid = customAlphabet('1234567890');

export async function GET(request: Request) {
  return NextResponse.json({
    status: '',
  });
}

export async function POST(request: Request) {
  const tradeNo = nanoid(32);

  try {
    const wechatPay = new Payment({
      appid: APP_ID,
      mchid: MCH_ID,
      privateKey: Buffer.from(PRIVATE_KEY, 'utf8'),
      publicKey: Buffer.from(PUBLIC_KEY, 'utf8'),
      key: API_KEY,
    });
    const resp = await wechatPay.transactions_native({
      out_trade_no: tradeNo,
      appid: APP_ID,
      mchid: MCH_ID,
      amount: {
        total: 1,
        currency: 'CNY',
      },
      description: '购买测试产品 1',
      notify_url: `https://example.com/api/wechatpay/notify/${tradeNo}`,
    });
    return NextResponse.json({
      ...resp
    })
  } catch (e) {
    console.error('error =>', e);
  }

  return NextResponse.json(
    {
      data: { tradeNo },
    },
    {
      status: 200,
    },
  );
}
