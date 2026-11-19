import Banner from "./HomePageComponents/Banner";
import BrowseServiceCard from "./HomePageComponents/browseServiceCard";
import HomeServiceCards from "./HomePageComponents/services";

export default function Home() {
  return (
  <div>
    <Banner/>
    <BrowseServiceCard/>
    <HomeServiceCards/>
  </div>
  );
}
