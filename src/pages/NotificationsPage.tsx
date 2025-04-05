// Este componente es la pagina de notificaciones. 

import { Notifications } from "../components/Notifications";

export const NotificationsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Centro de notificaciones
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Notifications />
      </div>
    </div>
  );
};
