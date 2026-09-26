import prisma from '@/lib/prisma';
import { parseRequest } from '@/lib/request';
import { json, unauthorized } from '@/lib/response';
import { canViewWebsite } from '@/permissions';

// Daily Instagram snapshots written by the portfolio's igstats Neon Function
// (my-portfolio repo, automations/instagram-stats) into social_stats.instagram_daily.
// The table is account-level, not per website; access follows the website's view permission.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const { websiteId } = await params;

  if (!(await canViewWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const rows = await prisma.rawQuery(
    `
    select
      to_char(stat_date, 'YYYY-MM-DD') as "statDate",
      followers_count as "followers",
      new_followers as "newFollowers",
      male_percentage::float8 as "malePercentage",
      female_percentage::float8 as "femalePercentage",
      new_male_followers as "newMaleFollowers",
      new_female_followers as "newFemaleFollowers",
      male_count as "maleCount",
      female_count as "femaleCount",
      unknown_gender_count as "unknownGenderCount"
    from social_stats.instagram_daily
    order by stat_date desc
    `,
    {},
  );

  return json(rows);
}
