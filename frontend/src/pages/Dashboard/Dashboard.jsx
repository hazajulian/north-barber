// Dashboard.jsx
// Panel de administración para gestionar servicios, barberos,
// reservas, horarios, perfil y notificaciones.

import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import {
  getAppointments,
  getAppointmentStats,
} from "../../services/appointmentService";

import { getAdminBarbers } from "../../services/barberService";
import { getBusinessHours } from "../../services/businessHoursService";
import { getDashboardRevenue } from "../../services/dashboardService";
import { getNotifications } from "../../services/notificationService";
import { getAdminServices } from "../../services/serviceService";

import { DashboardSidebar } from "./components/DashboardObjects/DashboardSidebar";
import { DashboardHeader } from "./components/DashboardObjects/DashboardHeader";
import { DashboardStats } from "./components/DashboardObjects/DashboardStats";
import { DashboardSection } from "./components/DashboardObjects/DashboardSection";
import { ConfirmModal } from "./components/ConfirmModal/ConfirmModal";

import { ServicesManager } from "./components/ServicesManager";
import { BarbersManager } from "./components/BarbersManager";
import { AppointmentsManager } from "./components/AppointmentsManager";
import { BusinessHoursManager } from "./components/BusinessHoursManager";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { NotificationsDrawer } from "./components/NotificationsDrawer/NotificationsDrawer";
import { AdminProfile } from "./components/AdminProfile";

import "./Dashboard.css";

const POLLING_INTERVAL = 5000;
const DESKTOP_ASIDE_WIDTH = 1660;

const EMPTY_APPOINTMENT_STATS = {
  today: 0,
  upcoming: 0,
  completedMonth: 0,
  revenueMonth: 0,
};

const EMPTY_REVENUE_STATS = {
  period: "month",
  totalRevenue: 0,
  completedAppointments: 0,
  averageTicket: 0,
  revenueByBarber: [],
};

function getNotificationsList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.notifications || [];
}

function getIsAsideLayout() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth >= DESKTOP_ASIDE_WIDTH;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentStats, setAppointmentStats] =
    useState(EMPTY_APPOINTMENT_STATS);

  const [revenue, setRevenue] = useState(EMPTY_REVENUE_STATS);
  const [revenuePeriod, setRevenuePeriod] = useState("month");

  const [businessHours, setBusinessHours] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsRefreshKey, setNotificationsRefreshKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);
  const [isAsideLayout, setIsAsideLayout] = useState(getIsAsideLayout);

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  function requestLogout() {
    setLogoutModalOpen(true);
  }

  function cancelLogout() {
    setLogoutModalOpen(false);
  }

  function confirmLogout() {
    setLogoutModalOpen(false);
    logout();
    navigate("/login");
  }

  function handleOpenNotifications() {
    setShowNotifications(true);
  }

  function handleCloseNotifications() {
    setShowNotifications(false);
  }

  function handleRevenuePeriodChange(period) {
    if (period === revenuePeriod) return;

    setRevenuePeriod(period);
  }

  useEffect(() => {
    function handleResize() {
      const nextIsAsideLayout = getIsAsideLayout();

      setIsAsideLayout(nextIsAsideLayout);

      if (nextIsAsideLayout) {
        setShowNotifications(false);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const refreshServices = useCallback(async () => {
    const data = await getAdminServices();
    setServices(data || []);
  }, []);

  const refreshBarbers = useCallback(async () => {
    const data = await getAdminBarbers();
    setBarbers(data || []);
  }, []);

  const refreshAppointments = useCallback(async () => {
    const data = await getAppointments();
    setAppointments(data || []);
  }, []);

  const refreshAppointmentStats = useCallback(async () => {
    const data = await getAppointmentStats();
    setAppointmentStats(data || EMPTY_APPOINTMENT_STATS);
  }, []);

  const refreshRevenue = useCallback(async (period = "month") => {
    const data = await getDashboardRevenue(period);

    setRevenue(
      data || {
        ...EMPTY_REVENUE_STATS,
        period,
      }
    );
  }, []);

  const refreshBusinessHours = useCallback(async () => {
    const data = await getBusinessHours();
    setBusinessHours(data || []);
  }, []);

  const refreshNotifications = useCallback(async () => {
    const data = await getNotifications();

    setNotifications(getNotificationsList(data));

    setNotificationsRefreshKey((previous) => previous + 1);
  }, []);

  const refreshAppointmentsPanel = useCallback(async () => {
    await Promise.all([
      refreshAppointments(),
      refreshAppointmentStats(),
      refreshRevenue(revenuePeriod),
      refreshNotifications(),
    ]);
  }, [
    revenuePeriod,
    refreshAppointments,
    refreshAppointmentStats,
    refreshRevenue,
    refreshNotifications,
  ]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        refreshServices(),
        refreshBarbers(),
        refreshAppointments(),
        refreshAppointmentStats(),
        refreshRevenue("month"),
        refreshBusinessHours(),
        refreshNotifications(),
      ]);
    } catch (error) {
      setError(
        error.message ||
          "No se pudo cargar el dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [
    refreshServices,
    refreshBarbers,
    refreshAppointments,
    refreshAppointmentStats,
    refreshRevenue,
    refreshBusinessHours,
    refreshNotifications,
  ]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    if (loading) return;

    refreshRevenue(revenuePeriod).catch((error) => {
      setError(
        error.message ||
          "No se pudieron cargar los ingresos."
      );
    });
  }, [loading, revenuePeriod, refreshRevenue]);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      refreshAppointmentsPanel().catch(() => {});
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [loading, refreshAppointmentsPanel]);

  const unreadNotifications = notifications.filter(
    (notification) => !notification.is_read
  );

  const notificationsContent = (
    <DashboardSection
      id="notificaciones"
      title="Notificaciones"
      description="Consultá avisos internos generados por reservas y cambios de estado."
      collapsible={false}
      variant="compact"
    >
      <NotificationsPanel
        refreshKey={notificationsRefreshKey}
        onRefresh={refreshNotifications}
      />
    </DashboardSection>
  );

  return (
    <main className="dashboardPage">
      <DashboardSidebar onLogout={requestLogout} />

      <section className="dashboard">
        <DashboardHeader />

        {error && (
          <p className="dashboard__error">
            {error}
          </p>
        )}

        {loading ? (
          <div className="dashboard__loading">
            Cargando información...
          </div>
        ) : (
          <>
            <div className="dashboard__content">
              <div className="dashboard__main">
                <DashboardStats
                  revenue={revenue}
                  period={revenuePeriod}
                  onPeriodChange={handleRevenuePeriodChange}
                />

                <DashboardSection
                  id="servicios"
                  title="Servicios"
                  description="Creá, editá o desactivá los servicios disponibles para reservas."
                >
                  <ServicesManager
                    services={services}
                    onRefresh={refreshServices}
                  />
                </DashboardSection>

                <DashboardSection
                  id="barberos"
                  title="Barberos"
                  description="Administrá el equipo disponible para atender reservas."
                >
                  <BarbersManager
                    barbers={barbers}
                    onRefresh={refreshBarbers}
                  />
                </DashboardSection>

                <DashboardSection
                  id="reservas"
                  title="Reservas"
                  description="Revisá las reservas recibidas y actualizá su estado."
                >
                  <AppointmentsManager
                    appointments={appointments}
                    stats={appointmentStats}
                    onRefresh={refreshAppointmentsPanel}
                  />
                </DashboardSection>

                <DashboardSection
                  id="horarios"
                  title="Horarios"
                  description="Configurá los días y horarios de atención del negocio."
                >
                  <BusinessHoursManager
                    businessHours={businessHours}
                    onRefresh={refreshBusinessHours}
                  />
                </DashboardSection>

                <DashboardSection
                  id="perfil"
                  title="Perfil"
                  description="Gestioná la seguridad y recuperación de la cuenta administradora."
                >
                  <AdminProfile />
                </DashboardSection>
              </div>

              {isAsideLayout && (
                <aside className="dashboard__aside">
                  {notificationsContent}
                </aside>
              )}
            </div>

            {!isAsideLayout && (
              <NotificationsDrawer
                isOpen={showNotifications}
                unreadCount={unreadNotifications.length}
                onOpen={handleOpenNotifications}
                onClose={handleCloseNotifications}
              >
                {notificationsContent}
              </NotificationsDrawer>
            )}
          </>
        )}
      </section>

      <ConfirmModal
        open={logoutModalOpen}
        title="Cerrar sesión"
        message="¿Seguro que querés cerrar la sesión del panel administrador?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        danger
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </main>
  );
}