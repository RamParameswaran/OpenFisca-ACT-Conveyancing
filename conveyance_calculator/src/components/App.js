import { Fragment, useState } from 'react';

import OpenFiscaApi from '../api/openfisca_api';

import moment from 'moment';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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

const ActiveStepContent = (props) => {
  const classes = useStyles();

  const { activeStep, handleBack, handleNext, openFiscaState, setOpenFiscaState } = props;

  const [showHBSCquestions, setShowHBSCquestions] = useState(false);

  const handleCalculate = () => {
    // Calculate conveyance duties payable
    OpenFiscaApi.calculate_conveyance_duty(
      openFiscaState.date,
      openFiscaState.property_price,
      openFiscaState.land_use_type,
    ).then((res) => {
      setOpenFiscaState((openFiscaState) => ({
        ...openFiscaState,
        conveyance_duty: res.data.households.household_1.conveyance_duty[openFiscaState.date],
        conveyance_duty_under_HBCS:
          res.data.households.household_1.conveyance_duty_under_HBCS[openFiscaState.date],
      }));
    });

    // Calculate HBCS eligibility
    OpenFiscaApi.calculate_HBCS_eligibility(
      openFiscaState.date,
      openFiscaState.all_buyers_are_18_years_old,
      openFiscaState.residence_requirements_satisfied,
      openFiscaState.property_requirements_satisfied,
      openFiscaState.household_income,
      openFiscaState.number_dependent_children,
      openFiscaState.eligible_for_home_buyer_concession,
    ).then((res) => {
      setOpenFiscaState((openFiscaState) => ({
        ...openFiscaState,
        eligible_for_home_buyer_concession:
          res.data.households.household_1.eligible_for_home_buyer_concession[openFiscaState.date],
      }));
      setShowHBSCquestions(false);
    });
  };

  switch (activeStep) {
    case 0:
      return (
        <div>
          <Typography variant="h5" align="center" gutterBottom>
            Stamp Duty Calculator
          </Typography>
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
              className={classes.input}
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
                  property_price: parseFloat(e.target.value),
                }))
              }
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              className={classes.input}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel id="land_use_type">Land use type</InputLabel>
            <Select
              labelId="land-use-type"
              id="land-use-type-select"
              value={openFiscaState.land_use_type}
              onChange={(e) =>
                setOpenFiscaState((openFiscaState) => ({
                  ...openFiscaState,
                  land_use_type: e.target.value,
                }))
              }
              className={classes.input}
            >
              <MenuItem value="residential">Residential</MenuItem>
              <MenuItem value="rural">Rural</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
            </Select>
          </FormControl>

          <div className={classes.actionsContainer}>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
                size="large"
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
                size="large"
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
          <Typography variant="h5" align="center" gutterBottom>
            Are you eligible for the HBCS?
          </Typography>

          <FormControl className={classes.formControl}>
            <RadioGroup
              aria-label="eligible_HBSC"
              name="eligible_HBSC"
              value={openFiscaState.eligible_for_home_buyer_concession}
              onChange={(e) => {
                if (e.target.value) {
                  setOpenFiscaState((openFiscaState) => ({
                    ...openFiscaState,
                    eligible_for_home_buyer_concession: e.target.value === 'true',
                  }));
                  setShowHBSCquestions(false);
                } else {
                  setOpenFiscaState((openFiscaState) => ({
                    ...openFiscaState,
                    eligible_for_home_buyer_concession: null,
                  }));
                  setShowHBSCquestions(true);
                }
              }}
            >
              <FormControlLabel value={false} control={<Radio />} label="No" />
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={null} control={<Radio />} label="I don't know" />
            </RadioGroup>

            {showHBSCquestions && (
              <div style={{ paddingTop: 30 }}>
                <FormGroup className={classes.toggleSwitch}>
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    label="All buyers at least 18 years old"
                    checked={openFiscaState.all_buyers_are_18_years_old}
                    onChange={(e) => {
                      setOpenFiscaState((openFiscaState) => ({
                        ...openFiscaState,
                        all_buyers_are_18_years_old: e.target.checked,
                      }));
                    }}
                  />
                </FormGroup>

                <FormGroup className={classes.toggleSwitch}>
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    label="At least one buyer live on the property for one year"
                    checked={openFiscaState.residence_requirements_satisfied}
                    onChange={(e) => {
                      setOpenFiscaState((openFiscaState) => ({
                        ...openFiscaState,
                        residence_requirements_satisfied: e.target.checked,
                      }));
                    }}
                  />
                </FormGroup>

                <FormGroup className={classes.toggleSwitch}>
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    label="No buyer has owned a property in the last two years"
                    checked={openFiscaState.property_requirements_satisfied}
                    onChange={(e) => {
                      setOpenFiscaState((openFiscaState) => ({
                        ...openFiscaState,
                        property_requirements_satisfied: e.target.checked,
                      }));
                    }}
                  />
                </FormGroup>

                <FormGroup className={classes.toggleSwitch}>
                  <TextField
                    id="household_income"
                    label="Household gross income"
                    type="number"
                    value={openFiscaState.household_income}
                    onChange={(e) =>
                      setOpenFiscaState((openFiscaState) => ({
                        ...openFiscaState,
                        household_income: parseFloat(e.target.value),
                      }))
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    className={classes.input}
                  />
                </FormGroup>

                <FormGroup className={classes.toggleSwitch}>
                  <TextField
                    id="dependent_children"
                    label="Number of dependent children"
                    type="number"
                    value={openFiscaState.number_dependent_children}
                    onChange={(e) =>
                      setOpenFiscaState((openFiscaState) => ({
                        ...openFiscaState,
                        number_dependent_children: parseInt(e.target.value),
                      }))
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={classes.input}
                  />
                </FormGroup>
              </div>
            )}
          </FormControl>

          <div className={classes.actionsContainer}>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
                size="large"
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  handleCalculate();
                  handleNext();
                }}
                className={classes.button}
                size="large"
              >
                Calculate
              </Button>
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div>
          <Typography variant="h5" align="center" gutterBottom>
            See results
          </Typography>

          <FormControl className={classes.formControl}>
            <Typography variant="h6" gutterBottom>
              Conveyance duty payable: ${openFiscaState.conveyance_duty}
            </Typography>
            <Typography
              variant="h6"
              style={
                openFiscaState.eligible_for_home_buyer_concession
                  ? {}
                  : {
                      textDecoration: 'line-through',
                    }
              }
            >
              Conveyance duty (after concession): ${openFiscaState.conveyance_duty_under_HBCS}
            </Typography>
            {openFiscaState.eligible_for_home_buyer_concession ? (
              <Alert severity="info">
                Based on the information provided,{' '}
                <span style={{ fontWeight: 600 }}>you are eligible</span> for the Home Buyer
                Concession Scheme!
              </Alert>
            ) : (
              <Alert severity="warning">
                Based on the information provided,{' '}
                <span style={{ fontWeight: 600 }}>you are not eligible</span> for the Home Buyer
                Concession Scheme!
              </Alert>
            )}
          </FormControl>

          <div className={classes.actionsContainer}>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  handleCalculate();
                }}
                className={classes.button}
              >
                Calculate again
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
    eligible_for_home_buyer_concession: false,
    all_buyers_are_18_years_old: false,
    residence_requirements_satisfied: false,
    property_requirements_satisfied: false,
    household_income: 0,
    number_dependent_children: 0,
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
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={5}>
        <Card className={classes.card}>
          <CardContent>
            <ActiveStepContent
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              openFiscaState={openFiscaState}
              setOpenFiscaState={setOpenFiscaState}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default App;
