import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export function useAdminPermissions() {
  const { user } = useAuth();
  const [adminRole, setAdminRole]       = useState(null);
  const [permissions, setPermissions]   = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!user?.userId) { setLoading(false); return; }
    API.get(`/rbac/my-permissions/${user.userId}`)
      .then(res => {
        setAdminRole(res.data.adminRole);
        setPermissions(res.data.permissions || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  const can = (permission) => permissions.includes(permission);

  const isSuperAdmin        = adminRole === 'SUPER_ADMIN';
  const isProductModerator  = adminRole === 'PRODUCT_MODERATOR';
  const isSupportAdmin      = adminRole === 'SUPPORT_ADMIN';
  const isFinanceAdmin      = adminRole === 'FINANCE_ADMIN';

  return {
    adminRole, permissions, loading, can,
    isSuperAdmin, isProductModerator,
    isSupportAdmin, isFinanceAdmin,
  };
}