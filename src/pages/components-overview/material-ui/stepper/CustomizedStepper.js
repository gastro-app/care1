import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
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
import { useSnackbar } from 'notistack';
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

function getStepContent(step, formik) {
  switch (step) {
    case 0:
      return <PatientPersoData formik={formik} />;
    case 1:
      return <Indications formik={formik} />;
    case 2:
      return <ExamenEndoscopique formik={formik} />;
    default:
      return <Conclusion formik={formik} />;
  }
}

export default function CustomizedSteppers({ isEdit, currentReport }) {
  const NewReportSchema = Yup.object().shape({
    nom: Yup.string().required('Le nom est requis'),
    prenom: Yup.string().required('Le prénom est requis'),
    age: Yup.string().required('age est requis'),
    sexe: Yup.string().required('sexe est requis'),
    numDoss: Yup.string().required('numero de dossier est requis'),
    etab: Yup.string().required('établissement sanitaire est requis'),
    antecedents: Yup.string().required('antecedents est requis'),
    indications: Yup.string().required('indications est requis'),
    FOGDmaterials: Yup.string().required('materials est requis'),
    FOGDoesophage: Yup.string().required('oesophage est requis'),
    FOGDcardia: Yup.string().required('cardia est requis'),
    FOGDfundus: Yup.string().required('fundus est requis'),
    FOGDantre: Yup.string().required('antre est requis'),
    FOGDpylore: Yup.string().required('pylore est requis'),
    FOGDdidii: Yup.string().required('DIDII est requis'),
    ColoscopieMaterials: Yup.string().required('Materials est requis'),
    ColoscopieColonGauche: Yup.string().required('Colon Gauche est requis'),
    ColoscopieColonTansverse: Yup.string().required('Colon Tansverse est requis'),
    ColoscopieColonDroit: Yup.string().required('Colon Droit est requis'),
    ColoscopiePreparation: Yup.string().required('Preparation est requis'),
    ColoscopieBasFondCaecal: Yup.string().required('Bas Fond Caecal est requis'),
    ColoscopieColonGaucheText: Yup.string().required('Colon Gauche est requis'),
    ColoscopieColonTansverseText: Yup.string().required('Colon Tansverse est requis'),
    ColoscopieColonDroitText: Yup.string().required('Colon Droit est requis'),
    conclusion: Yup.string().required('conclusion est requis')
  });
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nom: currentReport?.nom || '',
      prenom: currentReport?.prenom || '',
      age: currentReport?.age || '',
      sexe: currentReport?.sexe || '',
      numDoss: currentReport?.numDoss || '',
      etab: currentReport?.etab || '',
      antecedents: currentReport?.antecedents || '',
      indications: currentReport?.indications || '',
      FOGDmaterials: currentReport?.FOGDmaterials || '',
      FOGDoesophage: currentReport?.FOGDoesophage || '',
      FOGDcardia: currentReport?.FOGDcardia || '',
      FOGDEstomac: currentReport?.FOGDEstomac || 'Non Exploré',
      FOGDBiopsie: currentReport?.FOGDBiopsie || false,
      FOGDfundus: currentReport?.FOGDfundus || '',
      FOGDantre: currentReport?.FOGDantre || '',
      FOGDpyloreExplored: currentReport?.FOGDpylore || 'Non Exploré',
      FOGDpylore: currentReport?.FOGDpylore || '',
      FOGDdidii: currentReport?.FOGDdidii || '',
      FOGDdidiiExplored: currentReport?.FOGDdidiiExplored || 'Non Exploré',
      ColoscopieMaterials: currentReport?.ColoscopieMaterials || '',
      ColoscopieColonGauche: currentReport?.ColoscopieColonGauche || '',
      ColoscopieColonTansverse: currentReport?.ColoscopieColonTansverse || '',
      ColoscopieColonDroit: currentReport?.ColoscopieColonDroit || '',
      ColoscopiePreparation: currentReport?.ColoscopiePreparation || '',
      ColoscopieIleon: currentReport?.ColoscopieIleon || '',
      ColoscopieBasFondCaecal: currentReport?.ColoscopieBasFondCaecal || '',
      ColoscopieColonGaucheText: currentReport?.ColoscopieColonGaucheText || '',
      ColoscopieColonTansverseText: currentReport?.ColoscopieColonTansverseText || '',
      ColoscopieColonDroitText: currentReport?.ColoscopieColonDroitText || '',
      ColoscopieRectum: currentReport?.ColoscopieRectum || '',
      ColoscopieIleonExplored: currentReport?.ColoscopieIleonExplored || '',
      ColoscopieBasFondCaecalExplored: currentReport?.ColoscopieBasFondCaecalExplored || '',
      ColoscopieColonGaucheTextExplored: currentReport?.ColoscopieColonGaucheTextExplored || '',
      ColoscopieColonTansverseTextExplored: currentReport?.ColoscopieColonTansverseTextExplored || '',
      ColoscopieColonDroitTextExplored: currentReport?.ColoscopieColonDroitTextExplored || '',
      ColoscopieRectumExplored: currentReport?.ColoscopieRectumExplored || '',
      conclusion: currentReport?.conclusion || ''
    },
    // validationSchema: NewReportSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        resetForm();
        setSubmitting(false);
        enqueueSnackbar('Report generated', { variant: 'success' });
        // navigate(PATH_DASHBOARD.user.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

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
            <FormikProvider value={formik}>
              {' '}
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                {getStepContent(activeStep, formik)}
              </Form>
            </FormikProvider>
          </Paper>

          <Box sx={{ textAlign: 'right' }}>
            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === STEPS.length - 1 ? handleSubmit : handleNext}
              sx={{ mr: 1 }}
            >
              {activeStep === STEPS.length - 1 ? 'Génerer le rapport' : 'Suivant'}
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
