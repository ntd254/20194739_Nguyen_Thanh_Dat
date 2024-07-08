import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ReviewState = {
  reviews: Record<string, string[]>;
  addCourseId: (userId: string, courseId: string) => void;
};

export const useReview = create<ReviewState>()(
  persist(
    (set) => ({
      reviews: {},
      addCourseId: (userId, courseId) =>
        set((state) => ({
          reviews: {
            ...state.reviews,
            [userId]: [...(state.reviews[userId] || []), courseId],
          },
        })),
    }),
    { name: 'review', storage: createJSONStorage(() => localStorage) },
  ),
);
