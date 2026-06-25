import Footer from "@/Component/footer";
import AppNavbar from "@/Component/Navber";

export default function RootLayout({ children }) {
  return (
    <div>
      <AppNavbar></AppNavbar>
      <div>   {children}   </div>
      <Footer></Footer>
    </div>
  );
}
