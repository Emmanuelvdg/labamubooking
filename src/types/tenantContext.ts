
export interface UserTenant {
  id: string;
  tenant_id: string;
  role: string;
  created_at: string;
  tenant: {
    id: string;
    name: string;
    business_type: string;
  };
}

export interface TenantContextType {
  tenantId: string | null;
  isLoading: boolean;
  error: string | null;
  refetchTenant: () => Promise<void>;
  availableTenants: UserTenant[];
  switchTenant: (tenantId: string) => void;
  currentTenantRole: string | null;
}
