import axios from 'axios';
import { useEffect, useState } from 'react';

import { Population, Prefecture } from '@/types/prefecture';

import type { NextPage } from 'next';

const populationTypeList = ['総人口', '年少人口', '生産年齢人口', '老年人口'];

const headers = {
  'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY,
};

export interface PrefWithDisplayPopulation extends Prefecture {
  populationList: Population[];
}

interface Result {
  label: string;
  data: {
    year: number;
    value: number;
    reate?: number;
  }[];
}

const Home: NextPage = () => {
  // 後でSGにする
  const [prefList, setPrefList] = useState<Prefecture[]>([]);

  const [populationType, setPopulationType] = useState<string>('総人口');
  const [checkedPrefectureIdList, setCheckedPrefectureIdList] = useState<number[]>([]);
  const [prefWithDisplayPopulationList, setPrefWithDisplayPopulationList] = useState<PrefWithDisplayPopulation[]>([]);

  const handleCheckboxChange = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setCheckedPrefectureIdList((prev) => [...prev, id]);
    } else {
      setCheckedPrefectureIdList((prev) => prev.filter((_id) => _id !== id));
    }
  };

  const fetchPrefData = async () => {
    const res = await axios.get('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
      headers: headers,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const data = res.data.result as Prefecture[];
    setPrefList(data);
  };

  const SetPopulationFunc = async () => {
    const _prefWithDisplayPopulationList: PrefWithDisplayPopulation[] = [];
    for (const prefId of checkedPrefectureIdList) {
      const res = await axios.get(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefId}`,
        {
          headers: headers,
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const result = res.data.result.data as Result[];
      const populationData = result.find((data) => data.label === populationType);
      if (!populationData) return;
      const data = populationData.data;
      const populationList = data.map((data) => {
        return {
          year: data.year,
          value: data.value,
        };
      });
      const pref = prefList.find((pref) => pref.prefCode === prefId);
      if (!pref) return;
      _prefWithDisplayPopulationList.push({
        prefCode: pref.prefCode,
        prefName: pref.prefName,
        populationList: populationList,
      });
    }
    setPrefWithDisplayPopulationList(_prefWithDisplayPopulationList);
  };

  useEffect(() => {
    void fetchPrefData();
  }, []);

  useEffect(() => {
    void SetPopulationFunc();
  }, [checkedPrefectureIdList, populationType]);

  return (
    <div className="w-screen h-screen overflow-auto bg-gray-100">
      <header className="text-blue-600 w-full font-bold  text-lg  px-4 py-2 border-b-2 border-gray-300">
        都道府県の総人口推移
      </header>
      <main className="max-w-[500px] mx-auto py-4 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <p className="text-sm">表示したい人口の種別：</p>
            <select
              value={populationType}
              onChange={(e) => setPopulationType(e.target.value)}
              className="w-fit p-1 text-sm"
            >
              {populationTypeList.map((populationType) => (
                <option key={populationType} value={populationType}>
                  {populationType}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <p className="text-sm">都道府県を選択してください</p>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                onClick={() => setCheckedPrefectureIdList([])}
              >
                <p>選択をリセット</p>
              </button>
            </div>
            <div className="grid grid-cols-6 gap-4 border-2 border-gray-400 p-3 rounded-md">
              {prefList.map((pref) => (
                <div key={pref.prefCode} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`pref-${pref.prefCode}`}
                    value={pref.prefCode}
                    checked={checkedPrefectureIdList.includes(pref.prefCode)}
                    onChange={() => handleCheckboxChange(pref.prefCode, true)}
                  />
                  <label htmlFor={`pref-${pref.prefCode}`} className="text-xs">
                    {pref.prefName}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <PopulationChart prefWithDisplayPopulationList={prefWithDisplayPopulationList} /> */}
      </main>
    </div>
  );
};

export default Home;
