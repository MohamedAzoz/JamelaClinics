export interface CreateAppointments {
  patientName: string;
  patientPhoneNumber: string;
  patientAddress: string;
  doctorClinicId: number;
  doctorScheduleId: number;
  consultationFee: number;
  discountAmount?: number;
  isPaid: boolean;
}
// {
//   "patientName": "string",
//   "patientPhoneNumber": "string",
//   "patientAddress": "string",
//   "doctorClinicId": 0,
//   "doctorScheduleId": 0,
//   "consultationFee": 0,
//   "discountAmount": 0,
//   "isPaid": true
// }
