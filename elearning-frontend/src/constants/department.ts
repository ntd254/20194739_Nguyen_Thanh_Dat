import { Department } from '@/client-sdk';

export const departments: { value: Department; label: string }[] = [
  { value: Department.CNTT, label: 'Công nghệ thông tin' },
  { value: Department.DIEN, label: 'Điện & Điện tử' },
  { value: Department.COKHI, label: 'Cơ khí' },
  { value: Department.KINHTE, label: 'Kinh tế' },
  { value: Department.OTHER, label: 'Khác' },
];
