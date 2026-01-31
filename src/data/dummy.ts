// Major city coordinates for realistic data placement
export const CITY_CENTERS = [
  { name: 'New York', lat: 40.7, lng: -74.0 },
  { name: 'London', lat: 51.5, lng: -0.1 },
  { name: 'Tokyo', lat: 35.7, lng: 139.7 },
  { name: 'Mumbai', lat: 19.1, lng: 72.9 },
  { name: 'Shanghai', lat: 31.2, lng: 121.5 },
  { name: 'São Paulo', lat: -23.5, lng: -46.6 },
  { name: 'Lagos', lat: 6.5, lng: 3.4 },
  { name: 'Cairo', lat: 30.0, lng: 31.2 },
  { name: 'Sydney', lat: -33.9, lng: 151.2 },
  { name: 'Moscow', lat: 55.8, lng: 37.6 },
  { name: 'Delhi', lat: 28.6, lng: 77.2 },
  { name: 'Beijing', lat: 39.9, lng: 116.4 },
  { name: 'Los Angeles', lat: 34.1, lng: -118.2 },
  { name: 'Paris', lat: 48.9, lng: 2.4 },
  { name: 'Istanbul', lat: 41.0, lng: 29.0 },
  { name: 'Karachi', lat: 24.9, lng: 67.1 },
  { name: 'Buenos Aires', lat: -34.6, lng: -58.4 },
  { name: 'Jakarta', lat: -6.2, lng: 106.8 },
  { name: 'Seoul', lat: 37.6, lng: 127.0 },
  { name: 'Singapore', lat: 1.3, lng: 103.8 },
];

export const generateNightLights = (count: number) => {
  const data = [];
  const pointsPerCity = Math.floor(count / CITY_CENTERS.length);
  
  for (const city of CITY_CENTERS) {
    // Dense core points (high intensity)
    for (let i = 0; i < pointsPerCity * 0.4; i++) {
      const spread = 1.5; // Tight core
      data.push({
        position: [
          city.lng + (Math.random() - 0.5) * spread,
          city.lat + (Math.random() - 0.5) * spread,
        ],
        intensity: 0.8 + Math.random() * 0.2, // High intensity core
        weight: 80 + Math.random() * 20,
      });
    }
    // Medium density ring
    for (let i = 0; i < pointsPerCity * 0.35; i++) {
      const spread = 3.5;
      data.push({
        position: [
          city.lng + (Math.random() - 0.5) * spread,
          city.lat + (Math.random() - 0.5) * spread,
        ],
        intensity: 0.5 + Math.random() * 0.3,
        weight: 40 + Math.random() * 40,
      });
    }
    // Sparse outer suburbs
    for (let i = 0; i < pointsPerCity * 0.25; i++) {
      const spread = 6;
      data.push({
        position: [
          city.lng + (Math.random() - 0.5) * spread,
          city.lat + (Math.random() - 0.5) * spread,
        ],
        intensity: 0.2 + Math.random() * 0.3,
        weight: 10 + Math.random() * 30,
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

    // Simple circle polygon (approximated with 8 points)
    const poly = [];
    for (let angle = 0; angle <= 360; angle += 45) {
      const rad = (angle * Math.PI) / 180;
      poly.push([
        city.lng + Math.cos(rad) * radius,
        city.lat + Math.sin(rad) * radius * 0.7, // Flatten slightly for lat
      ]);
    }

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

export const generateVegetationData = (count: number) => {
  const data = [];
  // Use random locations but AVOID city centers to simulate inverse correlation
  // Focus on tropical regions and forested areas
  const forestRegions = [
    { lat: 0, lng: -60, spread: 25 },    // Amazon
    { lat: 5, lng: 20, spread: 15 },     // Congo Basin
    { lat: 0, lng: 115, spread: 12 },    // Borneo/Indonesia
    { lat: 45, lng: -120, spread: 10 },  // Pacific Northwest
    { lat: 60, lng: 90, spread: 20 },    // Siberian Taiga
    { lat: -35, lng: 150, spread: 8 },   // Australia forests
  ];

  for (const region of forestRegions) {
    const regionPoints = Math.floor(count / forestRegions.length);
    for (let i = 0; i < regionPoints; i++) {
      const lat = region.lat + (Math.random() - 0.5) * region.spread;
      const lng = region.lng + (Math.random() - 0.5) * region.spread;
      
      // Check if near city
      let isNearCity = false;
      for (const city of CITY_CENTERS) {
        const dist = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2));
        if (dist < 4) {
          isNearCity = true;
          break;
        }
      }

      if (!isNearCity) {
        data.push({
          position: [lng, lat],
          intensity: 0.6 + Math.random() * 0.4,
          weight: 50 + Math.random() * 50,
          height: 0.5 + Math.random() * 0.5,
        });
      }
    }
  }
  return data;
};

export const generateTemperatureData = (count: number) => {
  const data = [];
  // Correlate with cities (Urban Heat Island effect)
  for (const city of CITY_CENTERS) {
    const pointsPerCity = Math.floor(count / CITY_CENTERS.length);
    // Hot core
    for (let i = 0; i < pointsPerCity * 0.5; i++) {
      const spread = 2;
      data.push({
        position: [
          city.lng + (Math.random() - 0.5) * spread,
          city.lat + (Math.random() - 0.5) * spread
        ],
        intensity: 0.85 + Math.random() * 0.15,
        weight: 70 + Math.random() * 30,
      });
    }
    // Warm outer ring
    for (let i = 0; i < pointsPerCity * 0.5; i++) {
      const spread = 5;
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
