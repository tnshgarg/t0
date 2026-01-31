import React, { useMemo, useState, useCallback, useEffect } from 'react';
// @ts-ignore
import DeckGL from '@deck.gl/react';
// @ts-ignore
import { _GlobeView as GlobeView, FlyToInterpolator } from '@deck.gl/core';
// @ts-ignore
import { TileLayer } from '@deck.gl/geo-layers';
// @ts-ignore
import { BitmapLayer, ScatterplotLayer, GeoJsonLayer, TextLayer } from '@deck.gl/layers';
// @ts-ignore
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

import { useTimeEngine } from '../context/TimeEngine';
import { useUI } from '../context/UIContext';
import { generateNightLights, generateUrbanBoundaries, generatePredictiveData, generateVegetationData, generateTemperatureData, generateInvertedMask, COUNTRY_DATA } from '../data/dummy';
import { CitySelector, CITIES } from './ui/CitySelector';
import { LayerPanel } from './ui/LayerPanel';
import { FutureSlider } from './ui/FutureSlider';
import { DashboardOverlay } from './ui/DashboardOverlay';
import { ZoomControls } from './ui/ZoomControls';
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
    nightLights: false,
    urbanBoundaries: false,
    predictiveGhost: false,
    vegetation: false,
    temperature: false,
  });
  const [futureYear, setFutureYear] = useState(2035);
  const [inIntro, setInIntro] = useState(true);
  const { isDashboardOpen, setDashboardOpen } = useUI();
  // Sync local state if needed OR just use global directly.
  // We will replace 'showDashboard' and 'setShowDashboard' with 'isDashboardOpen' and 'setDashboardOpen'
  const showDashboard = isDashboardOpen;
  const setShowDashboard = setDashboardOpen;

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
    { 
      id: 'nightLights', 
      name: 'Night Lights', 
      color: '#FFB432', 
      enabled: layerState.nightLights,
      description: 'Visible light emissions from cities.'
    },
    { 
      id: 'urbanBoundaries', 
      name: 'Urban Growth', 
      color: '#64C8FF', 
      enabled: layerState.urbanBoundaries,
      description: 'City limits expanding over time.'
    },
    { 
      id: 'vegetation', 
      name: 'Green Cover', 
      color: '#22C55E', 
      enabled: layerState.vegetation,
      description: 'Forest density and deforestation zones.'
    },
    { 
      id: 'temperature', 
      name: 'Temperature', 
      color: '#F97316', 
      enabled: layerState.temperature,
      description: 'Heat intensity and urban heat islands.'
    },
    { 
      id: 'predictiveGhost', 
      name: 'Future Projection', 
      color: '#A855F7', 
      enabled: layerState.predictiveGhost,
      description: 'AI-predicted urban expansion by 2035.'
    },
  ];

  // Memoize data generation (Performance Optimization) - DYNAMIC TIME SCALING
  const nightLightsData = useMemo(() => generateNightLights(15000, currentYear), [currentYear]);
  const urbanData = useMemo(() => generateUrbanBoundaries(20, currentYear), [currentYear]);
  // Calculate growth percent based on future year (more years = more growth)
  const growthPercent = useMemo(() => Math.max(10, (futureYear - currentYear) * 3), [futureYear, currentYear]);
  const predictiveData = useMemo(() => generatePredictiveData(currentYear, growthPercent), [currentYear, growthPercent]);
  // BOOST DATA: 50,000 points for Vegetation to ensure Heatmap density
  const vegetationData = useMemo(() => generateVegetationData(50000, currentYear), [currentYear]);
  const temperatureData = useMemo(() => generateTemperatureData(12000, currentYear), [currentYear]);
  
  // DEBUG: Log data counts
  useEffect(() => {
    console.log("DeckGL Data Counts:", {
      nightLights: nightLightsData.length,
      vegetation: vegetationData.length,
      temperature: temperatureData.length,
      urbanBoundaries: urbanData.features?.length
    });
  }, [nightLightsData, vegetationData, temperatureData, urbanData]);
  
  // Zoom Handlers - Explicit Transition for buttons
  const handleZoomIn = useCallback(() => {
    setViewState(v => ({ 
      ...v, 
      zoom: Math.min(20, (v.zoom || 1) + 1.2), // Slightly larger step
      transitionDuration: 800, // Smoother
      transitionInterpolator: new FlyToInterpolator({ curve: 1 }) 
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewState(v => ({ 
      ...v, 
      zoom: Math.max(0, (v.zoom || 1) - 1.2), 
      transitionDuration: 800,
      transitionInterpolator: new FlyToInterpolator({ curve: 1 }) 
    }));
  }, []);

  // Sync scene changes to view state
  useEffect(() => {
    if (isPlaying && currentScene) {
      const scene = currentScene as any;
      setViewState(prev => ({
        ...prev,
        latitude: scene.latitude,
        longitude: scene.longitude,
        zoom: scene.zoom,
        pitch: scene.pitch,
        bearing: scene.bearing,
        transitionDuration: scene.transitionDuration
      }));
    }
  }, [currentScene, isPlaying]);
  
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
    data: 'https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
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

  // Build layers array - SIMPLE VISIBLE DATA POINTS
  const layers = [
    earthTileLayer,

    // World Borders (Real Geometries)
    new GeoJsonLayer({
      id: 'world-borders',
      data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson',
      stroked: true,
      filled: false,
      lineWidthMinPixels: 0.5,
      getLineColor: [255, 255, 255, 40], // Subtle white lines
      pickable: false,
    }),

    // Night Lights - Bulk Data Visualization
    layerState.nightLights && new ScatterplotLayer({
      id: 'night-lights',
      data: nightLightsData,
      getPosition: (d: any) => d.position,
      getFillColor: [255, 200, 80, 150], // Lower opacity for density
      getRadius: (d: any) => 5000 + d.intensity * 5000, // Smaller radius (5-10km)
      radiusMinPixels: 0.5,
      radiusMaxPixels: 3,
      opacity: 0.8,
      pickable: false,
    }),

    // Urban Boundaries - Polygon outlines
    layerState.urbanBoundaries && new GeoJsonLayer({
      id: 'urban-boundaries',
      data: urbanData as any,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      getLineColor: [100, 200, 255, 200],
      getFillColor: [100, 180, 255, 40],
      pickable: false,
      updateTriggers: { data: currentYear }
    }),

    // Predictive Ghost - Purple projection outlines
    layerState.predictiveGhost && new GeoJsonLayer({
      id: 'predictive-ghost',
      data: predictiveData as any,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      getLineColor: [168, 85, 247, 180],
      getFillColor: [168, 85, 247, 30],
      pickable: false,
    }),

    // Vegetation - Dense Dots (Design Thinking)
    layerState.vegetation && new ScatterplotLayer({
      id: 'vegetation',
      data: vegetationData,
      getPosition: (d: any) => d.position,
      getFillColor: [34, 197, 94, 200], // Vibrant Green
      getRadius: 10000, // Smaller radius for "dot" look
      radiusMinPixels: 1.5,
      radiusMaxPixels: 3,
      opacity: 0.8,
      pickable: false,
    }),

    // Temperature - Dense Heat Dots
    layerState.temperature && new ScatterplotLayer({
      id: 'temperature',
      data: temperatureData,
      getPosition: (d: any) => d.position,
      // Dynamic Color: Yellow (Low) -> Red (High)
      getFillColor: (d: any) => [
        255, 
        Math.floor(255 * (1 - Math.min(1, d.intensity))), 
        0, 
        180
      ],
      getRadius: 15000,
      radiusMinPixels: 2,
      radiusMaxPixels: 5,
      opacity: 0.7,
      pickable: false,
    }),

    // Cinematic Spotlight Vignette
    spotlightMask && new GeoJsonLayer({
      id: 'spotlight-vignette',
      data: spotlightMask as any,
      filled: true,
      stroked: false,
      getFillColor: [0, 0, 5, Math.floor(spotlightOpacity * 255)],
    }),

    // Country Labels
    new TextLayer({
      id: 'country-labels',
      data: COUNTRY_DATA,
      // Add altitude (Z) to lift strictly off the surface to avoid clipping
      getPosition: (d: any) => [d.position[0], d.position[1], 100000], 
      getText: (d: any) => d.name,
      getSize: 12,
      getSizeScale: 1,
      getColor: [200, 220, 255, 200], // Slightly more opaque
      fontFamily: '"Geist Mono", monospace', 
      fontWeight: 600,
      outlineWidth: 3,
      outlineColor: [0, 0, 0, 255],
      billboard: true,   // Face camera
      characterSet: 'auto', // Ensure full charset
    }),
  ].filter(Boolean);

  return (
    <>
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
        useDevicePixels={true}
        style={{ background: '#000005' }}
      />
      
      {/* Footer Info */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/30 pointer-events-none font-mono text-xs uppercase tracking-widest z-10">
        Year: {currentYear} | Satellite's Diary
      </div>

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
                 Satellite's Diary
               </h1>
               <p className="text-blue-400 font-mono text-sm tracking-[0.3em] uppercase">Planet Scale Simulation</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Layer Control Panel - No Limit */}
      {!isPlaying && !inIntro && (
      <LayerPanel layers={layerConfig} onToggle={handleLayerToggle}>
        <FutureSlider 
          projectionYear={futureYear} 
          onYearChange={setFutureYear} 
          enabled={layerState.predictiveGhost}
        />
      </LayerPanel>
      )}

      {/* Zoom Controls */}
      {!inIntro && (
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      )}

      {/* Dashboard Overlay */}
      <AnimatePresence>
        {showDashboard && <DashboardOverlay year={currentYear} city={selectedCity} onClose={() => setShowDashboard(false)} />}
      </AnimatePresence>
    </>
  );
};
