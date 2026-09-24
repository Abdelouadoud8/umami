import type { Metadata } from 'next';
import { LinkPageStatsPage } from './LinkPageStatsPage';

export default async function ({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;

  return <LinkPageStatsPage websiteId={websiteId} />;
}

export const metadata: Metadata = {
  title: 'Links page',
};
