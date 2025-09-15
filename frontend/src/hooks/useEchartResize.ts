import { useEffect } from "react";

//utility hook to resize charts and make them responsive
export const useEchartResize = (chart: echarts.ECharts | null, domId: string) => {
    useEffect(() => {
        if (!chart) return;

        const observer = new ResizeObserver(() => chart.resize());
        const el = document.getElementById(domId);

        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [chart, domId]);
};
