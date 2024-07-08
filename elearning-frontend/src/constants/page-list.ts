export const pageList = {
  root: '/',
  logIn: '/log-in',
  signUp: { root: '/sign-up', verifyEmail: '/sign-up/verify-email' },
  home: '/home',
  courses: {
    root: '/courses',
    create: '/courses/create',
    detail: (id: string) => `/courses/${id}`,
  },
  cart: '/cart',
  instructor: '/instructor',
  learn: {
    lesson: (courseId: string, lessonId: string) =>
      `/learn/courses/${courseId}/lessons/${lessonId}`,
  },
};
