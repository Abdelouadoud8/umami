import type { Metadata } from 'next';
import { InstagramStatsPage } from './InstagramStatsPage';

export default async function ({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;

  return <InstagramStatsPage websiteId={websiteId} />;
}

export const metadata: Metadata = {
  title: 'Instagram',
};
