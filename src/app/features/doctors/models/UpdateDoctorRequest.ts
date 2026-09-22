export interface UpdateDoctorRequest {
  Id: number;
  FullName: string;
  PictureFile: string;
  ClinicId: number;
  DoctorPercentage: number;
  IsActive: boolean;
}
