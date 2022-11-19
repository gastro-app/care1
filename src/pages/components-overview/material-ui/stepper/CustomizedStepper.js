import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';

import PersonIcon from '@mui/icons-material/Person';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import BiotechIcon from '@mui/icons-material/Biotech';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  Box,
  Step,
  Paper,
  Button,
  Stepper,
  StepLabel,
  Typography,
  StepConnector,
  stepConnectorClasses,
  Divider
} from '@mui/material';
import PatientPersoData from './PatientPersoData';
import Indications from './Indications';
import Conclusion from './Conclusion';
import ExamenEndoscopique from './ExamenEndoscopique';

// ----------------------------------------------------------------------

const STEPS = ['Données personelles du patient', 'Indications', 'Examen Endoscopique', 'Conclusions'];
const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  height: 22,
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.disabled,
  ...(ownerState.active && {
    color: theme.palette.success.main
  }),
  '& .QontoStepIcon-completedIcon': {
    zIndex: 1,
    fontSize: 18,
    color: theme.palette.success.main
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor'
  }
}));

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool
};

function QontoStepIcon({ active, completed }) {
  return (
    <QontoStepIconRoot ownerState={{ active }}>
      {completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}
    </QontoStepIconRoot>
  );
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: theme.palette.gradients.error
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: theme.palette.gradients.error
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundColor: theme.palette.divider
  }
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  zIndex: 1,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.disabled,
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
  ...(ownerState.active && {
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    color: theme.palette.common.white,
    backgroundImage: theme.palette.gradients.error
  }),
  ...(ownerState.completed && {
    color: theme.palette.common.white,
    backgroundImage: theme.palette.gradients.error
  })
}));

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node
};

function ColorlibStepIcon(props) {
  const { active, completed } = props;

  const icons = {
    1: <PersonIcon />,
    2: <DragIndicatorIcon />,
    3: <BiotechIcon />,
    4: <AssignmentIcon />
  };

  return <ColorlibStepIconRoot ownerState={{ completed, active }}>{icons[String(props.icon)]}</ColorlibStepIconRoot>;
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <PatientPersoData />;
    case 1:
      return <Indications />;
    case 2:
      return <ExamenEndoscopique />;
    default:
      return <Conclusion />;
  }
}

export default function CustomizedSteppers() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Box sx={{ mb: 5 }} />

      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === STEPS.length ? (
        <>
          <Paper
            sx={{
              p: 3,
              my: 3,
              minHeight: 120,
              bgcolor: 'grey.50012'
            }}
          >
            <Typography sx={{ my: 1 }}>All steps completed - you&apos;re finished</Typography>
          </Paper>

          <Button color="inherit" onClick={handleReset} sx={{ mr: 1 }}>
            Reset
          </Button>
        </>
      ) : (
        <>
          <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
            <Typography variant="h3">{STEPS[activeStep]}</Typography> <Divider variant="middle" />
            <br />
            <br />
            {getStepContent(activeStep)}
          </Paper>

          <Box sx={{ textAlign: 'right' }}>
            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
              {activeStep === STEPS.length - 1 ? 'Génerer le rapport' : 'Suivant'}
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
