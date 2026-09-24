import { Column, Row, Text } from '@umami/react-zen';
import { formatLongNumber } from '@/lib/format';

// Same look as MetricCard, but the tag under the value shows a name instead of a % change
export function LinkPageTagCard({
  label,
  value = 0,
  tag,
}: {
  label: string;
  value?: number;
  tag?: string;
}) {
  return (
    <Column
      justifyContent="center"
      paddingX="6"
      paddingY="4"
      borderRadius
      backgroundColor="surface"
      border
      gap="4"
    >
      <Text weight="bold" wrap="nowrap">
        {label}
      </Text>
      <Text size="4xl" weight="bold" wrap="nowrap">
        {formatLongNumber(value)}
      </Text>
      <Row
        alignItems="center"
        alignSelf="flex-start"
        paddingX="2"
        paddingY="1"
        style={
          tag
            ? { color: 'var(--zen-status-success)', background: 'var(--zen-status-success-bg)' }
            : { color: 'var(--zen-fg-muted)', background: 'var(--zen-surface-raised)' }
        }
      >
        <Text>{tag || 'No data'}</Text>
      </Row>
    </Column>
  );
}
