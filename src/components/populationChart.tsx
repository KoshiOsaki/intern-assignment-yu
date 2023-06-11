import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { CHART_COLOR_LIST } from '@/types/color';
import { PrefWithDisplayPopulation } from '@/types/prefecture';

Chart.register(...registerables);

interface Props {
  prefWithDisplayPopulationList: PrefWithDisplayPopulation[];
}

const PopulationChart = (props: Props) => {
  const { prefWithDisplayPopulationList } = props;

  const data = {
    labels: prefWithDisplayPopulationList[0]?.populationList.map((population) => population.year),
    datasets: prefWithDisplayPopulationList.map((pref, index) => ({
      label: pref.prefName,
      data: pref.populationList.map((population) => population.value),
      fill: false,
      borderColor: CHART_COLOR_LIST[index % CHART_COLOR_LIST.length],
      backgroundColor: CHART_COLOR_LIST[index % CHART_COLOR_LIST.length],
      tension: 0.1,
    })),
  };
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: '年',
        },
      },
      y: {
        title: {
          display: true,
          text: '人口 (千人)',
        },
        ticks: {
          callback: (value: any) => {
            const newValue = Math.round(((value as number) / 1000) * 10) / 10;
            return newValue.toLocaleString();
          },
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'nearest' as const,
        intersect: false,
      },
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <div>
      {prefWithDisplayPopulationList.length > 0 ? (
        <Line id="population-chart" data={data} options={options} />
      ) : (
        <div className="bg-white w-full h-[250px] text-center flex items-center">
          <p className="w-full">表示するデータがありません</p>
        </div>
      )}
    </div>
  );
};

export default PopulationChart;
