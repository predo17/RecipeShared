import Hero from "../homecomponents/Hero";
import SearchHome from "../homecomponents/SearchHome";
import RecipesHome from "../homecomponents/RecipesHome";
import ShareRecipesSection from "../homecomponents/ShareRecipesSection";


export default function Home() {
  return (
    <>
      <Hero />
      <SearchHome />
      <RecipesHome />
      <ShareRecipesSection />
    </>
  )
}
