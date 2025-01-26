import { Payment } from 'wechatpay-nextjs-v3';
import * as fs from 'node:fs';
import { NextRequest, NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';

const APP_ID = 'wx87e6873e57b4a22f';
const MCH_ID = '1629434062';
const apiKey = '4CLc3dGkcPssipgT3RQ4HotgfL7QHVfN';
const wechatPay = new Payment({
  appid: APP_ID,
  mchid: MCH_ID,
  privateKey: fs.readFileSync('./apiclient_key.pem'),
  publicKey: fs.readFileSync('./apiclient_cert.pem'),
  key: apiKey,
});

const nanoid = customAlphabet('1234567890');

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'ok',
    },
    {
      status: 200,
    },
  );
}

export async function POST(request: NextRequest) {
  const tradeNo = nanoid(32);
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

  return NextResponse.json(
    {
      data: { ...resp },
    },
    {
      status: 200,
    },
  );
}
