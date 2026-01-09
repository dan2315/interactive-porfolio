import { useQueries } from "@tanstack/react-query";
import leetcode from "../services/leetcodeActivity";

const STALE_30_MIN = 1000 * 60 * 30;

const leetcodeQueries = {
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
  },
  activity: {
    queryKey: ["leetcode-activity"],
    queryFn: leetcode.getActivityCalendar,
    staleTime: STALE_30_MIN,
  },
};

async function prefetchLeetCode(queryClient) {
  await Promise.all(
    Object.values(leetcodeQueries).map((query) =>
      queryClient.prefetchQuery(query)
    )
  );
}

function useLeetCodeData() {
  const results = useQueries({
    queries: Object.values(leetcodeQueries),
  });

  return {
    stats: results[0],
    langs: results[1],
    submissions: results[2],
    activity: results[3],
  };
}

export default useLeetCodeData;
export { prefetchLeetCode, leetcodeQueries };
