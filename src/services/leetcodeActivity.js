import { genericGet } from "./httpClient";

const leetcode = {};

const leetcodeRequest = async (route, params) => genericGet(`leetcode/${route}`, params);

leetcode.getUserStat = async () => leetcodeRequest("profile");
leetcode.getRecentSubmissions = async () => leetcodeRequest("submissions");
leetcode.getActivityCalendar = async (year) => leetcodeRequest("activity", { year: year??"" });
leetcode.getLanguagesData = async () => leetcodeRequest("languages");

export default leetcode;