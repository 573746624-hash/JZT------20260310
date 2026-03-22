import { Navigate } from "react-router-dom";
import { message } from "antd";
import FrozenAccountPage from "./FrozenAccountPage";
import PermissionDeniedPage from "./PermissionDeniedPage";

const TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const lastLoginTime = Number(localStorage.getItem("lastLoginTime") || "0");
  const currentTime = Date.now();

  if (isLoggedIn && currentTime - lastLoginTime > TOKEN_EXPIRY) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("lastLoginTime");
    // setTimeout avoids triggering updates directly inside render
    setTimeout(() => message.error("登录已失效，请重新登录"), 0);
    return <Navigate to="/login" replace />;
  }

  if (isLoggedIn && userInfo) {
    if (userInfo.status === "frozen") {
      return <FrozenAccountPage />;
    }
    if (
      userInfo.role === "employee" &&
      !userInfo.permissions?.includes("home:access")
    ) {
      return <PermissionDeniedPage />;
    }
  }

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
