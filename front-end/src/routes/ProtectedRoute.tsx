import { Navigate } from "react-router-dom";
import { JSX } from "react/jsx-dev-runtime";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {

  const token = localStorage.getItem("token");
  const tipoUsuario = localStorage.getItem("usu_tipo");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (tipoUsuario !== "ADMIN") {
    return <Navigate to="/catalogo" replace />;
  }

  return children;
}