import { useQuery } from "@tanstack/react-query";
import leetcode from "../services/leetcodeActivity";

function useLeetCodeData() {
    const stats = useQuery({
        queryKey: ["leetcode-stats"],
        queryFn: leetcode.getUserStat,
        staleTime: 1000 * 60 * 30,
    });

    const langs = useQuery({
        queryKey: ["leetcode-langs"],
        queryFn: leetcode.getLanguagesData,
        staleTime: 1000 * 60 * 30,
    })

    const submissions = useQuery({
        queryKey: ["leetcode-submissions"],
        queryFn: leetcode.getRecentSubmissions,
        staleTime: 1000 * 60 * 30,
    });

    const activity = useQuery({
        queryKey: ["leetcode-activity"],
        queryFn: leetcode.getActivityCalendar,
        staleTime: 1000 * 60 * 30,
    });

    return { stats, langs, submissions, activity };
}

export default useLeetCodeData;