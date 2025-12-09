import { useEffect, useState } from "react";
import styles from "./ExperiencePage.module.css"
import leetcode from "../services/leetcodeActivity";
import { BarChart, Pie, PieChart } from "recharts";
import useLeetCodeData from "../hooks/useLeetcodeData";

function LeetCodePage() {
    const { stats, submissions, activity } = useLeetCodeData();

    if (stats.isLoading) return <>
        <div className={styles.pageContainer}>
            <h1>Loading...</h1>
        </div>
    </>
    
    console.log(activity.data)
    const submissionNum = stats.data.matchedUser.submitStatsGlobal.acSubmissionNum;
    const pieData = submissionNum
        .filter(item => item.difficulty !== "All")
        .map(item => ({
            name: item.difficulty,
            value: item.count
        }));
    

    return(
        <div className={styles.pageContainer}>
            <h1>LeetCode Activity</h1>
            <PieChart width={300} height={300}>
                <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={80}
                    cx="50%"
                    cy="50%"
                />
                <Pie/>
            </PieChart>
            <BarChart>
                
            </BarChart>

        </div>
    )
}

export default LeetCodePage;