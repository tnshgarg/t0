// Major city coordinates with SAFE SPREAD limits (to avoid ocean spill)
export const CITY_CENTERS = [
  { name: 'New York', lat: 40.7, lng: -74.0, safeSpread: 0.8 },
  { name: 'London', lat: 51.5, lng: -0.1, safeSpread: 1.0 },
  { name: 'Tokyo', lat: 35.7, lng: 139.7, safeSpread: 0.6 },
  { name: 'Mumbai', lat: 19.1, lng: 72.9, safeSpread: 0.7 },
  { name: 'Shanghai', lat: 31.2, lng: 121.5, safeSpread: 0.8 },
  { name: 'São Paulo', lat: -23.5, lng: -46.6, safeSpread: 1.5 },
  { name: 'Lagos', lat: 6.5, lng: 3.4, safeSpread: 0.8 },
  { name: 'Cairo', lat: 30.0, lng: 31.2, safeSpread: 1.5 },
  { name: 'Sydney', lat: -33.9, lng: 151.2, safeSpread: 0.5 },
  { name: 'Moscow', lat: 55.8, lng: 37.6, safeSpread: 4.0 }, // Inland
  { name: 'Delhi', lat: 28.6, lng: 77.2, safeSpread: 3.0 }, // Inland
  { name: 'Beijing', lat: 39.9, lng: 116.4, safeSpread: 2.0 },
  { name: 'Los Angeles', lat: 34.1, lng: -118.2, safeSpread: 0.8 },
  { name: 'Paris', lat: 48.9, lng: 2.4, safeSpread: 2.0 },
  { name: 'Istanbul', lat: 41.0, lng: 29.0, safeSpread: 0.8 },
  { name: 'Karachi', lat: 24.9, lng: 67.1, safeSpread: 0.7 },
  { name: 'Buenos Aires', lat: -34.6, lng: -58.4, safeSpread: 1.0 },
  { name: 'Jakarta', lat: -6.2, lng: 106.8, safeSpread: 0.5 }, // Island
  { name: 'Seoul', lat: 37.6, lng: 127.0, safeSpread: 0.8 },
  { name: 'Singapore', lat: 1.3, lng: 103.8, safeSpread: 0.2 }, // Small island
];

// Major Country Labels for Map Context
export const COUNTRY_DATA = [
  { name: "USA", position: [-98.6, 39.8] },
  { name: "China", position: [103.8, 36.6] },
  { name: "India", position: [79.0, 22.0] },
  { name: "Brazil", position: [-53.2, -10.3] },
  { name: "Russia", position: [99.5, 63.3] },
  { name: "Australia", position: [134.4, -24.3] },
  { name: "Canada", position: [-107.4, 58.5] },
  { name: "Euro", position: [13.4, 51.2] }, // Generic label for Europe
  { name: "Africa", position: [20.7, 5.4] }, // Continental label (simplification)
];

export const generateNightLights = (count: number, year: number = 2012) => {
  const data = [];
  // Simulating urban growth: 3% increase per year from base year 2012
  const growthMultiplier = 1 + ((year - 2012) * 0.03);
  const effectiveCount = Math.floor(count * growthMultiplier);
  const pointsPerCity = Math.floor(effectiveCount / CITY_CENTERS.length);
  
  for (const city of CITY_CENTERS) {
    // Dense core points (Stay TIGHT to center)
    for (let i = 0; i < pointsPerCity * 0.5; i++) {
        // Core spread is very small (10% of safe spread)
      const spread = city.safeSpread * 0.1; 
      data.push({
        position: [
          city.lng + (Math.random() - 0.5) * spread,
          city.lat + (Math.random() - 0.5) * spread,
        ],
        intensity: 0.8 + Math.random() * 0.2, // High intensity core
        weight: 80 + Math.random() * 20,
      });
    }
    // Suburbs (Stay within safe limits)
    for (let i = 0; i < pointsPerCity * 0.5; i++) {
      const spread = city.safeSpread; // Max safe spread
      data.push({
        position: [
          city.lng + (Math.random() - 0.5) * spread,
          city.lat + (Math.random() - 0.5) * spread,
        ],
        intensity: 0.3 + Math.random() * 0.4,
        weight: 30 + Math.random() * 50,
      });
    }
  }
  return data;
};

export const generateUrbanBoundaries = (count: number, year: number) => {
  const features = [];
  // Simulating growth by expanding radius based on year
  const growthFactor = (year - 2012) / 12; 
  
  // Use subset of cities for urban boundaries
  const citiesToUse = CITY_CENTERS.slice(0, Math.min(count, CITY_CENTERS.length));
  
  for (let i = 0; i < citiesToUse.length; i++) {
    const city = citiesToUse[i];
    const baseRadius = 0.5 + Math.random() * 0.5;
    const radius = baseRadius + (growthFactor * 0.8); // Grow based on year

    // ORGANIC SHAPE GENERATION (No more circles)
    const poly = [];
    const numPoints = 16; // More points for jagged look
    const noiseOffset = Math.random() * 100;
    
    for (let angle = 0; angle <= 360; angle += (360/numPoints)) {
      const rad = (angle * Math.PI) / 180;
      // Perlin-like noise simulation using sin/cos combinations
      const noise = Math.sin(angle * 0.1 + noiseOffset) * 0.3 + Math.cos(angle * 0.3) * 0.2;
      const r = radius * (0.8 + Math.abs(noise)); // Vary radius organically
      
      poly.push([
        city.lng + Math.cos(rad) * r,
        city.lat + Math.sin(rad) * r * 0.8, // Flatten for latitude perspective
      ]);
    }
    poly.push(poly[0]); // Close loop

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [poly],
      },
      properties: {
        name: city.name,
        year: year,
      },
    });
  }

  return {
    type: 'FeatureCollection',
    features,
  };
};

export const generatePopulationData = (count: number) => {
  const data = [];
  const pointsPerCity = Math.floor(count / CITY_CENTERS.length);
  
  for (const city of CITY_CENTERS) {
    for (let i = 0; i < pointsPerCity; i++) {
      const spread = 2;
      data.push({
        coordinates: [
          city.lng + (Math.random() - 0.5) * spread,
          city.lat + (Math.random() - 0.5) * spread,
        ],
        weight: 20 + Math.random() * 80,
      });
    }
  }
  return data;
};

// Predictive Ghost - Future projection data
export const generatePredictiveData = (baseYear: number, growthPercent: number) => {
  const features = [];
  const projectionFactor = growthPercent / 100;
  
  // Project urban growth into the future
  const citiesToUse = CITY_CENTERS.slice(0, 15);
  
  for (const city of citiesToUse) {
    // Future radius is larger than current
    const currentRadius = 0.5 + ((baseYear - 2012) / 12) * 0.8;
    const futureRadius = currentRadius * (1 + projectionFactor);

    // Create outer ring showing projected growth
    const poly = [];
    for (let angle = 0; angle <= 360; angle += 30) {
      const rad = (angle * Math.PI) / 180;
      poly.push([
        city.lng + Math.cos(rad) * futureRadius,
        city.lat + Math.sin(rad) * futureRadius * 0.7,
      ]);
    }

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [poly],
      },
      properties: {
        name: city.name + ' (Projected)',
        projectionYear: baseYear + 10,
        growthPercent,
      },
    });
  }

  return {
    type: 'FeatureCollection',
    features,
  };
};

export const generateVegetationData = (count: number, year: number = 2012) => {
  const data = [];
  // Simulating deforestation: 1.5% decrease per year
  const declineMultiplier = Math.max(0.5, 1 - ((year - 2012) * 0.015)); 
  const effectiveCount = Math.floor(count * declineMultiplier);

  // Use random locations but AVOID city centers to simulate inverse correlation
  // Focus on tropical regions and forested areas
  // SAFE FOREST ZONES (Rectangles [minLng, maxLng, minLat, maxLat])
  // Carefully defined so they are purely INLAND
  const forestZones = [
      { name: "Amazon", bounds: [-70, -55, -10, 2] }, // Deep inland Amazon
      { name: "Congo", bounds: [12, 28, -4, 4] }, // Central Africa
      { name: "Siberia", bounds: [80, 120, 55, 65] }, // Deep Russia
      { name: "EastUS", bounds: [-85, -78, 35, 42] }, // Appalachians (Safe)
      { name: "CentralEurope", bounds: [10, 25, 46, 52] }, // Alps/Carpathians
      { name: "India Central", bounds: [77, 83, 18, 24] }, // Deccan Plateau
  ];

  for (const zone of forestZones) {
    const zonePoints = Math.floor(effectiveCount / forestZones.length);
    const [minLng, maxLng, minLat, maxLat] = zone.bounds;
    
    for (let i = 0; i < zonePoints; i++) {
      const lat = minLat + Math.random() * (maxLat - minLat);
      const lng = minLng + Math.random() * (maxLng - minLng);
      
      data.push({
        position: [lng, lat],
        intensity: 0.6 + Math.random() * 0.4,
        weight: 50 + Math.random() * 50,
        height: 0.5 + Math.random() * 0.5,
      });
    }
  }
  return data;
};

export const generateTemperatureData = (count: number, year: number = 2012) => {
  const data = [];
  // Global warming simulation: Increase intensity and spread over years
  const warmingOffset = (year - 2012) * 0.02; 

  // Correlate with cities (Urban Heat Island effect)
  for (const city of CITY_CENTERS) {
    const pointsPerCity = Math.floor(count / CITY_CENTERS.length);
    // Hot core
    for (let i = 0; i < pointsPerCity * 0.5; i++) {
      const spread = (city as any).safeSpread * 0.2; // Very tight core
      data.push({
        position: [
          city.lng + (Math.random() - 0.5) * spread,
          city.lat + (Math.random() - 0.5) * spread
        ],
        intensity: Math.min(1, 0.85 + Math.random() * 0.15 + warmingOffset),
        weight: 70 + Math.random() * 30,
      });
    }
    // Warm outer ring (Safe spread)
    for (let i = 0; i < pointsPerCity * 0.5; i++) {
        const spread = (city as any).safeSpread || 1.0; 
      data.push({
        position: [
          city.lng + (Math.random() - 0.5) * spread,
          city.lat + (Math.random() - 0.5) * spread
        ],
        intensity: 0.5 + Math.random() * 0.35,
        weight: 30 + Math.random() * 40,
      });
    }
  }
  return data;
};

export const generateMaskPolygon = (lat: number, lng: number, radiusKm: number) => {
  const steps = 64;
  const positions = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    // Approximating degrees (1 deg lat ~ 111km, 1 deg lng ~ 111km * cos(lat))
    const latOffset = (radiusKm / 111) * Math.sin(angle);
    const lngOffset = (radiusKm / (111 * Math.cos(lat * Math.PI / 180))) * Math.cos(angle);
    positions.push([lng + lngOffset, lat + latOffset]);
  }
  positions.push(positions[0]);
  
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [positions]
    }
  };
};

/**
 * Creates an inverted mask - a world-covering polygon with a circular cutout
 * This creates a spotlight/vignette effect where the focus area is visible
 * but surrounding areas are dimmed.
 */
export const generateInvertedMask = (lat: number, lng: number, radiusKm: number) => {
  const steps = 64;
  
  // Outer ring: covers the entire world  
  const outerRing = [
    [-180, -85],
    [180, -85],
    [180, 85],
    [-180, 85],
    [-180, -85]
  ];
  
  // Inner ring (hole): the spotlight cutout - winds COUNTER-CLOCKWISE to create hole
  const innerRing = [];
  for (let i = steps - 1; i >= 0; i--) {
    const angle = (i / steps) * 2 * Math.PI;
    const latOffset = (radiusKm / 111) * Math.sin(angle);
    const lngOffset = (radiusKm / (111 * Math.cos(lat * Math.PI / 180))) * Math.cos(angle);
    innerRing.push([lng + lngOffset, lat + latOffset]);
  }
  innerRing.push(innerRing[0]);
  
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [outerRing, innerRing] // Outer + hole
    }
  };
};
