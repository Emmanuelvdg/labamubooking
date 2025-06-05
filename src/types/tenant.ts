
export interface CreateTenantData {
  businessName: string;
  businessType: string;
  description?: string;
  ownerName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface CreateTenantResult {
  id: string;
  name: string;
  businessType: string;
  createdAt: string;
  user: any;
  session: any;
  isExistingUser: boolean;
}
