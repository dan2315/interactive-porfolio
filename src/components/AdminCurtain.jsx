import { useAdminStore } from "../stores/AdminStore";
import AdminLoginPage from "../pages/AdminLoginPage";
import { useEffect } from "react";

export default function AdminCurtain({ enabled, children }) {
  const { init, isAuthenticated } = useAdminStore();

  useEffect(() => {
    init();
  }, [init]);

  if (!isAuthenticated && enabled) {
    return <AdminLoginPage />;
  }

  return <>{children}</>;
}
