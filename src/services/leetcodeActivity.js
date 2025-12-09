const leetcode = {};
const baseAddress = "http://localhost:5118"

function leetcodeRequest(path) {
    return fetch(`${baseAddress}/leetcode/${path}`)
        .then(res => {
            if (!res.ok) throw new Error(`Request failed. status: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error("Fetch error: ", error)
        })
}

leetcode.getUserStat = async () => leetcodeRequest("profile");
leetcode.getRecentSubmissions = async () => leetcodeRequest("submissions");
leetcode.getActivityCalendar = async () => leetcodeRequest("activity");

export default leetcode;