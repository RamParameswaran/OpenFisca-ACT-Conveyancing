import { Fragment, useState, useEffect } from 'react';

import OpenFiscaApi from '../api/openfisca_api';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import moment from 'moment';
import { FormControl, Slider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 50,
  },
  card: {
    minWidth: 575,
  },

  actionsContainer: {
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '40%',
  },

  resetContainer: {
    padding: theme.spacing(3),
  },
  formControl: {
    display: 'block',
    margin: theme.spacing(3),
    paddingTop: 20,
    paddingBottom: 20,
  },
  input: {
    width: '100%',
  },
  toggleSwitch: {
    marginTop: 15,
    marginBottom: 15,
  },
}));

const priceArray = [
  [Date.UTC(2017, 5, 1), 670000],
  [Date.UTC(2017, 8, 1), 667500],
  [Date.UTC(2017, 11, 1), 690000],
  [Date.UTC(2018, 2, 1), 698500],
  [Date.UTC(2018, 5, 1), 690000],
  [Date.UTC(2018, 8, 1), 700000],
  [Date.UTC(2018, 11, 1), 720000],
  [Date.UTC(2019, 2, 1), 688000],
  [Date.UTC(2019, 5, 1), 715000],
  [Date.UTC(2019, 8, 1), 677300],
  [Date.UTC(2019, 11, 1), 741800],
  [Date.UTC(2020, 2, 1), 721000],
  [Date.UTC(2020, 5, 1), 728000],
  [Date.UTC(2020, 8, 1), 761000],
  [Date.UTC(2020, 11, 1), 795000],
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

  const [scaleFactor, setScaleFactor] = useState(1);
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

  const dutyPayable_AsPerc = [];
  dutyPayable.map((duty, index) => {
    dutyPayable_AsPerc.push([duty[0], (duty[1] * 100) / priceArray[index][1]]);
  });

  const dutyPayableHBCS_AsPerc = [];
  dutyPayableHBCS.map((duty, index) => {
    dutyPayableHBCS_AsPerc.push([duty[0], (duty[1] * 100) / priceArray[index][1]]);
  });

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        Scale Property Prices
      </Typography>
      <Slider
        value={scaleFactor}
        onChange={(e, newValue) => {
          setScaleFactor(newValue);
        }}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={0.05}
        marks
        min={0.5}
        max={1.5}
      />

      <FormControl className={classes.formControl}>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            ...options,
            title: {
              text: 'Media House Price in the ACT',
            },
            series: [
              {
                name: 'Median House Price',
                data: scalePriceArray(scaleFactor),
              },
            ],
            yAxis: {
              title: {
                text: 'Median House Price ($)',
              },
            },
          }}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            ...options,
            title: {
              text: 'Duty Payable on Median House Price',
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
      <FormControl className={classes.formControl}>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            ...options,
            title: {
              text: 'Duty Payable as a percentage of House Price',
            },
            series: [
              {
                name: 'Duty Payable as % of House Price (no concession)',
                data: dutyPayable_AsPerc,
              },
              {
                name: 'Duty Payable as % of House Price (with HBCS)',
                data: dutyPayableHBCS_AsPerc,
              },
            ],
            yAxis: {
              title: {
                text: 'Duty Payable as % of House Price (%)',
              },
              labels: {
                format: '{value}%',
              },
            },
            tooltip: {
              valueSuffix: '%',
              valueDecimals: 2,
            },
          }}
        />
      </FormControl>
    </div>
  );
}

export default App;
