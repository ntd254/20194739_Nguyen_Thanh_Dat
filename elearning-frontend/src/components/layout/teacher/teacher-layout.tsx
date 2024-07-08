import { FC, ReactNode } from 'react';
import Sidebar from './sidebar';
import Footer from '../footer';
import TeacherHeader from './teacher-header';

type Props = {
  children: ReactNode;
};

const TeacherLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <div className="flex min-h-screen flex-col">
            <TeacherHeader />
            <div className="mx-auto w-full max-w-6xl flex-1 px-5">
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default TeacherLayout;
