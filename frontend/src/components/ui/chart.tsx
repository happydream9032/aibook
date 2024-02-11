import { useEffect, useRef } from 'react';
import Chart from 'chart.js';

const ChartComponent = (props: { data: any, titles: any, chart_type: number }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
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
        type: chart_type,
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
        options: {
          // title: {
          //   display: true,
          //   position: 'top',
          //   text: [props.titles.title, props.titles.subtitle],
          //   fontSize: 15,
          //   align: 'left'
          // },
          scales: {
            // xAxes: [{
            //   "scaleLabel": {
            //     display: true,
            //     labelString: props.titles.X_Axis
            //   }
            // }],
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
