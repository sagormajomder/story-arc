export { cn } from 'cn';

/**
 * Checks whether a given role represents an admin or super admin.
 */
export function isAdminRole(role?: string | null): boolean {
  if (!role) return false;
  const normalized = role.toLowerCase().replace(/[-_ ]/g, '');
  return normalized === 'admin' || normalized === 'superadmin';
}

