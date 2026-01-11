import { useQueries } from "@tanstack/react-query";
import leetcode from "../services/leetcodeActivity";

const STALE_30_MIN = 1000 * 60 * 30;

const staticQueries = {
  stats: {
    queryKey: ["leetcode-stats"],
    queryFn: leetcode.getUserStat,
    staleTime: STALE_30_MIN,
  },
  langs: {
    queryKey: ["leetcode-langs"],
    queryFn: leetcode.getLanguagesData,
    staleTime: STALE_30_MIN,
  },
  submissions: {
    queryKey: ["leetcode-submissions"],
    queryFn: leetcode.getRecentSubmissions,
    staleTime: STALE_30_MIN,
  }
};

const activityQuery = (year) => ({
  queryKey: ["leetcode-activity", year],
  queryFn: () => leetcode.getActivityCalendar(year),
  staleTime: STALE_30_MIN,
});

async function prefetchLeetCode(queryClient) {
  await Promise.all([
    queryClient.prefetchQuery(staticQueries.stats),
    queryClient.prefetchQuery(staticQueries.langs),
    queryClient.prefetchQuery(staticQueries.submissions),
    queryClient.prefetchQuery(activityQuery(2025)),
  ]);
}

function useLeetCodeData(year) {
    const results = useQueries({
    queries: [
      staticQueries.stats,
      staticQueries.langs,
      staticQueries.submissions,
      activityQuery(year),
    ],
  });
  console.log("ASDASD", year)

  return {
    stats: results[0],
    langs: results[1],
    submissions: results[2],
    activity: results[3],
  };
}

export default useLeetCodeData;
export { prefetchLeetCode };
