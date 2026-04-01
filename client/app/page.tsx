import HeroBanner from '@/components/home/HeroBanner';
import PopularOffers from '@/components/home/PopularOffers';
import PopularStores from '@/components/home/PopularStores';
import TopCoupons from '@/components/home/TopCoupons';
import DealsOfTheDay from '@/components/home/DealsOfTheDay';
import Collections from '@/components/home/Collections';
import PopularCategories from '@/components/home/PopularCategories';

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <PopularOffers />
      <PopularStores />
      <TopCoupons />
      <DealsOfTheDay />
      <Collections />
      <PopularCategories />
    </main>
  );
}
