import { useApi } from '@/components/hooks';

export interface InstagramDailyRow {
  statDate: string;
  followers: number;
  newFollowers: number | null;
  malePercentage: number | null;
  femalePercentage: number | null;
  newMaleFollowers: number | null;
  newFemaleFollowers: number | null;
  maleCount: number | null;
  femaleCount: number | null;
  unknownGenderCount: number | null;
}

// All daily rows, newest first
export function useInstagramDailyQuery(websiteId: string) {
  const { get, useQuery } = useApi();

  return useQuery<InstagramDailyRow[]>({
    queryKey: ['instagram:daily', { websiteId }],
    queryFn: () => get(`/websites/${websiteId}/instagram-stats`),
    enabled: !!websiteId,
  });
}
