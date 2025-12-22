import { genericGet } from "./httpClient";

const leetcode = {};

const leetcodeRequest = async (route) => genericGet(`leetcode/${route}`);

leetcode.getUserStat = async () => leetcodeRequest("profile");
leetcode.getRecentSubmissions = async () => leetcodeRequest("submissions");
leetcode.getActivityCalendar = async () => leetcodeRequest("activity");
leetcode.getLanguagesData = async () => leetcodeRequest("languages");

export default leetcode;