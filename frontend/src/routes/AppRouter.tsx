import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Attendance from '../pages/Attendance';
import AttendanceDay from '../pages/AttendanceDay';
import Cameras from '../pages/Cameras';
import CameraForm from '../pages/CameraForm';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'attendance', element: <Attendance /> },
      { path: 'attendance/:date', element: <AttendanceDay /> },
      { path: 'cameras', element: <Cameras /> },
      { path: 'cameras/new', element: <CameraForm /> },
      { path: 'cameras/:id/edit', element: <CameraForm /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
