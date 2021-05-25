import { Fragment, useState } from 'react';

import OpenFiscaApi from '../api/openfisca_api';

import moment from 'moment';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  formControl: {
    display: 'block',
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const ActiveStepContent = (props) => {
  const classes = useStyles();

  const { activeStep, handleBack, handleNext, openFiscaState, setOpenFiscaState } = props;

  switch (activeStep) {
    case 0:
      return (
        <div>
          <Typography variant="h6">Enter property details</Typography>
          <FormControl className={classes.formControl}>
            <TextField
              id="purchase_date"
              label="Purchase date"
              type="date"
              value={openFiscaState.date}
              onChange={(e) =>
                setOpenFiscaState((openFiscaState) => ({
                  ...openFiscaState,
                  date: e.target.value,
                }))
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <TextField
              id="property_price"
              label="Property price"
              type="number"
              value={openFiscaState.property_price}
              onChange={(e) =>
                setOpenFiscaState((openFiscaState) => ({
                  ...openFiscaState,
                  property_price: e.target.value,
                }))
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={openFiscaState.land_use_type}
              onChange={(e) =>
                setOpenFiscaState((openFiscaState) => ({
                  ...openFiscaState,
                  land_use_type: e.target.value,
                }))
              }
            >
              <MenuItem value="residential">Residential</MenuItem>
              <MenuItem value="rural">Rural</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
            </Select>
          </FormControl>

          <div className={classes.actionsContainer}>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      );

    case 1:
      return (
        <div>
          <Typography variant="h6">Are you eligible for the HBCS?</Typography>

          <div className={classes.actionsContainer}>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div>
          <Typography variant="h6">See results</Typography>
          {openFiscaState.conveyance_duty !== null && (
            <Fragment>
              <Typography variant="h6">
                Conveyance duty payable: ${openFiscaState.conveyance_duty}
              </Typography>
              <Typography variant="h6">
                Conveyance duty (after concession): ${openFiscaState.conveyance_duty_under_HBCS}
              </Typography>
            </Fragment>
          )}
          <div className={classes.actionsContainer}>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  OpenFiscaApi.calculate_conveyance_duty(
                    openFiscaState.date,
                    openFiscaState.property_price,
                    openFiscaState.land_use_type,
                  ).then((res) => {
                    setOpenFiscaState((openFiscaState) => ({
                      ...openFiscaState,
                      conveyance_duty:
                        res.data.households.household_1.conveyance_duty[openFiscaState.date],
                      conveyance_duty_under_HBCS:
                        res.data.households.household_1.conveyance_duty_under_HBCS[
                          openFiscaState.date
                        ],
                    }));
                  });
                }}
                className={classes.button}
              >
                Calculate
              </Button>
            </div>
          </div>
        </div>
      );

    default:
      return 'Unknown step';
  }
};

function App() {
  const classes = useStyles();

  var today = new Date();
  const [openFiscaState, setOpenFiscaState] = useState({
    date: moment(today).format('YYYY-MM-DD'),
    conveyance_duty: null,
    conveyance_duty_under_HBCS: null,
    property_price: 0,
    land_use_type: 'residential',
  });

  // STEPPER
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Calculate conveyance duty payable', 'Are you eligible for HBCS?', 'See results'];
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <ActiveStepContent
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleNext}
        openFiscaState={openFiscaState}
        setOpenFiscaState={setOpenFiscaState}
      />
    </div>
  );
}

export default App;
