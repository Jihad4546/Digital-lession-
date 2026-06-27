import Footer from "@/Component/footer";
import AppNavbar from "@/Component/Navber";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <div>
      <AppNavbar></AppNavbar>
      <div>   {children}   </div>
      <Footer></Footer>
      <Toaster/>
    </div>
  );
}
