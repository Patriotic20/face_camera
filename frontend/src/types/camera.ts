export type CameraType = 'enter' | 'exit';

export type Camera = {
  id: string;
  name: string;
  ip: string;
  login: string;
  password: string;
  type: CameraType;
  connected: boolean;
};
