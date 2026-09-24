'use client';
import { Column } from '@umami/react-zen';
import { useMemo } from 'react';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Panel } from '@/components/common/Panel';
import { useDateRange, useTimezone } from '@/components/hooks';
import { EventsChart } from '@/components/metrics/EventsChart';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { PageviewsChart } from '@/components/metrics/PageviewsChart';
import { formatLongNumber } from '@/lib/format';
import {
  getLinkPageLabel,
  LINK_CLICK_EVENTS,
  LINK_PAGE_FILTER,
  LINK_PAGE_PATH,
  REEL_CLICK_EVENTS,
  SOCIAL_CLICK_EVENTS,
  useLinkPageEventsQuery,
  useLinkPagePageviewsQuery,
  useLinkPageStatsQuery,
  VISIT_SOURCE_EVENTS,
} from './linkPageQueries';

function TopItemCard({
  label,
  data,
  unit,
}: {
  label: string;
  data?: { x: string; y: number }[];
  unit: string;
}) {
  const [top] = data || [];

  return (
    <MetricCard
      label={top ? `${label} · ${getLinkPageLabel(top.x)}` : label}
      value={top?.y ?? 0}
      formatValue={n => `${formatLongNumber(n)} ${unit}`}
      tooltip={top?.x}
    />
  );
}

export function LinkPageStatsPage({ websiteId }: { websiteId: string }) {
  const { isAllTime } = useDateRange();
  const { timezone } = useTimezone();
  const {
    dateRange: { startDate, endDate, unit, value },
  } = useDateRange({ timezone });

  const stats = useLinkPageStatsQuery(websiteId);
  const pageviews = useLinkPagePageviewsQuery(websiteId);
  const topSocial = useLinkPageEventsQuery(websiteId, SOCIAL_CLICK_EVENTS);
  const topReel = useLinkPageEventsQuery(websiteId, REEL_CLICK_EVENTS);
  const topSource = useLinkPageEventsQuery(websiteId, VISIT_SOURCE_EVENTS, {
    path: LINK_PAGE_FILTER,
  });

  const { visits = 0, comparison } = stats.data || {};

  const chartData = useMemo(
    () => ({
      pageviews: pageviews.data?.pageviews || [],
      sessions: pageviews.data?.sessions || [],
    }),
    [pageviews.data],
  );

  return (
    <Column gap="3">
      <WebsiteControls websiteId={websiteId} />
      <LoadingPanel
        data={stats.data}
        isLoading={stats.isLoading}
        isFetching={stats.isFetching || topSocial.isFetching || topReel.isFetching}
        error={stats.error}
        minHeight="136px"
      >
        <MetricsBar>
          <MetricCard
            label={`Visits on ${LINK_PAGE_PATH}`}
            value={visits}
            change={comparison ? visits - comparison.visits : 0}
            formatValue={formatLongNumber}
            showChange={!isAllTime}
          />
          <TopItemCard label="Top social link" data={topSocial.data} unit="clicks" />
          <TopItemCard label="Top reel" data={topReel.data} unit="clicks" />
          <TopItemCard label="Top source" data={topSource.data} unit="visits" />
        </MetricsBar>
      </LoadingPanel>
      <Panel title={`Visits on ${LINK_PAGE_PATH}`}>
        <LoadingPanel
          data={pageviews.data}
          isLoading={pageviews.isLoading}
          isFetching={pageviews.isFetching}
          error={pageviews.error}
        >
          <PageviewsChart
            key={value}
            data={chartData}
            minDate={startDate}
            maxDate={endDate}
            unit={unit}
          />
        </LoadingPanel>
      </Panel>
      <Panel title="Clicks per link and reel">
        <Column gap="6">
          <Column border="bottom" paddingBottom="6">
            <EventsChart websiteId={websiteId} limit={20} params={{ event: LINK_CLICK_EVENTS }} />
          </Column>
          <MetricsTable
            websiteId={websiteId}
            type="event"
            title="Link / reel"
            metric="Clicks"
            limit={50}
            filterLink={false}
            params={{ event: LINK_CLICK_EVENTS }}
          />
        </Column>
      </Panel>
    </Column>
  );
}
