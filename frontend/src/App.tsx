import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;
