
import { FeaturesSection as HomeFeaturesSection } from '@/components/home/FeaturesSection';
import { features } from '@/data/homePageData';
import { useNavigate } from 'react-router-dom';

export function FeaturesSection() {
  const navigate = useNavigate();

  const handleViewAllFeatures = () => {
    navigate('/features');
  };

  return (
    <HomeFeaturesSection 
      features={features} 
      onViewAllFeatures={handleViewAllFeatures} 
    />
  );
}
