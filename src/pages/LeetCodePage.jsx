import { useState } from "react";
import styles from "./LeetCodePage.module.css"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useLeetCodeData from "../hooks/useLeetcodeData";
import { timeAgo } from "../utils/time";
import CustomTooltip from "../components/Recharts/CustomTooltip";
import Dropdown from "../components/Dropdown";

function LeetCodePage() {
    const { stats, langs, submissions, activity } = useLeetCodeData();
    const [selectedYeat, setSelectedYear] = useState(2025);
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const difficultyColors = {Easy: "#A8E6CF", Medium: "#FFD3B6", Hard: "#FF8B94"};
    const languageColors = {"C#": "#8DD3C7","C++": "#BEBADA","Python3": "#FDB462","Java": "#FFB6B9",};
 
    if (stats.isLoading) return <>
        <div className={styles.pageContainer}>
            <h1>Loading...</h1>
        </div>
    </>
    
    const submissionNum = stats.data.matchedUser.submitStatsGlobal.acSubmissionNum;
    console.log(submissionNum)
    const pieDataSubmissions = submissionNum
        .filter(item => item.difficulty !== "All")
        .map(item => ({
            name: item.difficulty,
            value: item.count
        }));
    
    const langData = langs.data.matchedUser.languageProblemCount;


    const years = activity.data.matchedUser.userCalendar.activeYears;
    const maxStreak = activity.data.matchedUser.userCalendar.streak;
    const calendarJson = activity.data.matchedUser.userCalendar.submissionCalendar;
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


    console.log(submissions.data.recentAcSubmissionList)


    return(
        <div className={styles.pageContainer}>
            <h1>LeetCode Activity</h1>
            <h2>Overall Statistics</h2>
            <div style={{ display: "flex" }} >
                <div>
                <PieChart width={400} height={300}>
                    <Pie
                        data={pieDataSubmissions}
                        dataKey="value"
                        innerRadius={90}
                        outerRadius={135}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) / 2;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                            <text
                                x={x}
                                y={y+5}
                                fill="#fff"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontWeight="bold"
                                fontSize={12}
                            >
                            {pieDataSubmissions[index].name}
                        </text>
                        );
                    }}
                    >
                    {pieDataSubmissions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={difficultyColors[entry.name]} />
                    ))} 
                    </Pie>
                    <Tooltip/>
                    <Pie
                        data={langData}
                        nameKey="languageName"
                        dataKey="problemsSolved"
                        outerRadius={85}
                        cx="50%"
                        cy="50%"
                    >
                    {langData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={languageColors[entry.languageName]} />
                    ))} 
                    </Pie>
                </PieChart>
                <p style={{textAlign: "center"}}>Total Solved: {submissionNum[0].count}</p>
                </div>
                <div style={{width: "100%"}}>
                    <ResponsiveContainer width="80%" height={300}>
                        <BarChart data={submissionsByMonth}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="submissions" fill="#8e6f48"/>
                        </BarChart>
                    </ResponsiveContainer>
                    <Dropdown label="Selected year: " options={years}/>
                </div>
            </div>
            <div>
                <h2>Recent Submissions</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>
                                Time
                                <div className={styles.divider}/>
                            </th>
                            <th>
                                Problem Name
                                <div className={styles.divider}/>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.data.recentAcSubmissionList.map((sub, i) => {
                            return (
                                <tr className={`${styles.row} ${i % 2 !== 0 ? styles.odd : ''}`}>
                                    <td className={styles.tableElement}>
                                        {timeAgo(sub.timestamp)}
                                    </td>
                                    <td className={styles.tableElement}>
                                        {sub.title}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LeetCodePage;