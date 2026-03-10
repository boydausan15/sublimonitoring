export type ProjectStatus = 
  | 'Design' 
  | 'Approval' 
  | 'Sizing' 
  | 'Uploaded' 
  | 'Print' 
  | 'Heat_Press' 
  | 'Cut_Sew' 
  | 'Sew' 
  | 'Packing' 
  | 'Completed';

export interface Project {
  id: string | number;
  tracking_number: string;
  project_name: string;
  customer_name: string;
  contact_number: string;
  order_type: string;
  quantity: number;
  sizes: string;
  design_proof_image: string;
  order_date: string;
  due_date: string;
  assigned_staff: string;
  status: ProjectStatus;
  created_by: string;
  created_at: string;
}

export const STAGES: ProjectStatus[] = [
  'Design',
  'Approval',
  'Sizing',
  'Uploaded',
  'Print',
  'Heat_Press',
  'Cut_Sew',
  'Sew',
  'Packing',
  'Completed'
];

export type StaffRole = 'admin' | 'subadmin' | 'staff';
export type StaffJob = 'SUBADMIN' | 'DESIGNER' | 'PACKING' | 'PRINTER' | 'SEWER' | 'CUTTER';

export interface Staff {
  id: string;
  email: string;
  name?: string;
  role: StaffRole;
  job: StaffJob;
  active: boolean;
  created_at: string;
}
