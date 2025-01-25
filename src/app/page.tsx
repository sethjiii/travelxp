import Navbar from "./components/Navbar";
import TravelContent from "./components/TravelContent";
import Footer from "./components/FooterContent";
import { AuthProvider } from "../Auth/AuthProvider";

export default function Home() {
  return (
    <AuthProvider>
      {/* <Navbar /> */}
      <TravelContent />
      <Footer />
    </AuthProvider>
  );
}
