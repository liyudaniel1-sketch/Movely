import { useAuth } from "../context/AuthContext";

function ProtectedAdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-white p-8">Please log in.</p>;
  }

  if (user.role !== "ADMIN") {
    return <p className="text-white p-8">Access denied — admin only.</p>;
  }

  return children;
}

export default ProtectedAdminRoute;