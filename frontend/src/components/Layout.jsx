import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0E0B14]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default Layout;