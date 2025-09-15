import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { useActivities, useActivityAdjecency } from "../service/activities";
import { useEchartResize } from "../hooks/useEchartResize";

const ActivityDegreeChart: React.FC = () => {
    const { data: activities, error: activitiesError, isLoading: activitiesLoading } = useActivities();
    const { data: adjacency, error: adjecencyError, isLoading: adjecencyLoading } = useActivityAdjecency();

    const [chart, setChart] = useState<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!activities || !adjacency) return;

        const chartDom = document.getElementById("degree-chart")!;
        const newChart = echarts.init(chartDom);
        setChart(newChart);

        // Count outgoing dependencies
        let degrees = activities.map((a, i) => {
            const count = Object.values(adjacency[i]).filter((v) => v === "1").length;
            return { name: a.NodeId, value: count };
        });

        degrees = degrees.sort((a, b) => b.value - a.value);

        newChart.setOption({
            title: { text: "Dependency Degree Distribution" },
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
            },
            grid: {
                left: 60,
                right: 30,
                bottom: 80,
                containLabel: true,
            },
            xAxis: {
                type: "category",
                data: degrees.map((d) => d.name),
                axisLabel: { rotate: 45 },
            },
            yAxis: { type: "value", name: "Dependencies" },
            dataZoom: [
                {
                    type: "slider",
                    show: true,
                    xAxisIndex: 0,
                    height: 20,
                    bottom: 30,
                },
                {
                    type: "inside",
                    xAxisIndex: 0,
                    zoomOnMouseWheel: true,
                    moveOnMouseWheel: true,
                },
            ],
            series: [
                {
                    type: "bar",
                    data: degrees.map((d) => d.value),
                    itemStyle: { color: "#3b82f6" },
                },
            ],
        });

        return () => {
            newChart.dispose();
        };
    }, [activities, adjacency]);

    useEchartResize(chart, "degree-chart");

    if (activitiesLoading || adjecencyLoading) return <p>Loading chart...</p>;


    if (activitiesError || adjecencyError) return <p>There was an error fetching the chart data. Please try again later.</p>;

    return <div className="chart-wrapper">
        <div id="degree-chart" style={{ height: 800 }} />
        <p className="text-gray-600 mb-4">
            This chart shows how many outgoing dependencies each activity has. Activities with a higher bar
            are more connected, meaning they influence more other activities in the workflow.
        </p>
    </div>
};

export default ActivityDegreeChart;
