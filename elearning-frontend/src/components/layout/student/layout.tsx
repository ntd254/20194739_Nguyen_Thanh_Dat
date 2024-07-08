import { ReactElement } from 'react';
import Footer from '../footer';
import Header from '../header';

export default function StudentLayout({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container mt-3 flex flex-1 flex-col">{children}</div>
      </div>
      <Footer />
    </>
  );
}
