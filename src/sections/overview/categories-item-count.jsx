import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function CategoriesItemCount({ title, subheader, chart, ...other }) {
  const { colors, series, options } = chart;
  console.log(series,'.....')

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    colors,
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '28%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: series.map((i) => i.label),
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={[{ data: chartSeries }]}
          options={chartOptions}
          width="100%"
          height={500}
        />
      </Box>
    </Card>
  );
}

CategoriesItemCount.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
