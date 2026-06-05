/**
 * @gtcx/security/auth
 *
 * Authentication and authorization utilities.
 * Implements P9 (Security by Design).
 *
 * @packageDocumentation
 */

// Permission/role checking (from permissions.ts)
export {
  type Permission,
  Permissions,
  Roles,
  type RoleName,
  type PermissionContext,
  hasPermission,
  expandPermissions,
  validatePermission,
} from './permissions';

// Session management (from sessions.ts - supersedes permissions.ts session code)
export * from './sessions';

// Token utilities (from tokens.ts - supersedes permissions.ts token code)
export * from './tokens';
