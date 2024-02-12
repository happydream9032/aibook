import { useEffect, useRef } from 'react';
import Chart, { ChartConfiguration, ChartType, ChartTypeRegistry } from 'chart.js/auto';

const ChartComponent = (props: { data: any, titles: any, chart_type: number }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef: any = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy(); // Destroy the existing Chart instance
      }

      let chart_type = '';
      let border_color = '';
      console.log("dataset of chart is", props.data, props.chart_type);
      if (props.chart_type === 0) {
        chart_type = 'bar';
      } else {
        chart_type = 'line';
      }

      if (props.chart_type === 2) {
        border_color = 'rgba(255, 255, 255, 0)';
      } else {
        border_color = 'rgba(75, 192, 192, 1)';
      }

      const myChart = new Chart(chartRef.current, {
        type: chart_type as ChartType,
        data: {
          labels: Object.keys(props.data),
          datasets: [
            {
              label: props.titles.X_Axis,
              data: Object.values(props.data),
              backgroundColor: 'rgba(75, 192, 192, 1)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              borderColor: border_color,
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        // options: {
        //   scales: {
        //     yAxes: {
        //       scaleLabel: {
        //         display: true,
        //         labelString: props.titles.Y_Axis
        //       }
        //     }
        //   },
        // }
        options: {
          scales: {
            y: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: {
                stepSize: 20
              },
              title: {
                display: true,
                text: props.titles.Y_Axis
              }
            },
          },
        }
      });
      chartInstanceRef.current = myChart;
    }
  }, [props.data]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
