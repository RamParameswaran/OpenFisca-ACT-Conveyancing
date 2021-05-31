import { useState, useEffect } from 'react';

import OpenFiscaApi from '../api/openfisca_api';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { FormControl, Slider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 50,
  },
  formControl: {
    display: 'block',
    margin: theme.spacing(3),
    paddingTop: 20,
    paddingBottom: 20,
  },
}));

const priceArray = [
  [Date.UTC(2017, 5, 7), 1],
  [Date.UTC(2017, 8, 1), 1],
  [Date.UTC(2017, 11, 1), 1],
  [Date.UTC(2018, 2, 1), 1],
  [Date.UTC(2018, 5, 1), 1],
  [Date.UTC(2018, 8, 1), 1],
  [Date.UTC(2018, 11, 1), 1],
  [Date.UTC(2019, 2, 1), 1],
  [Date.UTC(2019, 5, 1), 1],
  [Date.UTC(2019, 8, 1), 1],
  [Date.UTC(2019, 11, 1), 1],
  [Date.UTC(2020, 2, 1), 1],
  [Date.UTC(2020, 5, 1), 1],
  [Date.UTC(2020, 8, 1), 1],
  [Date.UTC(2020, 11, 1), 1],
];

const scalePriceArray = (scale) => {
  var array = [];
  priceArray.map((item) => {
    array.push([item[0], item[1] * scale]);
  });
  return array;
};

function App() {
  const classes = useStyles();

  const [scaleFactor, setScaleFactor] = useState(550000);
  const [dutyPayable, setDutyPayable] = useState([
    [Date.UTC(2017, 6, 1), 0],
    [Date.UTC(2017, 9, 1), 0],
    [Date.UTC(2017, 12, 1), 0],
    [Date.UTC(2018, 3, 1), 0],
    [Date.UTC(2018, 6, 1), 0],
    [Date.UTC(2018, 9, 1), 0],
    [Date.UTC(2018, 12, 1), 0],
    [Date.UTC(2019, 3, 1), 0],
    [Date.UTC(2019, 6, 1), 0],
    [Date.UTC(2019, 9, 1), 0],
    [Date.UTC(2019, 12, 1), 0],
    [Date.UTC(2020, 3, 1), 0],
    [Date.UTC(2020, 6, 1), 0],
    [Date.UTC(2020, 9, 1), 0],
    [Date.UTC(2020, 12, 1), 0],
  ]);

  const [dutyPayableHBCS, setDutyPayableHBCS] = useState([
    [Date.UTC(2017, 6, 1), 0],
    [Date.UTC(2017, 9, 1), 0],
    [Date.UTC(2017, 12, 1), 0],
    [Date.UTC(2018, 3, 1), 0],
    [Date.UTC(2018, 6, 1), 0],
    [Date.UTC(2018, 9, 1), 0],
    [Date.UTC(2018, 12, 1), 0],
    [Date.UTC(2019, 3, 1), 0],
    [Date.UTC(2019, 6, 1), 0],
    [Date.UTC(2019, 9, 1), 0],
    [Date.UTC(2019, 12, 1), 0],
    [Date.UTC(2020, 3, 1), 0],
    [Date.UTC(2020, 6, 1), 0],
    [Date.UTC(2020, 9, 1), 0],
    [Date.UTC(2020, 12, 1), 0],
  ]);

  const options = {
    chart: {
      type: 'spline',
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        // don't display the dummy year
        month: '%b %y',
      },
      title: {
        text: 'Date',
      },
    },
  };

  useEffect(() => {
    OpenFiscaApi.calculate_conveyance_duty_simulation(scalePriceArray(scaleFactor)).then((res) => {
      var array = [];
      Object.entries(res.data.households.household_1.conveyance_duty).map((record) => {
        array.push([new Date(record[0]), record[1]]);
      });
      setDutyPayable(array);

      var array_hbcs = [];
      Object.entries(res.data.households.household_1.conveyance_duty_under_HBCS).map((record) => {
        array_hbcs.push([new Date(record[0]), record[1]]);
      });
      setDutyPayableHBCS(array_hbcs);
    });
  }, [scaleFactor]);

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        House Price: ${scaleFactor}
      </Typography>
      <Slider
        value={scaleFactor}
        onChange={(e, newValue) => {
          setScaleFactor(newValue);
        }}
        step={50000}
        marks
        min={300000}
        max={1000000}
      />

      <FormControl className={classes.formControl}>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            ...options,
            title: {
              text: 'Duty Payable',
            },
            series: [
              {
                name: 'Duty Payable (no concession)',
                data: dutyPayable,
              },
              {
                name: 'Duty Payable (with HBCS)',
                data: dutyPayableHBCS,
              },
            ],
            yAxis: {
              title: {
                text: 'Duty Payable ($)',
              },
            },
          }}
        />
      </FormControl>
    </div>
  );
}

export default App;
