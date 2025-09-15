import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { useActivities } from "../service/activities";
import { getTimestampFromDateString } from "../utils/Generic";
import type { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from "echarts";
import { useEchartResize } from "../hooks/useEchartResize";

const colorPalette = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#06b6d4", // cyan
];

const GanttChart: React.FC = () => {
    const { data: activities, isLoading, error } = useActivities();
    const [chart, setChart] = useState<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!activities) return;

        const chartDom = document.getElementById("timeline-chart")!;
        const newChart = echarts.init(chartDom);
        setChart(newChart);

        const sortedActivities = [...activities].sort(
            (a, b) => Number(a.NodeId) - Number(b.NodeId)
        );

        const seriesData = sortedActivities.map((a, i) => {
            const start = getTimestampFromDateString(a.StartDate);
            const end = getTimestampFromDateString(a.EndDate);
            return {
                name: a.NodeId,
                value: [a.NodeId, start, end],
            };
        });

        newChart.setOption({
            title: { text: "Activity Timeline (Gantt Style)", left: "center" },
            tooltip: {
                formatter: (p: any) => {
                    const start = new Date(p.value[1]).toLocaleDateString();
                    const end = new Date(p.value[2]).toLocaleDateString();
                    return `Activity ${p.name}<br/>${start} → ${end}`;
                },
            },
            grid: {
                top: 50,
                left: 120,
                right: 80,
                bottom: 60,
                containLabel: true,
            },
            yAxis: {
                data: sortedActivities.map((a) => a.NodeId),
                inverse: true,
                type: "category",
            },
            xAxis: {
                type: "time",
                name: "Date",
            },
            dataZoom: [
                {
                    type: "slider",
                    filterMode: "weakFilter",
                    xAxisIndex: 0,
                    height: 40,
                    bottom: 10,
                    showDetail: true,
                    handleSize: "100%",
                },
                { type: "inside", xAxisIndex: 0 },
                {
                    type: "slider",
                    yAxisIndex: 0,
                    width: 20,
                    right: 10,
                    top: 60,
                    bottom: 60,
                    showDetail: false,
                },
                { type: "inside", yAxisIndex: 0 },
            ],
            series: [
                {
                    type: "custom",
                    renderItem: (
                        params: CustomSeriesRenderItemParams,
                        api: CustomSeriesRenderItemAPI
                    ) => {
                        const categoryIndex = api.value(0) as number;
                        const start = api.coord([api.value(1), categoryIndex]) as number[];
                        const end = api.coord([api.value(2), categoryIndex]) as number[];

                        const size = api.size!([0, 1]) as number[];
                        const height = size[1] * 1.2;

                        const coordSys = params.coordSys as unknown as {
                            x: number;
                            y: number;
                            width: number;
                            height: number;
                        };

                        return {
                            type: "rect",
                            shape: echarts.graphic.clipRectByRect(
                                {
                                    x: start[0],
                                    y: start[1] - height / 2,
                                    width: end[0] - start[0],
                                    height: height,
                                },
                                coordSys
                            ),
                            transition: ['shape'],
                            style: {
                                fill: colorPalette[params.dataIndex % colorPalette.length],
                            },
                        };
                    },
                    encode: { x: [1, 2], y: 0 },
                    data: seriesData.map((d) => [
                        d.name,
                        d.value[1],
                        d.value[2],
                    ]),
                },
            ],
        });

        return () => newChart.dispose();
    }, [activities]);

    useEchartResize(chart, "timeline-chart");

    if (isLoading) return <p>Loading gantt chart...</p>;

    if (error) return <p>There was an error fetching the chart data. Please try again later.</p>;

    return (
        <div className="chart-wrapper">
            <div id="timeline-chart" style={{ height: 800 }} />
            <p className="text-gray-600 mb-4">
                This Gantt-style chart shows when each activity starts and ends.
                Each row represents an activity, and the colored bars show the duration.
                Use the sliders to zoom in/out on both the time axis and the list of activities.
            </p>
        </div>
    );
};

export default GanttChart;
