export interface Rol {
  id: number;
  name: string;
  permissions: Permissions;
}

export interface Permissions {
  sales: ModulePermissions;
  marketing: ModulePermissions;
  reports: ModulePermissions;
  settings: ModulePermissions;
  users: ModulePermissions;
  information: ModulePermissions;
}

export interface ModulePermissions {
  [key: string]: number;
}
