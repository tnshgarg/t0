import React, { useMemo, useState, useCallback, useEffect } from 'react';
// @ts-ignore
import DeckGL from '@deck.gl/react';
// @ts-ignore
import { _GlobeView as GlobeView, FlyToInterpolator } from '@deck.gl/core';
// @ts-ignore
import { TileLayer } from '@deck.gl/geo-layers';
// @ts-ignore
import { BitmapLayer, GeoJsonLayer } from '@deck.gl/layers';
// @ts-ignore
import { HexagonLayer } from '@deck.gl/aggregation-layers';
// @ts-ignore
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';

import { useTimeEngine } from '../context/TimeEngine';
import { generateNightLights, generatePredictiveData, generateVegetationData, generateTemperatureData, generateInvertedMask } from '../data/dummy';
import { CitySelector, CITIES } from './ui/CitySelector';
import { LayerPanel } from './ui/LayerPanel';
import { FutureSlider } from './ui/FutureSlider';
import { useCinematicStory } from '../hooks/useCinematicStory';
import { AnimatePresence, motion } from 'framer-motion';

const INITIAL_VIEW_STATE = {
  /* INTRO VIEW STATE */
  latitude: 0,
  longitude: 0,
  zoom: 0, // Far away
  minZoom: 0,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
  opacity: 0, // Custom prop for fade-in (handled in layers)
  transitionDuration: 0,
};

const MAIN_VIEW_STATE = {
  latitude: 20,
  longitude: 0,
  zoom: 1.2,
  minZoom: 0.5,
  maxZoom: 8,
  pitch: 0,
  bearing: 0,
  opacity: 1,
  transitionDuration: 4000,
  transitionInterpolator: new FlyToInterpolator({ curve: 2 }), // Slow Cinematic Curve
};

interface LayerState {
  nightLights: boolean;
  urbanBoundaries: boolean;
  predictiveGhost: boolean;
  vegetation: boolean;
  temperature: boolean;
}

export const EarthCanvas: React.FC = () => {
  const { currentYear, setYear } = useTimeEngine();
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [layerState, setLayerState] = useState<LayerState>({
    nightLights: true,
    urbanBoundaries: true,
    predictiveGhost: false,
    vegetation: false,
    temperature: false,
  });
  const [futureYear, setFutureYear] = useState(2035);
  
  /* PREMIUM LIGHTING */
  const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 1.5 });
  const pointLight = new PointLight({ color: [255, 255, 255], intensity: 2.0, position: [10, 20, 80000] });
  const effects = [new LightingEffect({ ambientLight, pointLight })];

  const [inIntro, setInIntro] = useState(true);

  // Trigger Intro Animation on Mount
  useEffect(() => {
    // Small delay before starting
    const timer = setTimeout(() => {
      setViewState(MAIN_VIEW_STATE);
      // Wait for fly transition to finish before showing UI
      setTimeout(() => setInIntro(false), 4000); 
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const { isPlaying, currentScene, startStory, stopStory, progress } = useCinematicStory(
    setViewState,
    setLayerState,
    setYear
  );

  // FlyTo function for smooth camera transitions
  const flyTo = useCallback((lat: number, lng: number, zoom: number) => {
    setViewState({
      ...viewState,
      latitude: lat,
      longitude: lng,
      zoom: zoom,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    } as any);
  }, [viewState]);

  // City selection handler
  const handleCitySelect = (city: typeof CITIES[0]) => {
    setSelectedCity(city.name);
    flyTo(city.lat, city.lng, city.zoom);
  };

  // Layer toggle handler
  const handleLayerToggle = (layerId: string) => {
    setLayerState(prev => ({
      ...prev,
      [layerId]: !prev[layerId as keyof LayerState],
    }));
  };

  // Layer config for UI
  const layerConfig = [
    { id: 'nightLights', name: 'Night Lights', color: '#FFB432', enabled: layerState.nightLights },
    { id: 'urbanBoundaries', name: 'Urban Growth', color: '#64C8FF', enabled: layerState.urbanBoundaries },
    { id: 'vegetation', name: 'Green Cover', color: '#22C55E', enabled: layerState.vegetation },
    { id: 'temperature', name: 'Temperature', color: '#F97316', enabled: layerState.temperature },
    { id: 'predictiveGhost', name: 'Future Projection', color: '#A855F7', enabled: layerState.predictiveGhost },
  ];

  // Memoize data generation (Performance Optimization)
  const nightLightsData = useMemo(() => generateNightLights(500), []);
  // Calculate growth percent based on future year (more years = more growth)
  const growthPercent = useMemo(() => Math.max(10, (futureYear - currentYear) * 3), [futureYear, currentYear]);
  const predictiveData = useMemo(() => generatePredictiveData(currentYear, growthPercent), [currentYear, growthPercent]);
  const vegetationData = useMemo(() => generateVegetationData(500), []);
  const temperatureData = useMemo(() => generateTemperatureData(500), []);
  
  // Generate Spotlight Mask for cinematic mode
  const spotlightMask = useMemo(() => {
    if (isPlaying && currentScene?.activeCity) {
      return generateInvertedMask(currentScene.activeCity.lat, currentScene.activeCity.lng, 600);
    }
    return null;
  }, [isPlaying, currentScene]);
  
  // Spotlight fade animation
  const [spotlightOpacity, setSpotlightOpacity] = useState(0);
  useEffect(() => {
    if (isPlaying && spotlightMask) {
      const timer = setTimeout(() => setSpotlightOpacity(0.75), 800);
      return () => clearTimeout(timer);
    } else {
      setSpotlightOpacity(0);
    }
  }, [isPlaying, spotlightMask]);

  // Earth Base Layer
  const earthTileLayer = new TileLayer({
    id: 'earth-tiles',
    data: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: (props: any) => {
      const { bbox: { west, south, east, north } } = props.tile;
      return new BitmapLayer(props, {
        data: undefined,
        image: props.data,
        bounds: [west, south, east, north],
        opacity: inIntro ? Math.min(1, Math.max(0, (viewState.zoom - 0.2))) : 1
      });
    }
  });

  // Build layers array based on state - PREMIUM HEXAGONLAYER VISUALIZATION
  const layers = [
    earthTileLayer,

    // Night Lights - Premium 3D Hexagon Towers
    layerState.nightLights && new HexagonLayer({
      id: 'night-lights',
      gpuAggregation: true,
      data: nightLightsData,
      getPosition: (d: any) => d.position,
      radius: 50000,
      elevationScale: nightLightsData?.length ? 50 : 0,
      elevationRange: [0, 3000],
      extruded: true,
      pickable: true,
      coverage: 0.85,
      upperPercentile: 100,
      material: { ambient: 0.64, diffuse: 0.6, shininess: 32, specularColor: [51, 51, 51] },
      transitions: { elevationScale: 3000 },
      colorRange: [
        [1, 152, 189], [73, 227, 206], [216, 254, 181],
        [254, 237, 177], [254, 173, 84], [209, 55, 78]
      ],
    }),

    // Urban Growth - Cyan Hexagon Density Grid
    layerState.urbanBoundaries && new HexagonLayer({
      id: 'urban-boundaries',
      gpuAggregation: true,
      data: nightLightsData,
      getPosition: (d: any) => d.position,
      radius: 80000,
      elevationScale: nightLightsData?.length ? 40 : 0,
      elevationRange: [0, 1500],
      extruded: true,
      coverage: 0.75,
      pickable: false,
      upperPercentile: 95,
      material: { ambient: 0.64, diffuse: 0.6, shininess: 32, specularColor: [51, 51, 51] },
      transitions: { elevationScale: 3000 },
      colorRange: [
        [50, 180, 220], [60, 190, 230], [80, 200, 240],
        [100, 210, 250], [120, 220, 255], [150, 240, 255]
      ],
      updateTriggers: { data: currentYear }
    }),

    // Predictive Ghost - Purple Phantom Projection
    layerState.predictiveGhost && new HexagonLayer({
      id: 'predictive-ghost',
      gpuAggregation: true,
      data: predictiveData.features?.map((f: any) => ({
        position: f.geometry.coordinates[0]?.[0] || [0, 0],
        intensity: 0.7,
        weight: f.properties?.growthPercent || 30
      })) || [],
      getPosition: (d: any) => d.position,
      radius: 100000,
      elevationScale: 30,
      extruded: true,
      coverage: 0.6,
      pickable: false,
      material: { ambient: 0.64, diffuse: 0.6, shininess: 32, specularColor: [51, 51, 51] },
      transitions: { elevationScale: 3000 },
      colorRange: [
        [120, 60, 180], [140, 70, 200], [160, 80, 220],
        [168, 85, 247], [180, 100, 255], [200, 130, 255]
      ],
    }),

    // Vegetation - Forest Green Hexagon Columns
    layerState.vegetation && new HexagonLayer({
      id: 'vegetation',
      gpuAggregation: true,
      data: vegetationData,
      getPosition: (d: any) => d.position,
      radius: 70000,
      elevationScale: vegetationData?.length ? 40 : 0,
      elevationRange: [0, 1200],
      extruded: true,
      coverage: 0.7,
      pickable: false,
      material: { ambient: 0.64, diffuse: 0.6, shininess: 32, specularColor: [51, 51, 51] },
      transitions: { elevationScale: 3000 },
      colorRange: [
        [34, 140, 70], [34, 160, 80], [40, 180, 90],
        [50, 197, 100], [60, 210, 110], [80, 230, 130]
      ],
    }),

    // Temperature - Heat Island Hexagon Towers
    layerState.temperature && new HexagonLayer({
      id: 'temperature',
      gpuAggregation: true,
      data: temperatureData,
      getPosition: (d: any) => d.position,
      radius: 60000,
      elevationScale: temperatureData?.length ? 45 : 0,
      elevationRange: [0, 2000],
      extruded: true,
      coverage: 0.8,
      pickable: false,
      material: { ambient: 0.64, diffuse: 0.6, shininess: 32, specularColor: [51, 51, 51] },
      transitions: { elevationScale: 3000 },
      colorRange: [
        [255, 230, 150], [255, 200, 100], [255, 160, 60],
        [255, 120, 40], [255, 80, 20], [255, 40, 0]
      ],
    }),

    // Cinematic Spotlight Vignette - dims areas outside focus during story
    spotlightMask && new GeoJsonLayer({
      id: 'spotlight-vignette',
      data: spotlightMask as any,
      filled: true,
      stroked: false,
      getFillColor: [0, 0, 5, Math.floor(spotlightOpacity * 255)],
    }),
  ].filter(Boolean);

  return (
    <>
      {/* City Selector Panel - Hide during cinematic or intro */}
      {!isPlaying && !inIntro && <CitySelector onCitySelect={handleCitySelect} selectedCity={selectedCity} />}
      
      {/* Intro Title Overlay */}
      <AnimatePresence>
        {inIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black pointer-events-none"
          >
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 2, delay: 0.5 }}
               className="text-center"
            >
               <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 tracking-tighter mb-4">
                 ANTIGRAVITY
               </h1>
               <p className="text-blue-400 font-mono text-sm tracking-[0.3em] uppercase">Planet Scale Simulation</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Controls */}
      <div className="absolute top-6 right-6 z-30 flex gap-4">
        {!isPlaying && !inIntro ? (
          <button
            onClick={startStory}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            PLAY STORY
          </button>
        ) : (
          <button
            onClick={stopStory}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/80 text-white rounded-full font-bold shadow-lg hover:bg-red-500 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
            STOP
          </button>
        )}
      </div>

      {/* Cinematic Overlay */}
      <AnimatePresence>
        {isPlaying && currentScene && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-12 left-0 right-0 z-30 flex justify-center pointer-events-none"
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden pointer-events-auto">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300 ease-linear" style={{ width: `${progress}%` }} />
              
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{currentScene.title}</h2>
                  <p className="text-white/70 text-sm leading-relaxed">{currentScene.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-widest text-white/30 font-mono mb-1">YEAR</div>
                  <div className="text-xl font-bold text-blue-400 font-mono">{currentScene.year || currentYear}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer Control Panel - Hide during cinematic or intro */}
      {!isPlaying && !inIntro && (
      <LayerPanel layers={layerConfig} onToggle={handleLayerToggle} maxLayers={3}>
        <FutureSlider 
          projectionYear={futureYear} 
          onYearChange={setFutureYear} 
          enabled={layerState.predictiveGhost}
        />
      </LayerPanel>
      )}

      <DeckGL
        views={new GlobeView({ resolution: 10 })}
        viewState={viewState}
        onViewStateChange={({ viewState: newViewState }: any) => setViewState(newViewState)}
        controller={{
          inertia: true,
          scrollZoom: { speed: 0.01, smooth: true },
          dragRotate: true,
          touchRotate: true,
          keyboard: true,
        }}
        layers={layers}
        effects={effects} // Add lighting
        useDevicePixels={true}
        style={{ background: '#000005' }}
      >
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/30 pointer-events-none font-mono text-xs uppercase tracking-widest">
          Year: {currentYear} | Antigravity Engine
        </div>
      </DeckGL>
    </>
  );
};
