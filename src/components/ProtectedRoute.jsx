import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

/**
 * ProtectedRoute component — guards routes requiring authentication
 * Demonstrates: Context API consumption, conditional rendering, protected routes
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader text="Checking authentication..." fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
