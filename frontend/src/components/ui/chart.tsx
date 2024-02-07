import { useEffect, useRef } from 'react';
import Chart from 'chart.js';

const ChartComponent = (props: { data: any, titles: any }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const myChart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: Object.keys(props.data),
          datasets: [
            {
              label: props.titles.X_Axis,
              data: Object.values(props.data),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              pointBackgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            position: 'top',
            text: [props.titles.title, props.titles.subtitle],
            fontSize: 15,
            align: 'left'
          },
          scales: {
            xAxes: [{
              "scaleLabel": {
                display: true,
                labelString: props.titles.X_Axis
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: props.titles.Y_Axis
              }
            }]
          },
        }
      });
    }
  }, [props.data]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
