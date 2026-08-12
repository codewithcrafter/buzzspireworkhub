import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AgencyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col pt-[72px] lg:pt-[88px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
