import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import Orders from "./pages/Orders";
import { Routes as RoutesPage } from "./pages/RoutesPage";
import { Drivers } from "./pages/Drivers";
import { Reports } from "./pages/Reports";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuth } from "./lib/Auth";
import { Clients } from "./pages/Clients";
import { Configuration } from "./pages/Configuracion";
import { OrderTracking } from "./components/OrderTracking";
import { NotificationsPage } from "./pages/NotificationsPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Rutas privadas dentro de Layout */}
          <Route
            path="*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="routes" element={<RoutesPage />} />
                    <Route path="drivers" element={<Drivers />} />
                    <Route path="tracking" element={<OrderTracking />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="config" element={<Configuration />} />
                    <Route
                      path="notifications"
                      element={<NotificationsPage />}
                    />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
