import FeaturedLessons from "@/Component/FeaturedLessons";
import HeroSlider from "@/Component/HeroSlider";
import LifeLessonsSection from "@/Component/LifeLessonsSection";
import TopContributors from "@/Component/TopContributors";

export default function Home() {
  return (
    <div>
     <HeroSlider></HeroSlider>
     <FeaturedLessons></FeaturedLessons>
     <LifeLessonsSection></LifeLessonsSection>
     <TopContributors></TopContributors>
    </div>
  );
}
