import axios from 'axios';
import { useRef } from 'react';

import { Population } from '@/types/prefecture';

interface Result {
  label: string;
  data: {
    year: number;
    value: number;
    reate?: number;
  }[];
}

export const useCachedPopulation = () => {
  const cache = useRef<Record<string, Population[]>>({});

  const fetchPopulation = async (prefCode: number, populationType: string): Promise<Population[]> => {
    const cacheKey = `${prefCode}-${populationType}`;

    if (cache.current[cacheKey]) {
      return cache.current[cacheKey];
    }

    try {
      const headers = {
        'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY,
      };
      const res = await axios.get(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear`, {
        headers,
        params: {
          prefCode,
        },
      });
      const data = res.data as {
        result: {
          data: Result[];
        };
      };
      console.log(data);
      const result = data.result.data;
      const populationData = result.find((data) => data.label === populationType);
      if (!populationData) throw new Error('no data');
      const populationList = populationData.data.map((data) => ({
        year: data.year,
        value: data.value,
      }));

      cache.current[cacheKey] = populationList;
      return populationList;
    } catch (e) {
      console.log(e);
      throw new Error('人口データの取得に失敗しました。');
    }
  };

  return { fetchPopulation };
};
