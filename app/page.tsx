import { PremiumHome } from '@/components/sections/premium-home';
import { getHomeData } from '@/lib/home-data';

export default async function HomePage() {
  const data = await getHomeData();

  return <PremiumHome data={data} />;
}
