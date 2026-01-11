import { useEffect, useState } from "react";
import styles from "./LeetCodePage.module.css"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useLeetCodeData from "../../hooks/useLeetcodeData";
import { timeAgo } from "../../utils/time";
import Dropdown from "../../components/Dropdown";
import PageLoading from "../PageLoading";
import leetcode from "../../services/leetcodeActivity";
import ActivityChart from "./ActivityChart";

function LeetCodePage() {
    const [selectedYear, setSelectedYear] = useState(2025);
    const { stats, langs, submissions, activity } = useLeetCodeData(selectedYear);
    const difficultyColors = {Easy: "#A8E6CF", Medium: "#FFD3B6", Hard: "#FF8B94"};
    const languageColors = {"C#": "#8DD3C7","C++": "#BEBADA","Python3": "#FDB462","Java": "#FFB6B9",};

    const isLoading =
    !stats || stats.isLoading ||
    !langs?.data ||
    !submissions?.data;

    if (isLoading) {
        return <PageLoading/>
    }
    
    const submissionNums = Object.entries(stats.data);
    const pieDataSubmissions = submissionNums
        .filter(item => item[0] !== "username")
        .map(item => ({
            name: item[0].slice(6, item[0].length),
            value: item[1]
    }));
    
    const langData = langs.data.problemsSolvedByLanguages;


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
                <p style={{textAlign: "center"}}>Total Solved: {submissionNums[0].count}</p>
                </div>
            <ActivityChart setSelectedYear={setSelectedYear} activityData={activity.data}/>
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
                        {submissions.data.submissions.map((sub, i) => {
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