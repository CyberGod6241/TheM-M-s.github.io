import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute: Restricts access to admin pages
 * Only users with 'admin' role can access the wrapped component
 */
export default function ProtectedRoute({
  children,
  userRole,
  isLoading,
  authed,
}) {
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  // Not an admin - redirect to home
  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // All checks passed - render the protected component
  return children;
}
