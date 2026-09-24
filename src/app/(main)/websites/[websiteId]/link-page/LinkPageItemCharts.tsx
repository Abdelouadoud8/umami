import { Column, Grid, Heading } from '@umami/react-zen';
import { colord } from 'colord';
import { useCallback, useMemo } from 'react';
import { BarChart } from '@/components/charts/BarChart';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Panel } from '@/components/common/Panel';
import { useDateRange, useLocale, useTimezone } from '@/components/hooks';
import { renderDateLabels } from '@/lib/charts';
import { CHART_COLORS } from '@/lib/constants';
import { generateTimeSeries } from '@/lib/date';
import { formatLongNumber } from '@/lib/format';
import { getLinkPageLabel, useLinkPageClicksSeriesQuery } from './linkPageQueries';

type Series = { name: string; total: number; points: { x: string; y: number }[] };

function ItemChart({ series, color }: { series: Series; color: string }) {
  const { timezone } = useTimezone();
  const {
    dateRange: { startDate, endDate, unit },
  } = useDateRange({ timezone });
  const { locale, dateLocale } = useLocale();
  const renderXLabel = useCallback(renderDateLabels(unit, locale), [unit, locale]);

  const chartData = useMemo(() => {
    const c = colord(color);
    return {
      datasets: [
        {
          label: getLinkPageLabel(series.name),
          data: generateTimeSeries(series.points, startDate, endDate, unit, dateLocale),
          backgroundColor: c.alpha(0.6).toRgbString(),
          borderColor: c.alpha(0.7).toRgbString(),
          borderWidth: 1,
        },
      ],
    };
  }, [series, color, startDate, endDate, unit, dateLocale]);

  return (
    <Panel title={`${getLinkPageLabel(series.name)} · ${formatLongNumber(series.total)} clicks`}>
      <BarChart
        chartData={chartData}
        minDate={startDate}
        maxDate={endDate}
        unit={unit}
        renderXLabel={renderXLabel}
        height="220px"
      />
    </Panel>
  );
}

function ItemChartsGroup({ title, items }: { title: string; items: Series[] }) {
  if (!items.length) return null;

  return (
    <Column gap="3">
      <Heading size="lg">{title}</Heading>
      <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="3">
        {items.map((series, index) => (
          <ItemChart
            key={series.name}
            series={series}
            color={CHART_COLORS[index % CHART_COLORS.length]}
          />
        ))}
      </Grid>
    </Column>
  );
}

// One chart per social link and per reel, most clicked first
export function LinkPageItemCharts({ websiteId }: { websiteId: string }) {
  const { data, isLoading, error } = useLinkPageClicksSeriesQuery(websiteId);

  const { socials, reels } = useMemo(() => {
    const byName: Record<string, Series> = {};
    for (const { x, t, y } of data || []) {
      byName[x] ??= { name: x, total: 0, points: [] };
      byName[x].total += y;
      byName[x].points.push({ x: t, y });
    }
    const all = Object.values(byName).sort((a, b) => b.total - a.total);
    return {
      socials: all.filter(({ name }) => name.startsWith('links-')),
      reels: all.filter(({ name }) => name.startsWith('reel-')),
    };
  }, [data]);

  return (
    <LoadingPanel data={data} isLoading={isLoading} error={error} minHeight="220px">
      <Column gap="6">
        <ItemChartsGroup title="Social links" items={socials} />
        <ItemChartsGroup title="Reels" items={reels} />
      </Column>
    </LoadingPanel>
  );
}
