import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-60 w-[500px] h-[500px] bg-emerald-500/20 dark:bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[150px] translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};