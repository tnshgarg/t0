import { CITY_CENTERS } from './dummy';

export interface StoryScene {
  id: string;
  title: string;
  description: string;
  viewState: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  duration: number;
  layers: {
    nightLights?: boolean;
    urbanBoundaries?: boolean;
    vegetation?: boolean;
    temperature?: boolean;
    predictiveGhost?: boolean;
  };
  activeCity?: {
    name: string;
    lat: number;
    lng: number;
  };
  year?: number;
}

const getCity = (name: string) => CITY_CENTERS.find(c => c.name === name);

export const STORYBOARD: StoryScene[] = [
  {
    id: 'intro',
    title: 'Global System',
    description: 'Earth at night reveals the pulse of human civilization.',
    viewState: { latitude: 20, longitude: 0, zoom: 1.5 },
    duration: 6000,
    layers: { nightLights: true },
    year: 2012
  },
  {
    id: 'tokyo-growth',
    title: 'Tokyo: Urban Density',
    description: 'The world\'s largest metropolitan economy showing massive night footprint.',
    viewState: { latitude: 35.7, longitude: 139.7, zoom: 5.5 },
    duration: 8000,
    layers: { nightLights: true, urbanBoundaries: true },
    activeCity: getCity('Tokyo'),
    year: 2018
  },
  {
    id: 'amazon-tradeoff',
    title: 'Sao Paulo: The Edge',
    description: 'Witness the relationship between urbanization and green cover loss.',
    viewState: { latitude: -23.5, longitude: -46.6, zoom: 6 },
    duration: 8000,
    layers: { urbanBoundaries: true, vegetation: true },
    activeCity: getCity('São Paulo'),
    year: 2020
  },
  {
    id: 'mumbai-heat',
    title: 'Mumbai: Heat Island',
    description: 'Dense population centers correlate with higher local temperatures.',
    viewState: { latitude: 19.1, longitude: 72.9, zoom: 7 },
    duration: 8000,
    layers: { urbanBoundaries: true, temperature: true },
    activeCity: getCity('Mumbai'),
    year: 2022
  },
  {
    id: 'ny-future',
    title: 'New York: Future',
    description: 'Projected urban expansion if current trends continue through 2035.',
    viewState: { latitude: 40.7, longitude: -74.0, zoom: 6 },
    duration: 10000, // Longer for future
    layers: { urbanBoundaries: true, predictiveGhost: true },
    activeCity: getCity('New York'),
    year: 2035
  },
  {
    id: 'outro',
    title: 'One Planet',
    description: 'Understanding our footprint is the first step toward balance.',
    viewState: { latitude: 10, longitude: 100, zoom: 1.8 },
    duration: 6000,
    layers: { nightLights: true, vegetation: true },
    year: 2024
  }
];
