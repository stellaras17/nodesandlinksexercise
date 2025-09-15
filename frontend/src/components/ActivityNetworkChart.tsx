import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { useActivities, useActivityAdjecency } from "../service/activities";
import { useEchartResize } from "../hooks/useEchartResize";

const ActivityNetworkChart: React.FC = () => {
    const { data: activities, error: activitiesError, isLoading: activitiesLoading } = useActivities();
    const { data: adjacency, error: adjecencyError, isLoading: adjecencyLoading } = useActivityAdjecency();

    const [chart, setChart] = useState<echarts.ECharts | null>(null);


    useEffect(() => {
        if (!activities || !adjacency) return;

        const chartDom = document.getElementById("network-chart")!;
        const newChart = echarts.init(chartDom);
        setChart(newChart);


        // Convert adjacency into edges
        const edges: { source: string; target: string }[] = [];
        adjacency.forEach((row: any, i: number) => {
            Object.entries(row).forEach(([_, val], j) => {
                if (val === "1") {
                    edges.push({ source: activities[i].NodeId, target: activities[j].NodeId });
                }
            });
        });

        newChart.setOption({
            title: { text: "Activity Dependency Network" },
            tooltip: {},
            series: [
                {
                    type: "graph",
                    layout: "force",
                    roam: true,
                    data: activities.map((a) => ({ id: a.NodeId, name: a.NodeId })),
                    edges: edges,
                    force: { repulsion: 100 },
                },
            ],
        });

        return () => newChart.dispose();
    }, [activities, adjacency]);

    useEchartResize(chart, "degree-chart");

    if (activitiesLoading || adjecencyLoading) return <p>Loading chart...</p>;


    if (activitiesError || adjecencyError) return <p>There was an error fetching the chart data. Please try again later.</p>;


    return <div className="chart-wrapper">
        <div id="network-chart" style={{ height: 800 }} />;
        <p className="text-gray-600 mb-4">
            This chart visualizes the dependencies between activities. Each node in the network represents an activity and each link represents a dependency.
        </p>
    </div>
};

export default ActivityNetworkChart;
