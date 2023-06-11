export interface Prefecture {
  prefCode: number;
  prefName: string;
}

export interface Population {
  year: number;
  value: number;
}

export interface PrefWithDisplayPopulation extends Prefecture {
  populationList: Population[];
}
