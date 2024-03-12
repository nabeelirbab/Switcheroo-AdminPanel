import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  chartContainer: {
    position: 'relative',
    width: '80vw', // Adjust the width as needed
    height: '50vh', // Adjust the height as needed
  },
}));

const LineChartComponent = ({ chartData }) => {
  const classes = useStyles();

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: chartData.datasetLabel,
        data: chartData.data,
        fill: false,
        borderColor: chartData.borderColor,
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        type: 'linear', // specify type as 'linear'
        // additional scale configuration options
      }
    }
  };

  return (
    <div className={classes.chartContainer}>
      <Line data={data} options={options} />
    </div>
  );
};

LineChartComponent.propTypes = {
    chartData: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
      datasetLabel: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      borderColor: PropTypes.string.isRequired,
    }).isRequired,
  };

export default LineChartComponent;
