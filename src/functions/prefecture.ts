import axios from 'axios';

import { Population, Prefecture } from '@/types/prefecture';

const headers = {
  'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY,
};

export const fetchPrefList = async (): Promise<Prefecture[]> => {
  const res = await axios.get('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
    headers: headers,
  });
  const data = res.data as { result: Prefecture[] };
  const prefList = data.result;
  return prefList;
};

interface Result {
  label: string;
  data: {
    year: number;
    value: number;
    reate?: number;
  }[];
}

export const fetchPopulation = async (prefCode: number, populationType: string): Promise<Population[]> => {
  const res = await axios.get(
    `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`,
    {
      headers: headers,
    },
  );
  const data = res.data as {
    result: {
      data: Result[];
    };
  };
  const result = data.result.data;
  const populationData = result.find((data) => data.label === populationType);
  if (!populationData) throw new Error('no data');
  const populationList = populationData.data.map((data) => ({
    year: data.year,
    value: data.value,
  }));
  return populationList;
};
