import { Grid, Text } from '@umami/react-zen';
import { useMemo } from 'react';
import { Chart } from '@/components/charts/Chart';
import { PieChart } from '@/components/charts/PieChart';
import { Panel } from '@/components/common/Panel';
import { CHART_COLORS } from '@/lib/constants';
import type { InstagramDailyRow } from './instagramQueries';

const LABELS = ['Women', 'Men'];
const COLORS = [CHART_COLORS[1], CHART_COLORS[0]];

// Share of known genders from the latest snapshot that has gender data
export function InstagramGenderCharts({ row }: { row?: InstagramDailyRow }) {
  const values = [row?.femalePercentage ?? 0, row?.malePercentage ?? 0];

  const chartData = useMemo(
    () => ({
      labels: LABELS,
      datasets: [
        {
          label: '% of followers',
          data: values,
          backgroundColor: COLORS,
          borderColor: COLORS,
          borderWidth: 1,
        },
      ],
    }),
    [row],
  );

  const barOptions: any = useMemo(
    () => ({
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { min: 0, max: 100, ticks: { callback: (value: number) => `${value}%` } },
      },
    }),
    [],
  );

  const title = row ? `Followers by gender · ${row.statDate}` : 'Followers by gender';

  if (!row) {
    return (
      <Panel title={title}>
        <Text color="muted">No gender data yet.</Text>
      </Panel>
    );
  }

  return (
    <Grid columns="repeat(auto-fit, minmax(320px, 1fr))" gap="3">
      <Panel title={title}>
        <PieChart type="doughnut" chartData={chartData} height="260px" />
      </Panel>
      <Panel title={`Women ${values[0]}% · Men ${values[1]}%`}>
        <Chart type="bar" chartData={chartData} chartOptions={barOptions} height="260px" />
      </Panel>
    </Grid>
  );
}
