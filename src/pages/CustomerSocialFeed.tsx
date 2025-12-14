import CentralSocialFeed from './CentralSocialFeed';

interface CustomerSocialFeedProps {
  showHeader?: boolean;
}

const CustomerSocialFeed = ({ showHeader = true }: CustomerSocialFeedProps) => {
  return <CentralSocialFeed showHeader={showHeader} />;
};

export default CustomerSocialFeed;
