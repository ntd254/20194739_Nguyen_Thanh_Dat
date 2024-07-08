import { CourseDetailDto } from '@/client-sdk';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type CartState = {
  courses: CourseDetailDto[];
  addCourse: (course: CourseDetailDto) => void;
  removeCourse: (course: CourseDetailDto) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      courses: [],
      addCourse: (course) =>
        set((state) => ({ courses: [...state.courses, course] })),
      removeCourse: (removeCourse) =>
        set((state) => ({
          courses: state.courses.filter(
            (course) => course.id !== removeCourse.id,
          ),
        })),
      clearCart: () => set({ courses: [] }),
    }),
    { name: 'cart', storage: createJSONStorage(() => localStorage) },
  ),
);
