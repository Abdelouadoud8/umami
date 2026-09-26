'use client';
import { Column, DataColumn, DataTable, Text } from '@umami/react-zen';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Panel } from '@/components/common/Panel';
import { InstagramGenderCharts } from './InstagramGenderCharts';
import { useInstagramDailyQuery } from './instagramQueries';

function Change({ value }: { value: number | null }) {
  if (value === null || value === undefined) return <Text color="muted">—</Text>;
  const color =
    value > 0 ? 'var(--zen-status-success)' : value < 0 ? 'var(--zen-status-error)' : undefined;
  return <span style={{ color }}>{`${value > 0 ? '+' : ''}${value.toLocaleString('en')}`}</span>;
}

function Percent({ value }: { value: number | null }) {
  return value === null || value === undefined ? <Text color="muted">—</Text> : <>{value}%</>;
}

export function InstagramStatsPage({ websiteId }: { websiteId: string }) {
  const { data, isLoading, isFetching, error } = useInstagramDailyQuery(websiteId);
  const latestWithGender = data?.find(row => row.malePercentage !== null);

  return (
    <Column gap="3">
      <LoadingPanel data={data} isLoading={isLoading} isFetching={isFetching} error={error}>
        <Column gap="3">
          <InstagramGenderCharts row={latestWithGender} />
          <Panel title="Instagram daily stats (23:59 Paris)">
            <DataTable data={data || []}>
              <DataColumn id="statDate" label="Date" />
              <DataColumn id="followers" label="Followers" align="end">
                {(row: any) => row.followers.toLocaleString('en')}
              </DataColumn>
              <DataColumn id="newFollowers" label="New followers" align="end">
                {(row: any) => <Change value={row.newFollowers} />}
              </DataColumn>
              <DataColumn id="malePercentage" label="Men %" align="end">
                {(row: any) => <Percent value={row.malePercentage} />}
              </DataColumn>
              <DataColumn id="femalePercentage" label="Women %" align="end">
                {(row: any) => <Percent value={row.femalePercentage} />}
              </DataColumn>
              <DataColumn id="newMaleFollowers" label="New men" align="end">
                {(row: any) => <Change value={row.newMaleFollowers} />}
              </DataColumn>
              <DataColumn id="newFemaleFollowers" label="New women" align="end">
                {(row: any) => <Change value={row.newFemaleFollowers} />}
              </DataColumn>
            </DataTable>
          </Panel>
        </Column>
      </LoadingPanel>
    </Column>
  );
}
