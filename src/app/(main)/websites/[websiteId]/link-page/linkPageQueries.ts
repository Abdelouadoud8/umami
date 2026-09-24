import { keepPreviousData } from '@tanstack/react-query';
import { useApi, useDateParameters, useFilterParameters } from '@/components/hooks';

// Portfolio link-in-bio page and the event names its tracker sends
// (see my-portfolio lib/analytics.ts DYNAMIC_EVENTS).
export const LINK_PAGE_PATH = '/links';
export const LINK_PAGE_FILTER = `eq.${LINK_PAGE_PATH}`;
export const SOCIAL_CLICK_EVENTS = 're.^links-.+-click$';
export const REEL_CLICK_EVENTS = 're.^reel-.+';
export const LINK_CLICK_EVENTS = 're.^(links-.+-click|reel-.+)$';
export const VISIT_SOURCE_EVENTS = 're.^visit-from-.+';

// "links-instagram-click" -> "Instagram", "visit-from-tiktok" -> "Tiktok", "reel-Dde4utyo5Jd" -> "Dde4utyo5Jd"
export function getLinkPageLabel(eventName?: string) {
  if (!eventName) return undefined;
  if (eventName.startsWith('reel-')) return eventName.slice('reel-'.length);

  const name = eventName.replace(/^links-|-click$|^visit-from-/g, '');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function useLinkPageStatsQuery(websiteId: string) {
  const { get, useQuery } = useApi();
  const { startAt, endAt } = useDateParameters();
  const filters = useFilterParameters();
  const params = { startAt, endAt, ...filters, path: LINK_PAGE_FILTER };

  return useQuery<{ visits: number; comparison: { visits: number } }>({
    queryKey: ['link-page:stats', { websiteId, ...params }],
    queryFn: () => get(`/websites/${websiteId}/stats`, params),
    enabled: !!websiteId,
  });
}

export function useLinkPagePageviewsQuery(websiteId: string) {
  const { get, useQuery } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();
  const params = { startAt, endAt, unit, timezone, ...filters, path: LINK_PAGE_FILTER };

  return useQuery<{ pageviews: any[]; sessions: any[] }>({
    queryKey: ['link-page:pageviews', { websiteId, ...params }],
    queryFn: () => get(`/websites/${websiteId}/pageviews`, params),
    enabled: !!websiteId,
  });
}

// Top events matching `event` (an operator filter such as SOCIAL_CLICK_EVENTS)
export function useLinkPageEventsQuery(
  websiteId: string,
  event: string,
  { limit = 1, path }: { limit?: number; path?: string } = {},
) {
  const { get, useQuery } = useApi();
  const { startAt, endAt } = useDateParameters();
  const filters = useFilterParameters();
  const params = { startAt, endAt, ...filters, type: 'event', event, limit, path };

  return useQuery<{ x: string; y: number }[]>({
    queryKey: ['link-page:events', { websiteId, ...params }],
    queryFn: () => get(`/websites/${websiteId}/metrics`, params),
    enabled: !!websiteId,
    placeholderData: keepPreviousData,
  });
}

// Clicks per link/reel over time: [{ x: eventName, t: date, y: count }]
export function useLinkPageClicksSeriesQuery(websiteId: string) {
  const { get, useQuery } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();
  const params = { startAt, endAt, unit, timezone, ...filters, event: LINK_CLICK_EVENTS };

  return useQuery<{ x: string; t: string; y: number }[]>({
    queryKey: ['link-page:clicks-series', { websiteId, ...params }],
    queryFn: () => get(`/websites/${websiteId}/events/series`, params),
    enabled: !!websiteId,
  });
}
