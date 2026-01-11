import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Dropdown from "../../components/Dropdown";
import PageLoading from "../PageLoading";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function ActivityChart({ setSelectedYear, activityData }) {
    if (!activityData) return <PageLoading/>

    const years = activityData.activeYears;
    const maxStreak = activityData.streak;
    const calendarJson = activityData.submissionCalendar;
    const calendar = JSON.parse(calendarJson); 

    const submissionsByMonth = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        submissions: 0
    }));
    for (const [timestamp, count] of Object.entries(calendar)) {
        const date = new Date(timestamp * 1000);
        const month = date.getMonth();
        submissionsByMonth[month].submissions += count;
    }

    const handleYearSelected = (e) => {
        setSelectedYear(e.target.value);
    }

    return <div style={{width: "100%"}}>
        <ResponsiveContainer width="80%" height={300}>
            <BarChart data={submissionsByMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="submissions" fill="#8e6f48"/>
            </BarChart>
        </ResponsiveContainer>
        <Dropdown label="Selected year: " options={years} onSelected={handleYearSelected}/>
    </div>
}

export default ActivityChart;