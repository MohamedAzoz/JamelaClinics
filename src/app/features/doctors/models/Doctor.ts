export interface Doctor {
  id: number;
  userId: string;
  username: string;
  fullName: string;
  picture: string | null;
  clinicId: number | null;
  clinicName: string | null;
  doctorPercentage: number | null;
  centerPercentage: number | null;
  isActive: boolean;
}
