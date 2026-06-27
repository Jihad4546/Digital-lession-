import Footer from "@/Component/footer";
import AppNavbar from "@/Component/Navber";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <div>
      <AppNavbar></AppNavbar>
      <div>   {children}   </div>
      <Footer></Footer>
       <ToastContainer />
    </div>
  );
}
