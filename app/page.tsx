import Image from "next/image";
import Navbar from "./HomePageComponents/Navbar";
import ServiceCards from "./HomePageComponents/Service";
import Footer from "./HomePageComponents/Footer";
import Banner from "./HomePageComponents/Banner";

export default function Home() {
  return (
  <div>
    <Navbar/>
    <Banner/>
    <ServiceCards/>
    <Footer/>
  </div>
  );
}
