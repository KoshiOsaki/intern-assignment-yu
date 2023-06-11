import axios from 'axios';

import { Prefecture } from '@/types/prefecture';

export const fetchPrefList = async (): Promise<Prefecture[]> => {
  try {
    const headers = {
      'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY,
    };
    const res = await axios.get('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
      headers,
    });
    const data = res.data as { result: Prefecture[] };
    const prefList = data.result;
    return prefList;
  } catch (e) {
    throw new Error('都道府県データの取得に失敗しました。');
  }
};
