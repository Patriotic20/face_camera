import { useState, useCallback, useEffect } from 'react';
import type { Camera } from '../types/camera';
import { getCameraList } from '../data/cameraApi';

export function useCameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);

  const refresh = useCallback(() => {
    getCameraList().then(setCameras);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { cameras, refresh };
}
