import { useState, useCallback } from 'react';
import type { Camera } from '../types/camera';
import { getCameras } from '../data/camerasStorage';

export function useCameras() {
  const [cameras, setCameras] = useState<Camera[]>(() => getCameras());

  const refresh = useCallback(() => {
    setCameras(getCameras());
  }, []);

  return { cameras, refresh };
}
