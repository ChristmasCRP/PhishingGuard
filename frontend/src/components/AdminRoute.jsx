import { Navigate } from 'react-router-dom';

const AdminRoute = ({ userRole, children }) => {
  if (userRole === null) return <div className="loader">Autoryzacja...</div>;

  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;