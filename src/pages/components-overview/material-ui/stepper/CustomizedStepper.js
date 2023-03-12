import PropTypes from 'prop-types';
import { useState } from 'react';
/* eslint-disable react/button-has-type */
/* eslint-disable new-cap */
import jsPDF from 'jspdf';
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

const STEPS = [
  'Données personelles du patient',
  'Phase I : Pré-endoscopie',
  'Phase II : Per-endoscopie',
  'Phase III : Post-endoscopie'
];
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
  // const NewReportSchema = Yup.object().shape({
  //   nom: Yup.string().required('Le nom est requis'),
  //   prenom: Yup.string().required('Le prénom est requis'),
  //   age: Yup.string().required('age est requis'),
  //   sexe: Yup.string().required('sexe est requis'),
  //   numDoss: Yup.string().required('numero de dossier est requis'),
  //   etab: Yup.string().required('établissement sanitaire est requis'),
  //   antecedents: Yup.string().required('antecedents est requis'),
  //   indications: Yup.string().required('indications est requis'),
  //   FOGDmaterials: Yup.string().required('materials est requis'),
  //   FOGDoesophage: Yup.string().required('oesophage est requis'),
  //   FOGDcardia: Yup.string().required('cardia est requis'),
  //   FOGDfundus: Yup.string().required('fundus est requis'),
  //   FOGDantre: Yup.string().required('antre est requis'),
  //   FOGDpylore: Yup.string().required('pylore est requis'),
  //   FOGDdidii: Yup.string().required('DIDII est requis'),
  //   ColoscopieMaterials: Yup.string().required('Materials est requis'),
  //   ColoscopieColonGauche: Yup.string().required('Colon Gauche est requis'),
  //   ColoscopieColonTansverse: Yup.string().required('Colon Tansverse est requis'),
  //   ColoscopieColonDroit: Yup.string().required('Colon Droit est requis'),
  //   ColoscopiePreparation: Yup.string().required('Preparation est requis'),
  //   ColoscopieBasFondCaecal: Yup.string().required('Bas Fond Caecal est requis'),
  //   ColoscopieColonGaucheText: Yup.string().required('Colon Gauche est requis'),
  //   ColoscopieColonTansverseText: Yup.string().required('Colon Tansverse est requis'),
  //   ColoscopieColonDroitText: Yup.string().required('Colon Droit est requis'),
  //   conclusion: Yup.string().required('conclusion est requis')
  // });
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nom: currentReport?.nom || '',
      prenom: currentReport?.prenom || '',
      age: currentReport?.age || '',
      genre: currentReport?.genre || '',
      numDoss: currentReport?.numDoss || '',
      numTel: currentReport?.numTel || '',
      serviceOrigine: currentReport?.serviceOrigine || '',
      consentement: currentReport?.consentement || '',
      antecedentsFam: currentReport?.antecedentsFam || '',
      antecedentsPerso: currentReport?.antecedentsPerso || '',
      descAntecedentFam: currentReport?.descAntecedentFam || '',
      descAntecedentPerso: currentReport?.descAntecedentPerso || '',
      nombrePacketTabac: currentReport?.nombrePacketTabac || '',
      consoAlcool: currentReport?.consoAlcool || false,
      autresHabitudes: currentReport?.autresHabitudes || '',
      antiCoagulants: currentReport?.antiCoagulants || false,
      antiCoagulantsClasse: currentReport?.antiCoagulantsClasse || '',
      antiCoagulantsDose: currentReport?.antiCoagulantsDose || '',
      antiCoagulantsNb: currentReport?.antiCoagulantsNb || '',
      antiCoagulantsGestionDebut: currentReport?.antiCoagulantsGestionDebut || '',
      antiCoagulantsGestionFin: currentReport?.antiCoagulantsGestionFin || '',
      autresTraitements: currentReport?.autresTraitements || '',
      typeIndication: currentReport?.typeIndication || false,
      diagnostiqueIndex: currentReport?.diagnostiqueIndex || '',
      thérapeutiqueIndex: currentReport?.thérapeutiqueIndex || '',
      dateHD: currentReport?.dateHD || '',
      ippHD: currentReport?.ippHD || false,
      ippProtocolHD: currentReport?.ippProtocolHD || '',
      suspicionCirrhoseHD: currentReport?.suspicionCirrhoseHD || false,
      vasoactifHD: currentReport?.vasoactifHD || false,
      vasoactifDescHD: currentReport?.vasoactifDescHD || '',
      antibioprophylaxieHD: currentReport?.antibioprophylaxieHD || false,
      antibioprophylaxieDescHD: currentReport?.antibioprophylaxieDescHD || '',
      transfusionHD: currentReport?.transfusionHD || false,
      cgrHD: currentReport?.cgrHD || '',
      antibioprophylaxieJJA: currentReport?.antibioprophylaxieJJA || false,
      antibioprophylaxieDescJJA: currentReport?.antibioprophylaxieDescJJA || '',
      autresIndications: currentReport?.autresIndications || '',
      prémédicationIndication: currentReport?.prémédicationIndication || false,
      prémédicationIndicationDesc: currentReport?.prémédicationIndicationDesc || '',

      délaiExamen: currentReport?.délaiExamen || '',
      dateExamen: currentReport?.dateExamen || '',
      jeuneExamen: currentReport?.jeuneExamen || false,
      duréeJeuneSolide: currentReport?.duréeJeuneSolide || '',
      duréeJeuneLiquide: currentReport?.duréeJeuneLiquide || '',
      consoTabacAvantExamen: currentReport?.consoTabacAvantJeune || false,
      sédationExamen: currentReport?.sédationExamen || false,
      anomaliesAvantSédation: currentReport?.anomaliesAvantSédation || false,
      anomaliesAvantSédationDesc: currentReport?.anomaliesAvantSédationDesc || '',
      protocoleAvantSédation: currentReport?.protocoleAvantSédation || '',
      endoscope: currentReport?.endoscope || '',

      pince: currentReport?.pince || false,
      usagePince: currentReport?.usagePince || false,
      indexPince: currentReport?.indexPince || '',
      autresMateriels: currentReport?.autresMateriels || '',
      osophage: currentReport?.osophage || false,
      osophageDesc: currentReport?.osophageDesc || '',
      osoBiopsies: currentReport?.osoBiopsies || false,
      osoBiopsiesDesc: currentReport?.osoBiopsiesDesc || '',
      cardia: currentReport?.cardia || false,
      cardiaDesc: currentReport?.cardiaDesc || '',

      fundus: currentReport?.fundus || false,
      fundusDesc: currentReport?.fundusDesc || '',

      antre: currentReport?.antre || false,
      antreDesc: currentReport?.antreDesc || '',

      pylore: currentReport?.pylore || false,
      pyloreDesc: currentReport?.pyloreDesc || '',
      estoBiopsies: currentReport?.estoBiopsies || false,
      estoBiopsiesDesc: currentReport?.estoBiopsiesDesc || '',

      bulbe: currentReport?.bulbe || false,
      bulbeDesc: currentReport?.bulbeDesc || '',
      bulbeBiopsies: currentReport?.bulbeBiopsies || false,
      bulbeBiopsiesDesc: currentReport?.bulbeBiopsiesDesc || '',

      duodénum: currentReport?.duodénum || false,
      duodénumDesc: currentReport?.duodénumDesc || '',
      duodénumBiopsies: currentReport?.duodénumBiopsies || false,
      duodénumBiopsiesDesc: currentReport?.duodénumBiopsiesDesc || '',

      zoneMalExploré: currentReport?.zoneMalExploré || false,

      indexZoneMalExploré: currentReport?.indexZoneMalExploré || '',

      FOGDtotale: currentReport?.FOGDtotale || false,
      duréeExamen: currentReport?.duréeExamen || '',
      chromoendoscopie: currentReport?.chromoendoscopie || false,
      chromoendoscopieDesc: currentReport?.chromoendoscopieDesc || '',
      biopsies: currentReport?.biopsies || false,
      biopsiesDesc: currentReport?.biopsiesDesc || '',
      conclusion: currentReport?.conclusion || '',
      CAT: currentReport?.CAT || '',
      nomsOps: currentReport?.nomsOps || '',
      ressentiPatient: currentReport?.ressentiPatient || '',
      complicationSedation: currentReport?.complicationSedation || false,
      complicationSedationDesc: currentReport?.complicationSedationDesc || '',
      complicationEndo: currentReport?.complicationEndo || false,
      complicationEndoDesc: currentReport?.complicationEndoDesc || '',
      necessiteHospitalisation: currentReport?.necessiteHospitalisation || false
      // FOGDmaterials: currentReport?.FOGDmaterials || '',
      // FOGDEstomac: currentReport?.FOGDEstomac || 'Non',
      // FOGDoesophage: currentReport?.FOGDoesophage || '',
      // FOGDcardia: currentReport?.FOGDcardia || '',
      // FOGDsag: currentReport?.FOGDsag || 'Non',
      // FOGDDureExam: currentReport?.FOGDDureExam || 0,
      // FOGDBiopsie: currentReport?.FOGDBiopsie || false,
      // FOGDfundus: currentReport?.FOGDfundus || '',
      // FOGDantre: currentReport?.FOGDantre || '',
      // FOGDpyloreExplored: currentReport?.FOGDpylore || 'Non Exploré',
      // FOGDpylore: currentReport?.FOGDpylore || '',
      // FOGDdidii: currentReport?.FOGDdidii || '',
      // FOGDdidiiExplored: currentReport?.FOGDdidiiExplored || 'Non Exploré',
      // Coloscopiesag: currentReport?.Coloscopiesag || 'Non',
      // ColoscopieDureExam: currentReport?.ColoscopieDureExam || 0,
      // ColoscopieMaterials: currentReport?.ColoscopieMaterials || '',
      // ColoscopieColonGauche: currentReport?.ColoscopieColonGauche || '',
      // ColoscopieColonTansverse: currentReport?.ColoscopieColonTansverse || '',
      // ColoscopieColonDroit: currentReport?.ColoscopieColonDroit || '',
      // ColoscopiePreparation: currentReport?.ColoscopiePreparation || '',
      // ColoscopieIleon: currentReport?.ColoscopieIleon || '',
      // ColoscopieBasFondCaecal: currentReport?.ColoscopieBasFondCaecal || '',
      // ColoscopieColonGaucheText: currentReport?.ColoscopieColonGaucheText || '',
      // ColoscopieColonTansverseText: currentReport?.ColoscopieColonTansverseText || '',
      // ColoscopieColonDroitText: currentReport?.ColoscopieColonDroitText || '',
      // ColoscopieRectum: currentReport?.ColoscopieRectum || '',
      // ColoscopieIleonExplored: currentReport?.ColoscopieIleonExplored || '',
      // ColoscopieBasFondCaecalExplored: currentReport?.ColoscopieBasFondCaecalExplored || '',
      // ColoscopieColonGaucheTextExplored: currentReport?.ColoscopieColonGaucheTextExplored || '',
      // ColoscopieColonTansverseTextExplored: currentReport?.ColoscopieColonTansverseTextExplored || '',
      // ColoscopieColonDroitTextExplored: currentReport?.ColoscopieColonDroitTextExplored || '',
      // ColoscopieRectumExplored: currentReport?.ColoscopieRectumExplored || ''
    },
    // validationSchema: NewReportSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        fetch('http://localhost:5000/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
          .then((response) => response.json())
          .then((data) => {
            generatePDF(data);
          });
        // resetForm();
        setSubmitting(false);
        enqueueSnackbar('Report generated', { variant: 'success' });
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
              Retour
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

const generatePDF = (rapport) => {
  const {
    nom,
    prenom,
    age,
    numDoss,
    numTel
    // etab,
    // antecedents,
    // indications,
    // FOGDmaterials,
    // FOGDoesophage,
    // FOGDcardia,
    // FOGDEstomac,
    // FOGDBiopsie,
    // FOGDfundus,
    // FOGDantre,
    // FOGDpyloreExplored,
    // FOGDpylore,
    // FOGDdidii,
    // FOGDdidiiExplored,
    // ColoscopieMaterials,
    // ColoscopieColonGauche,
    // ColoscopieColonTansverse,
    // ColoscopieColonDroit,
    // ColoscopiePreparation,
    // ColoscopieIleon,
    // ColoscopieBasFondCaecal,
    // ColoscopieColonGaucheText,
    // ColoscopieColonTansverseText,
    // ColoscopieColonDroitText,
    // ColoscopieRectum,
    // ColoscopieIleonExplored,
    // ColoscopieBasFondCaecalExplored,
    // ColoscopieColonGaucheTextExplored,
    // ColoscopieColonTansverseTextExplored,
    // ColoscopieColonDroitTextExplored,
    // ColoscopieRectumExplored,
    // conclusion,
    // _id,
    // createdAt
  } = rapport;
  // Create the document
  const pageWidth = 210; // 210mm
  const pageHeight = 297; // 297mm

  // Create the document
  const doc = new jsPDF({
    unit: 'mm',
    format: [pageWidth, pageHeight]
  });
  // Set the font and text size
  doc.setFont('helvetica');
  doc.setFontSize(12);
  doc.setFontStyle('bold');
  doc.text(`Compte Rendu d'examen endoscopique`, pageWidth / 2, 20, {
    align: 'center'
  });
  let x = 10;
  // Add the hospital name to the top left corner
  doc.text('Rapport Medical', 10, x, { align: 'left', fontStyle: 'bold' });

  // Add the doctor name to the top right corner
  // doc.text(etab, 190, x, { align: 'right' });
  doc.setFontStyle('normal');

  // Add patient information
  doc.text(`Patient : ${nom} ${prenom}`, 14, (x += 40), { maxWidth: 190 });
  doc.text(`Age: ${age} ans`, 14, (x += 10), { maxWidth: 190 });
  doc.text(`Numero de telephone : ${numTel}`, 14, (x += 10), { maxWidth: 190 });
  doc.text(`Numero de dossier : ${numDoss}`, 14, (x += 10), { maxWidth: 190 });
  // doc.text(`Antecedents: ${antecedents}`, 14, (x += 10), { maxWidth: 190 });
  // doc.text(`Indications: ${indications}`, 14, (x += 10), { maxWidth: 190 });
  // doc.line(20, (x += 10), 180, x);
  // if (FOGDmaterials !== '' || FOGDoesophage !== '') {
  //   doc.setFontStyle('bold');
  //   doc.text("Type d'examen endoscopique: FOGD", pageWidth / 2, (x += 10), {
  //     align: 'center'
  //   });
  //   doc.setFontStyle('normal');

  //   // doc.text('sous anesthesie generale: lorem ipsum', 14, (x += 10)); ToDo
  //   // doc.text('heure de debut: 1/6/2023 20:38', 14, (x += 10), { align: 'left' });
  //   // doc.text("durée de l'examen: 60 minutes", 190, x, { align: 'right' });

  //   const materials = FOGDmaterials.split('\n');
  //   doc.text(`material: ${materials[0]}`, 14, (x += 10));
  //   for (let i = 1; i < materials.length; i += 1) doc.text(`${materials[i]}`, 32, (x += 5));

  //   doc.text(`Oesophage: ${FOGDoesophage}`, 14, (x += 10), { maxWidth: 190 });
  //   doc.text(`Cardia: ${FOGDcardia}`, 14, (x += 10), { maxWidth: 190 });
  //   doc.text(`Estomac: ${FOGDEstomac === 'Exploré' ? 'Exploré' : 'Non Exploré'}`, 14, (x += 10));

  //   if (FOGDEstomac === 'Exploré') {
  //     doc.text(`Fundus: ${FOGDfundus}`, 20, (x += 10), { maxWidth: 190 });
  //     doc.text(`Antre: ${FOGDantre}`, 20, (x += 10), { maxWidth: 190 });
  //     doc.text(`Biopsie: ${FOGDBiopsie === true ? 'Oui' : 'Non'}`, 20, (x += 10));
  //   }

  //   doc.text(`Pylore: ${FOGDpyloreExplored === 'Exploré' ? 'Exploré' : 'Non Exploré'}`, 14, (x += 10));

  //   if (FOGDpyloreExplored === 'Exploré') {
  //     doc.text(FOGDpylore, 20, (x += 10), { maxWidth: 190 });
  //   }

  //   doc.text(`DIDII: ${FOGDdidiiExplored === 'Exploré' ? 'Exploré' : 'Non Exploré'}`, 14, (x += 10));

  //   if (FOGDdidiiExplored === 'Exploré') {
  //     doc.text(FOGDdidii, 20, (x += 10), { maxWidth: 190 });
  //   }
  // }

  // if (ColoscopieMaterials !== '') {
  //   x = 15;
  //   doc.addPage();
  //   doc.line(20, (x += 10), 180, x);
  //   doc.setFontStyle('bold');
  //   doc.text("Type d'examen endoscopique: Coloscopie", pageWidth / 2, (x += 10), {
  //     align: 'center'
  //   });
  //   doc.setFontStyle('normal');

  //   // doc.text('sous anesthesie generale: lorem ipsum', 14, (x += 10)); ToDo
  //   // doc.text('heure de debut: 1/6/2023 20:38', 14, (x += 10), { align: 'left' });
  //   // doc.text("durée de l'examen: 60 minutes", 190, x, { align: 'right' });

  //   const materials = ColoscopieMaterials.split(',');
  //   doc.text(`material: ${materials[0]}`, 14, (x += 10));
  //   for (let i = 1; i < materials.length; i += 1) doc.text(`${materials[i]}`, 32, (x += 5));

  //   doc.text(`BOSTON:`, 14, (x += 10));
  //   doc.text(`Colon Gauche: ${ColoscopieColonGauche}`, 20, (x += 10), { maxWidth: 190 });
  //   doc.text(`Colon Tansverse: ${ColoscopieColonTansverse}`, 20, (x += 10), { maxWidth: 190 });
  //   doc.text(`Colon Droit: ${ColoscopieColonDroit}`, 20, (x += 10), { maxWidth: 190 });
  //   doc.text(`Preparation: ${ColoscopiePreparation}`, 20, (x += 10), { maxWidth: 190 });

  //   doc.text(`Ileon: ${ColoscopieIleonExplored === 'Exploré' ? 'Exploré' : 'Non Exploré'}`, 14, (x += 10));
  //   if (ColoscopieIleonExplored === 'Exploré') {
  //     doc.text(ColoscopieIleon, 20, (x += 10), { maxWidth: 190 });
  //   }

  //   doc.text(
  //     `Bas fond caecal: ${ColoscopieBasFondCaecalExplored === 'Exploré' ? 'Exploré' : 'Non Exploré'}`,
  //     14,
  //     (x += 10)
  //   );
  //   if (ColoscopieBasFondCaecalExplored === 'Exploré') {
  //     doc.text(ColoscopieBasFondCaecal, 20, (x += 10), { maxWidth: 190 });
  //   }
  // }

  // doc.text(`Colon droit: ${ColoscopieColonDroitTextExplored === 'Exploré' ? 'Exploré' : 'Non Exploré'}`, 14, (x += 10));
  // if (ColoscopieColonDroitTextExplored === 'Exploré') {
  //   doc.text(ColoscopieColonDroitText, 20, (x += 10), { maxWidth: 190 });
  // }

  // doc.text(
  //   `Colon gauche: ${ColoscopieColonGaucheTextExplored === 'Exploré' ? 'Exploré' : 'Non Exploré'}`,
  //   14,
  //   (x += 10)
  // );
  // if (ColoscopieColonGaucheTextExplored === 'Exploré') {
  //   doc.text(ColoscopieColonGaucheText, 20, (x += 10), { maxWidth: 190 });
  // }

  // doc.text(
  //   `Colon Transverse: ${ColoscopieColonTansverseTextExplored === 'Exploré' ? 'Exploré' : 'Non Exploré'}`,
  //   14,
  //   (x += 10)
  // );
  // if (ColoscopieColonTansverseTextExplored === 'Exploré') {
  //   doc.text(ColoscopieColonTansverseText, 20, (x += 10), { maxWidth: 190 });
  // }

  // doc.text(`Rectum: ${ColoscopieColonTansverseTextExplored === 'Exploré' ? 'Exploré' : 'Non Exploré'}`, 14, (x += 10));
  // if (ColoscopieColonTansverseTextExplored === 'Exploré') {
  //   doc.text(ColoscopieColonTansverseText, 20, (x += 10), { maxWidth: 190 });
  // }

  // // Add a section for the conclusion
  // doc.text(`Conclusion: ${conclusion}`, 14, (x += 10), { maxWidth: 185 });

  // Save the PDF
  doc.save(`medical-report-${numDoss}.pdf`);
};
