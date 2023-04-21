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
import * as fs from 'fs';
import PersonIcon from '@mui/icons-material/Person';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import BiotechIcon from '@mui/icons-material/Biotech';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  AlignmentType,
  Border,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  SectionType,
  TextRun
} from 'docx';
import { saveAs } from 'file-saver';
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
      // antecedentsFam: currentReport?.antecedentsFam || '',
      // antecedentsPerso: currentReport?.antecedentsPerso || '',
      // descAntecedentFam: currentReport?.descAntecedentFam || '',
      // descAntecedentPerso: currentReport?.descAntecedentPerso || '',
      // nombrePacketTabac: currentReport?.nombrePacketTabac || '',
      // consoAlcool: currentReport?.consoAlcool || false,
      // autresHabitudes: currentReport?.autresHabitudes || '',
      antiThrombotique: currentReport?.antiThrombotique || false,
      antiCoagulantsClasse: currentReport?.antiCoagulantsClasse || [],
      // antiCoagulantsDose: currentReport?.antiCoagulantsDose || '',
      // antiCoagulantsNb: currentReport?.antiCoagulantsNb || '',
      // antiCoagulantsGestionDebut: currentReport?.antiCoagulantsGestionDebut || '',
      // antiCoagulantsGestionFin: currentReport?.antiCoagulantsGestionFin || '',
      antiCoagulantsGestion: currentReport?.antiCoagulantsGestion || '',
      autresTraitements: currentReport?.autresTraitements || '',
      typeIndication: currentReport?.typeIndication || false,
      diagnostiqueIndex: currentReport?.diagnostiqueIndex || '',
      thérapeutiqueIndex: currentReport?.thérapeutiqueIndex || '',
      // dateHD: currentReport?.dateHD || '',
      ippHD: currentReport?.ippHD || false,
      ippProtocolHD: currentReport?.ippProtocolHD || '',
      suspicionCirrhoseHD: currentReport?.suspicionCirrhoseHD || false,
      vasoactifHD: currentReport?.vasoactifHD || false,
      vasoactifDescHD: currentReport?.vasoactifDescHD || '',
      antibioprophylaxieHD: currentReport?.antibioprophylaxieHD || false,
      antibioprophylaxieDescHD: currentReport?.antibioprophylaxieDescHD || '',
      // transfusionHD: currentReport?.transfusionHD || false,
      // cgrHD: currentReport?.cgrHD || '',
      antibioprophylaxieJJA: currentReport?.antibioprophylaxieJJA || false,
      antibioprophylaxieDescJJA: currentReport?.antibioprophylaxieDescJJA || '',
      autresIndications: currentReport?.autresIndications || '',
      prémédicationIndication: currentReport?.prémédicationIndication || false,
      prémédicationIndicationDesc: currentReport?.prémédicationIndicationDesc || '',

      examenPhysiqueInterrogatoire: currentReport?.examenPhysiqueInterrogatoire || false,
      délaiExamen: currentReport?.délaiExamen || '',
      dateExamen: currentReport?.dateExamen || '',
      jeuneExamen: currentReport?.jeuneExamen || false,
      // duréeJeuneSolide: currentReport?.duréeJeuneSolide || '',
      // duréeJeuneLiquide: currentReport?.duréeJeuneLiquide || '',
      consoTabacAvantExamen: currentReport?.consoTabacAvantJeune || false,
      sédationExamen: currentReport?.sédationExamen || false,
      anomaliesAvantSédation: currentReport?.anomaliesAvantSédation || false,
      anomaliesAvantSédationDesc: currentReport?.anomaliesAvantSédationDesc || '',
      protocoleAvantSédation: currentReport?.protocoleAvantSédation || '',
      endoscope: currentReport?.endoscope || '',

      // pince: currentReport?.pince || false,
      // usagePince: currentReport?.usagePince || false,
      // indexPince: currentReport?.indexPince || '',
      autresMateriels: currentReport?.autresMateriels || '',
      osophage: currentReport?.osophage || false,
      osophageDesc: currentReport?.osophageDesc || '',
      osoBiopsies: currentReport?.osoBiopsies || false,
      osoBiopsiesDesc: currentReport?.osoBiopsiesDesc || '',
      osoConclusion: currentReport?.osoConclusion || '',
      cardia: currentReport?.cardia || false,
      cardiaDesc: currentReport?.cardiaDesc || '',
      cardiaConclusion: currentReport?.cardiaConclusion || '',
      // estomac: currentReport?.estomac || '',
      lacMuqueux: currentReport?.lacMuqueux || '',
      lacMuqueuxDesc: currentReport?.lacMuqueuxDesc || '',
      fundus: currentReport?.fundus || false,
      fundusDesc: currentReport?.fundusDesc || '',
      fundusConclusion: currentReport?.fundusConclusion || '',
      antre: currentReport?.antre || false,
      antreDesc: currentReport?.antreDesc || '',

      pylore: currentReport?.pylore || false,
      pyloreDesc: currentReport?.pyloreDesc || '',
      pyloreConclusion: currentReport?.pyloreConclusion || '',
      // estoBiopsies: currentReport?.estoBiopsies || false,
      // estoBiopsiesDesc: currentReport?.estoBiopsiesDesc || '',

      bulbe: currentReport?.bulbe || false,
      bulbeDesc: currentReport?.bulbeDesc || '',
      bulbeBiopsies: currentReport?.bulbeBiopsies || false,
      bulbeBiopsiesDesc: currentReport?.bulbeBiopsiesDesc || '',
      bulbeConclusion: currentReport?.bulbeConclusion || '',

      duodénum: currentReport?.duodénum || false,
      duodénumDesc: currentReport?.duodénumDesc || '',
      duodénumBiopsies: currentReport?.duodénumBiopsies || false,
      duodénumBiopsiesDesc: currentReport?.duodénumBiopsiesDesc || '',
      duodénumConclusion: currentReport?.duodénumConclusion || '',

      zoneMalExploré: currentReport?.zoneMalExploré || false,

      indexZoneMalExploré: currentReport?.indexZoneMalExploré || '',

      FOGDtotale: currentReport?.FOGDtotale || false,
      duréeExamen: currentReport?.duréeExamen || '',
      qvFundus: currentReport?.qvFundus || '',
      qvPartieSup: currentReport?.qvPartieSup || '',
      qvPartieInf: currentReport?.qvPartieInf || '',
      qvAntre: currentReport?.qvAntre || '',
      chromoendoscopie: currentReport?.chromoendoscopie || false,
      chromoendoscopieDesc: currentReport?.chromoendoscopieDesc || '',
      biopsies: currentReport?.biopsies || false,
      biopsiesDesc: currentReport?.biopsiesDesc || '',
      conclusion: currentReport?.conclusion || '',
      CAT: currentReport?.CAT || '',
      seniors: currentReport?.seniors || '',
      residents: currentReport?.residents || '',
      techniciens: currentReport?.techniciens || '',
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
        console.log('VALUES', values);
        console.log({ thérapeutiqueIndex: values.thérapeutiqueIndex });
        const doc = new Document({
          creator: 'CREEIS',
          description: 'Compte rendu de fibroscopie oeso-gastro-duodénale ',
          title: 'CREEIS',
          properties: {
            type: SectionType.CONTINUOUS
          },
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  children: [createText('CHU Monji Slim la marsa'), createTextOnNewLine('Unité d’endoscopie')],
                  heading: HeadingLevel.HEADING_3
                }),
                new Paragraph({
                  children: [
                    createBreak(),
                    createBreak(),
                    new TextRun({
                      text: 'Compte rendu de fibroscopie oeso-gastro-duodénale',
                      bold: true,
                      color: '#000000'
                    }),
                    createBreak(),
                    createBreak()
                  ],
                  alignment: AlignmentType.CENTER,
                  heading: HeadingLevel.HEADING_1,
                  break: 2
                }),
                new Paragraph({
                  children: [
                    createBoldText('Nom: '),
                    createText(values.nom),
                    createBoldText('\t\t\tPrénom: '),
                    createText(values.prenom),
                    createBoldText('\t\t\tAge: '),
                    createText(values.age),
                    createBoldTextOnNewLine("Service d'origine: "),
                    createText(values.serviceOrigine),
                    createBoldText('\t\t\tNuméro de téléphone: '),
                    createText(values.numTel),
                    createBoldTextOnNewLine('Numéro de dossier médical: '),
                    createText(values.numDoss),
                    createBoldTextOnNewLine("Date de l'examen: "),
                    createText(values.dateExamen ?? ''),
                    createBoldText("\t\t\tDurée l'examen: "),
                    createText(values.duréeExamen ?? ''),
                    createBoldTextOnNewLine('Traitements en cours: '),
                    ...getAntiCoagulant(),
                    ...getIndications(),
                    ...getHemoDigestive(),
                    ...getJJA(),
                    ...getConsentementPatient(),
                    ...getPrémédicationIndication(),
                    ...getPatientaJeune(),
                    ...getProtocolSédation(),
                    ...getMaterial()
                  ],
                  border: {
                    bottom: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 1 },
                    top: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 1 },
                    left: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 1 },
                    right: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 1 }
                  }
                }),
                new Paragraph({
                  children: [createBoldTextOnNewLine('Examen: ')],
                  heading: HeadingLevel.HEADING_3,
                  break: 1
                }),

                new Paragraph({
                  children: [
                    ...getOesophage(),
                    ...getCardia(),
                    ...getEstomac(),
                    ...getFundus(),
                    ...getAntre(),
                    ...getPylore(),
                    ...getBulbe(),
                    ...getDuodénum()
                  ]
                })
              ]
            }
          ]
        });

        // Used to export the file into a .docx file
        // Packer.toBuffer(doc).then((buffer) => {
        //   //fs.writeFileSync('My Document.docx', buffer);
        // });
        // const buffer = await Packer.toBuffer(doc);
        // const blob = new Blob([buffer], {
        //   type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        // });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, 'CREEIS.docx');

        const bodyValues = values;
        delete bodyValues.cardiaConclusion;
        delete bodyValues.osoConclusion;
        delete bodyValues.duodénumConclusion;
        delete bodyValues.fundusConclusion;
        delete bodyValues.pyloreConclusion;
        delete bodyValues.bulbeConclusion;
        // fetch('http://localhost:5000/api/reports', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(bodyValues)
        // })
        //   .then((response) => response.json())
        //   .then(async (data) => {
        //     console.log('data', data);

        //     // generatePDF(data);
        //   });
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

  const createText = (text) =>
    new TextRun({
      text,
      color: '#000000'
    });

  const createTextOnNewLine = (text) =>
    new TextRun({
      text,
      color: '#000000',
      break: 1
    });

  const createBoldText = (text) =>
    new TextRun({
      text,
      color: '#000000',
      bold: true
    });
  const createBreak = () =>
    new TextRun({
      text: '',
      break: 1
    });

  const createBoldTextOnNewLine = (text) =>
    new TextRun({
      text,
      color: '#000000',
      break: 1,
      bold: true
    });

  const getAntiCoagulant = () => {
    console.log('antiThrombotique', values.antiThrombotique);
    console.log('antiCoagulantsClasse', values.antiCoagulantsClasse);
    if (values.antiThrombotique && values.antiCoagulantsClasse.length > 0) {
      const classeString = values.antiCoagulantsClasse.join(', ');
      console.log('classeString', classeString);
      return [
        createBoldTextOnNewLine('\tAnti thrombotique: '),
        createText(classeString),
        createBoldTextOnNewLine('\tGestion des anticoagulants: '),
        createText(values.antiCoagulantsGestion ?? '')
      ];
    }
    return [createBoldTextOnNewLine('\tAnti thrombotique: '), createText('Non')];
  };
  function getIndications() {
    if (values.thérapeutiqueIndex !== '' || values.diagnostiqueIndex !== '')
      return [
        createBoldTextOnNewLine(
          `Indications: ${values.typeIndication ? 'FOGD Thérapeutique: ' : 'FOGD Diagnostique: '}`
        ),
        createText(
          `${
            values.typeIndication
              ? FGDOthérapeutique[values.thérapeutiqueIndex] ?? "Pas d'indications"
              : FGDOdiagnostique[values.diagnostiqueIndex] ?? "Pas d'indications"
          }`
        )
      ];
    return [createBoldTextOnNewLine("Pas d'indications")];
  }
  const getHemoDigestive = () => {
    console.log('typeIndication', values.typeIndication);
    console.log('thérapeutiqueIndex', values.thérapeutiqueIndex);
    if (values.typeIndication && values.thérapeutiqueIndex === '0') {
      return [getIPP(), getSuspicion(), getVasoactif(), getAntibioprophylaxie()];
    }
    return [];
  };
  const getIPP = () => {
    if (values.ippHD) return [createBoldText('IPP: '), createText(values.ippProtocolHD)];
    return [createBoldText('IPP: '), createText('Non')];
  };
  const getSuspicion = () => {
    if (values.suspicionCirrhoseHD)
      return [createBoldTextOnNewLine('Suspicion d’hémorragie par hypertension portale: '), createText('Oui')];
    return [createBoldTextOnNewLine('Suspicion d’hémorragie par hypertension portale: '), createText('Non')];
  };
  const getVasoactif = () => {
    if (values.vasoactifHD)
      return [createBoldTextOnNewLine('Traitement vasoactif: '), createText(values.vasoactifDescHD)];
    return [createBoldTextOnNewLine('Traitement vasoactif: '), createText('Non')];
  };

  const getAntibioprophylaxie = () => {
    if (values.antibioprophylaxieHD)
      return [createBoldTextOnNewLine('Antibioprophylaxie: '), createText(values.antibioprophylaxieDescHD)];
    return [createBoldTextOnNewLine('Antibioprophylaxie: '), createText('Non')];
  };

  const getJJA = () => {
    if (values.typeIndication && values.thérapeutiqueIndex === '6' && values.antibioprophylaxieJJA)
      return [
        createBoldTextOnNewLine('Sonde de gastrostomie/jéjunostomie d’alimentation : '),
        createBoldText('Antibioprophylaxie: '),
        createText(values.antibioprophylaxieDescJJA)
      ];
    return [];
  };
  const getConsentementPatient = () => {
    if (values.consentement)
      return [createBoldTextOnNewLine('Consentement éclairé signé par le patient: '), createText('Oui')];
    return [createBoldTextOnNewLine('Consentement éclairé signé par le patient: '), createText('Non')];
  };
  const getPrémédicationIndication = () => {
    if (values.prémédicationIndication)
      return [createBoldTextOnNewLine('Pré médication: '), createText(values.prémédicationIndicationDesc)];
    return [createBoldTextOnNewLine('Pré médication: '), createText('Non')];
  };
  const getPatientaJeune = () => {
    console.log('jeuneExamen', values.jeuneExamen);
    if (values.jeuneExamen) return [createBoldTextOnNewLine('Patient à jeûne: '), createText('Oui')];
    return [createBoldTextOnNewLine('Patient à jeûne: '), createText('Non')];
  };

  const getProtocolSédation = () => {
    if (values.sédationExamen)
      return [createBoldTextOnNewLine('Sous sédation: '), createText(values.protocoleAvantSédation)];
    return [createBoldTextOnNewLine('Sous sédation: '), createText('Non')];
  };
  const getMaterial = () => {
    console.log('autresMateriels', values?.autresMateriels);
    const materialString = values?.autresMateriels ? values.autresMateriels.join(', ') : '';
    return [
      createBoldTextOnNewLine('Matériel: '),
      createBoldTextOnNewLine('\tEndoscope: '),
      createText(values.endoscope),
      createBoldTextOnNewLine('\tAutres: '),
      createText(materialString)
    ];
  };
  const getOesophage = () => [
    createBoldTextOnNewLine('Œsophage: '),
    createText(values.osophage ? 'Exploré: ' : 'Non exploré'),
    createText(values.osophage ? values.osophageDesc ?? '' : ''),
    values.osoBiopsies ? createBoldTextOnNewLine('Biopsises Œsophage: ') : createText(''),
    createText(values.osoBiopsies ? values.osoBiopsiesDesc ?? '' : '')
  ];
  const getCardia = () => [
    createBoldTextOnNewLine('Cardia: '),
    createText(values.cardia ? 'Exploré: ' : 'Non exploré'),
    createText(values.cardia ? values.cardiaDesc ?? '' : '')
  ];
  const getEstomac = () => [
    createBoldTextOnNewLine('Estomac: '),
    createText(values.lacMuqueux ?? ''),
    createText(values.lacMuqueux !== '' && values.lacMuqueuxDesc !== '' ? ', ' : 'Pas de description'),
    createText(values.lacMuqueuxDesc ?? '')
  ];
  const getFundus = () => [
    createBoldTextOnNewLine('Fundus: '),
    createText(values.fundus ? 'Exploré: ' : 'Non exploré'),
    createText(values.fundus ? values.fundusDesc ?? '' : '')
  ];
  const getAntre = () => [
    createBoldTextOnNewLine('Antre: '),
    createText(values.antre ? 'Exploré: ' : 'Non exploré'),
    createText(values.antre ? values.antreDesc ?? '' : '')
  ];
  const getPylore = () => [
    createBoldTextOnNewLine('Pylore: '),
    createText(values.pylore ? 'Exploré: ' : 'Non exploré'),
    createText(values.pylore ? values.pyloreDesc ?? '' : '')
  ];
  const getBulbe = () => [
    createBoldTextOnNewLine('Bulbe: '),
    createText(values.bulbe ? 'Exploré: ' : 'Non exploré'),
    createText(values.bulbe ? values.bulbeDesc ?? '' : ''),
    values.bulbeBiopsies ? createBoldTextOnNewLine('Biopsises Bulbe: ') : createText(''),
    createText(values.bulbeBiopsies ? values.bulbeBiopsiesDesc ?? '' : '')
  ];

  const getDuodénum = () => [
    createBoldTextOnNewLine('Duodénum: '),
    createText(values.duodénum ? 'Exploré: ' : 'Non exploré'),
    createText(values.duodénum ? values.duodénumDesc ?? '' : ''),
    values.duodénumBiopsies ? createBoldTextOnNewLine('Biopsises Duodénum: ') : createText(''),
    createText(values.duodénumBiopsies ? values.duodénumBiopsiesDesc ?? '' : '')
  ];

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

const FGDOdiagnostique = [
  'Symptômes digestifs hauts persistants malgré une épreuve thérapeutique',
  'Symptômes digestifs hauts avec signes d’alarmes ou âge >45ans',
  'Dysphagie, odynophagie',
  'RGO persistant ou récidivant après traitement',
  'Surveillance d’une lésion prénéoplasique (exp : endobrachy œsophage)',
  'Vomissements persistants',
  'Pathologies au cours desquelles la FOGD peut modifier la prise en charge (exemple : ATCDs d’ulcère et indication d’une anticoagulation)',
  'Polypose adénomateuse familiale',
  'Explorer une lésion de découverte radiologique (lésion d’allure néoplasique, ulcère œsophagien ou gastrique, sténose)',
  'Suspicion d’une spoliation sanguine et anémie ferriprive',
  'Nécessité de faire des biopsies ou de prélever un liquide',
  'Bilan d’une hypertension portale',
  'Evaluation d’une reconstruction anatomique (Exp : fundoplicature, chirurgie bariatrique)'
];

const FGDOthérapeutique = [
  'Hémorragie digestive active actuelle ou récente',
  'Traitement d’une lésion qui saigne',
  'Ligature ou sclérothérapie pour varices œsophagiennes',
  'Ingestion de caustique',
  'Extraction de corps étranger',
  'Résection d’un polype',
  'Mise en place d’un drainage ou d’une stomie (exp : gastrostomie)',
  'Dilatation d’une sténose',
  'Prise en charge d’une achalasie',
  'Prise en charge palliative d’une sténose d’origine néoplasique',
  'Traitement d’une métaplasie intestinale',
  'Prise en charge de complications (exp : fistule)'
];
