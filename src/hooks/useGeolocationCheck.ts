import { useEffect, useState } from 'react';
import type { WorkLocation } from '../types';
import { isWithinRadius } from '../utils/geo';

export interface GeolocationCheckResult {
  inRange: boolean;
  status: 'checking' | 'in_range' | 'out_of_range' | 'unavailable';
}

const hasGeolocation = typeof navigator !== 'undefined' && 'geolocation' in navigator;

export function useGeolocationCheck(location: WorkLocation | undefined): GeolocationCheckResult {
  const [result, setResult] = useState<GeolocationCheckResult>(() =>
    hasGeolocation ? { inRange: true, status: 'checking' } : { inRange: true, status: 'unavailable' }
  );

  useEffect(() => {
    if (!location || !hasGeolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const inRange = isWithinRadius({ lat: pos.coords.latitude, lng: pos.coords.longitude }, location);
        setResult({ inRange, status: inRange ? 'in_range' : 'out_of_range' });
      },
      () => setResult({ inRange: true, status: 'unavailable' }),
      { timeout: 5000 }
    );
  }, [location]);

  return result;
}
