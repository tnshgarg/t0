import React, { useMemo, useState, useCallback } from 'react';
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

import { useSplitView } from '../context/SplitViewContext';
import { generateNightLights, generateUrbanBoundaries } from '../data/dummy';

const INITIAL_VIEW_STATE = {
  latitude: 20,
  longitude: 0,
  zoom: 1.0,
  minZoom: 0.5,
  maxZoom: 8,
};

interface GlobeProps {
  year: number;
  side: 'left' | 'right';
  viewState: any;
  onViewStateChange: (viewState: any) => void;
  showNightLights: boolean;
  showUrbanBoundaries: boolean;
}

const Globe: React.FC<GlobeProps> = ({ 
  year, 
  side, 
  viewState, 
  onViewStateChange,
  showNightLights,
  showUrbanBoundaries
}) => {
  // Premium Lighting
  const effects = useMemo(() => {
    const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 1.5 });
    const pointLight = new PointLight({ color: [255, 255, 255], intensity: 2.0, position: [10, 20, 80000] });
    return [new LightingEffect({ ambientLight, pointLight })];
  }, []);

  // Memoize data generation with year dependency for urban layer
  const nightLightsData = useMemo(() => generateNightLights(400), []);
  const urbanData = useMemo(() => generateUrbanBoundaries(20, year), [year]);

  // Earth Base Layer
  const earthTileLayer = new TileLayer({
    id: `earth-tiles-${side}`,
    data: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: (props: any) => {
      const { bbox: { west, south, east, north } } = props.tile;
      return new BitmapLayer(props, {
        data: undefined,
        image: props.data,
        bounds: [west, south, east, north]
      });
    }
  });

  // Color schemes for left (past/blue) vs right (present/purple)
  const colorRange = side === 'left' 
    ? [ [50, 150, 220], [60, 170, 235], [80, 190, 245], [100, 210, 255], [130, 225, 255], [160, 240, 255] ]
    : [ [140, 70, 200], [155, 85, 215], [168, 100, 230], [180, 115, 245], [195, 140, 255], [210, 170, 255] ];

  const layers = [
    earthTileLayer,
    
    // Night Lights - Premium 3D HexagonLayer
    showNightLights && new HexagonLayer({
      id: `night-lights-${side}`,
      gpuAggregation: true,
      data: nightLightsData,
      getPosition: (d: any) => d.position,
      radius: 60000,
      elevationScale: 40,
      elevationRange: [0, 2500],
      extruded: true,
      coverage: 0.8,
      pickable: false,
      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51]
      },
      transitions: {
        elevationScale: 2000
      },
      colorRange: colorRange as any,
    }),

    // Urban Boundaries - Subtle filled polygons
    showUrbanBoundaries && new GeoJsonLayer({
      id: `urban-boundaries-${side}`,
      data: urbanData as any,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      getLineColor: side === 'left' ? [100, 200, 255, 200] : [180, 100, 255, 200],
      getFillColor: side === 'left' ? [100, 180, 255, 50] : [168, 85, 247, 50],
      updateTriggers: { data: year }
    }),
  ].filter(Boolean);

  const labelColor = side === 'left' ? 'text-cyan-400' : 'text-purple-400';
  const labelGlow = side === 'left' ? 'shadow-cyan-500/50' : 'shadow-purple-500/50';

  return (
    <div className="relative w-full h-full">
      <DeckGL
        views={new GlobeView({ resolution: 8 })}
        viewState={viewState}
        onViewStateChange={({ viewState: newViewState }: any) => onViewStateChange(newViewState)}
        controller={{
          inertia: true,
          scrollZoom: { speed: 0.01, smooth: true },
          dragRotate: true,
        }}
        layers={layers}
        effects={effects}
        useDevicePixels={true}
        style={{ background: '#000005' }}
      />
      {/* Year Badge */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 ${labelColor} font-mono text-lg font-bold backdrop-blur-xl bg-black/50 px-4 py-2 rounded-full border border-current/40 shadow-lg ${labelGlow}`}>
        {year}
      </div>
    </div>
  );
};

export const SplitEarthCanvas: React.FC = () => {
  const { leftYear, rightYear } = useSplitView();
  
  // Synchronized view states for both globes
  const [sharedViewState, setSharedViewState] = useState(INITIAL_VIEW_STATE);

  const handleViewStateChange = useCallback((newViewState: any) => {
    setSharedViewState(newViewState);
  }, []);

  return (
    <div className="w-full h-full flex">
      {/* Left Globe */}
      <div className="flex-1 h-full border-r border-white/10 relative">
        <Globe 
          year={leftYear} 
          side="left" 
          viewState={sharedViewState}
          onViewStateChange={handleViewStateChange}
          showNightLights={true}
          showUrbanBoundaries={true}
        />
        <div className="absolute bottom-4 left-4 text-white/30 font-mono text-xs uppercase tracking-widest">
          Past
        </div>
      </div>

      {/* Right Globe */}
      <div className="flex-1 h-full relative">
        <Globe 
          year={rightYear} 
          side="right" 
          viewState={sharedViewState}
          onViewStateChange={handleViewStateChange}
          showNightLights={true}
          showUrbanBoundaries={true}
        />
        <div className="absolute bottom-4 right-4 text-white/30 font-mono text-xs uppercase tracking-widest">
          Present
        </div>
      </div>

      {/* Center Divider Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 font-mono text-xs uppercase tracking-widest rotate-90 pointer-events-none">
        Compare
      </div>
    </div>
  );
};
