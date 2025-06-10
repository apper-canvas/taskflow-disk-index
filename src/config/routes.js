import HomePage from '@/components/pages/HomePage';
import NotFoundPage from '@/components/pages/NotFoundPage'; // Although not in routeArray, good to update its import if used

export const routes = {
  home: {
    id: 'home',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
component: HomePage
  }
};

export const routeArray = Object.values(routes);