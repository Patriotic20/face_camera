export type AttendanceRecord = {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  enterCameraId: string | null;
  enterCameraName: string | null;
  exitCameraId: string | null;
  exitCameraName: string | null;
};
