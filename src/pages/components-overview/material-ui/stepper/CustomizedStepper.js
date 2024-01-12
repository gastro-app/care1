/* eslint-disable */
import PropTypes, { array } from 'prop-types';
import React, { useState, useCallback } from 'react';
/* eslint-disable react/button-has-type */
/* eslint-disable new-cap */
import jsPDF from 'jspdf';
// material
import { styled } from '@mui/material/styles';
import { isArray } from 'lodash';
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
  ImageRun,
  Packer,
  Paragraph,
  SectionType,
  TextRun,
  UnderlineType
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
      antiCoagulantsClasseDesc: currentReport?.antiCoagulantsClasseDesc || '',
      // antiCoagulantsDose: currentReport?.antiCoagulantsDose || '',
      // antiCoagulantsNb: currentReport?.antiCoagulantsNb || '',
      // antiCoagulantsGestionDebut: currentReport?.antiCoagulantsGestionDebut || '',
      // antiCoagulantsGestionFin: currentReport?.antiCoagulantsGestionFin || '',
      antiCoagulantsGestion: currentReport?.antiCoagulantsGestion || '',
      autresTraitements: currentReport?.autresTraitements || '',
      typeIndication: currentReport?.typeIndication || false,
      diagnostiqueIndex: currentReport?.diagnostiqueIndex || [],
      thérapeutiqueIndex: currentReport?.thérapeutiqueIndex || [],
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

      surveillanceLesionDesc: currentReport?.surveillanceLesionDesc || '',
      prémédicationIndication: currentReport?.prémédicationIndication || false,
      // prémédicationIndicationDesc: currentReport?.prémédicationIndicationDesc || '',
      secondTime: currentReport?.secondTime || '',
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
      autresMaterielsDesc: currentReport?.autresMaterielsDesc || '',
      osophage: currentReport?.osophage || false,
      osophageDesc: currentReport?.osophageDesc || '',
      osoBiopsies: currentReport?.osoBiopsies || false,
      osoBiopsiesDesc: currentReport?.osoBiopsiesDesc || '',
      osoNormal: currentReport?.osoNormal || false,
      osoConclusion: currentReport?.osoConclusion || '',
      cardia: currentReport?.cardia || false,
      cardiaNormal: currentReport?.cardiaNormal || false,
      cardiaDesc: currentReport?.cardiaDesc || '',
      cardiaConclusion: currentReport?.cardiaConclusion || '',
      // estomac: currentReport?.estomac || '',
      lacMuqueux: currentReport?.lacMuqueux || '',
      lacMuqueuxDesc: currentReport?.lacMuqueuxDesc || '',
      fundus: currentReport?.fundus || false,
      fundusNormal: currentReport?.fundusNormal || false,
      fundusDesc: currentReport?.fundusDesc || '',
      fundusConclusion: currentReport?.fundusConclusion || '',
      antre: currentReport?.antre || false,
      antreNormal: currentReport?.antreNormal || false,
      antreDesc: currentReport?.antreDesc || '',
      estoBiopsies: currentReport?.estoBiopsies || false,
      estoBiopsiesDesc: currentReport?.estoBiopsiesDesc || '',
      pylore: currentReport?.pylore || false,
      pyloreNormal: currentReport?.pyloreNormal || false,
      pyloreDesc: currentReport?.pyloreDesc || '',
      antreConclusion: currentReport?.antreConclusion || '',
      // estoBiopsies: currentReport?.estoBiopsies || false,
      // estoBiopsiesDesc: currentReport?.estoBiopsiesDesc || '',
      bulbe: currentReport?.bulbe || false,
      bulbeNormal: currentReport?.bulbeNormal || false,
      bulbeDesc: currentReport?.bulbeDesc || '',
      bulbeBiopsies: currentReport?.bulbeBiopsies || false,
      bulbeBiopsiesDesc: currentReport?.bulbeBiopsiesDesc || '',
      bulbeConclusion: currentReport?.bulbeConclusion || '',

      duodénum: currentReport?.duodénum || false,
      duodénumNormal: currentReport?.duodénumNormal || false,
      duodénumDesc: currentReport?.duodénumDesc || '',
      duodénumBiopsies: currentReport?.duodénumBiopsies || false,
      duodénumBiopsiesDesc: currentReport?.duodénumBiopsiesDesc || '',
      duodénumConclusion: currentReport?.duodénumConclusion || '',

      zoneMalExploré: currentReport?.zoneMalExploré || false,
      indexZoneExploré: currentReport?.indexZoneExploré || '',
      indexZoneMalExploré: currentReport?.indexZoneMalExploré || '',

      images: currentReport?.images || '',
      FOGDtotale: currentReport?.FOGDtotale || false,
      duréeExamen: currentReport?.duréeExamen || '',
      qvFundus: currentReport?.qvFundus || '',
      qvPartieSup: currentReport?.qvPartieSup || '',
      qvPartieInf: currentReport?.qvPartieInf || '',
      qvAntre: currentReport?.qvAntre || '',
      qualityVisualisation: currentReport?.qualityVisualisation || '',
      chromoendoscopie: currentReport?.chromoendoscopie || false,
      chromoendoscopieDesc: currentReport?.chromoendoscopieDesc || '',
      biopsies: currentReport?.biopsies || false,
      biopsiesDesc: currentReport?.biopsiesDesc || '',
      conclusion: currentReport?.conclusion || '',
      CAT: currentReport?.CAT || '',
      seniors: currentReport?.seniors || [],
      residents: currentReport?.residents || [],
      //techniciens: currentReport?.techniciens || [],
      autreSeniors: currentReport?.autreSeniors || '',
      autreResidents: currentReport?.autreResidents || '',
      ressentiPatient: currentReport?.ressentiPatient || false,
      complicationSedation: currentReport?.complicationSedation || false,
      complicationSedationDesc: currentReport?.complicationSedationDesc || '',
      complicationEndo: currentReport?.complicationEndo || false,
      complicationEndoDesc: currentReport?.complicationEndoDesc || '',
      necessiteHospitalisation: currentReport?.necessiteHospitalisation || false
    },
    // validationSchema: NewReportSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        console.log('VALUES', values);
        console.log({ thérapeutiqueIndex: values.thérapeutiqueIndex });
        // const imageBlobs = [];
        // if (isArray(values.images)) {
        //   values.images.forEach((img) => {
        //     //   const imageBlob = await fetch(
        //     //     'https://raw.githubusercontent.com/dolanmiu/docx/master/demo/images/cat.jpg'
        //     //   ).then((r) => r.blob());

        //   });
        // }
        // const blobb = await fetch('https://raw.githubusercontent.com/dolanmiu/docx/master/demo/images/cat.jpg').then(
        //   (r) => r.blob()
        // );
        // console.log('blob', blobb);
        const images = [];
        if (values?.images?.length && values.images.length > 0) {
          for (let index = 0; index < values.images.length; index += 1) {
            /* eslint-disable no-await-in-loop */
            const iblob = await (await fetch(values.images[index])).blob();
            console.log('iblob', iblob);
            if (iblob) {
              console.log('first');
              images.push(createTextOnNewLine(`Image ${index + 1}:`));
              images.push(createBreak());
              images.push(
                new ImageRun({
                  data: iblob,
                  transformation: {
                    width: 300,
                    height: 300
                  }
                })
              );
              images.push(createBreak());
            }
          }
        }
        const doc = new Document({
          creator: 'Care1',
          description: 'Compte rendu de fibroscopie oeso-gastro-duodénale ',
          title: 'Care1',
          properties: {
            type: SectionType.CONTINUOUS
          },
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  children: [createText('CHU Mongi Slim la marsa'), createTextOnNewLine('Unité d’endoscopie')],
                  heading: HeadingLevel.HEADING_3
                }),
                new Paragraph({
                  children: [
                    createBreak(),
                    new TextRun({
                      text: 'Compte rendu de fibroscopie oeso-gastro-duodénale',
                      bold: true,
                      color: '#000000'
                    })
                  ],
                  alignment: AlignmentType.CENTER,
                  heading: HeadingLevel.HEADING_1,
                  break: 1
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
                    createBoldText(values.numTel !== '' ? '\tNuméro de téléphone: ' : ''),
                    createText(values.numTel),
                    createBoldTextOnNewLine('Numéro de dossier médical: '),
                    createText(values.numDoss),
                    createBoldTextOnNewLine("Date de l'examen: "),
                    createText(values.dateExamen ?? ''),
                    createBoldText("\t\t\tDurée l'examen: "),
                    createText(values.duréeExamen ?? ''),
                    createBoldTextOnNewLine('Traitements en cours: '),
                    ...getAntiCoagulant(),
                    ...getAutreTraitement(),
                    ...getIndications(),
                    ...getHemoDigestive(),
                    ...getJJA(),
                    ...getSurveillance(),
                    ...getConsentementPatient(),

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
                  children: [createUnderlinedBoldTextOnNewLine('Examen: ')],
                  heading: HeadingLevel.HEADING_3
                  // break: 1
                }),

                new Paragraph({
                  children: [
                    ...getOesophage(),
                    ...getCardia(),
                    ...getEstomac(),
                    ...getFundus(),
                    ...getAntre(),
                    ...getPylore(),
                    ...getBiopsiesEsto(),
                    ...getBulbe(),
                    ...getDuodénum(),
                    ...getSecondTime()
                  ]
                }),
                new Paragraph({
                  children: [createUnderlinedBoldTextOnNewLine('Conclusion: '), createBreak()],
                  heading: HeadingLevel.HEADING_3
                  // break: 1
                }),
                getPart1(),
                getPart2(),
                getPart3(),
                new Paragraph({
                  children: [
                    values?.images?.length > 0 ? createBoldTextOnNewLine('Photo documentations:') : createText(''),
                    ...images
                    // isArray(values.images)
                    //   ? values.images.map(
                    //       (img) =>
                    //         new ImageRun({
                    //           data: img,
                    //           transformation: {
                    //             width: 100,
                    //             height: 100
                    //           }
                    //         })
                    //     )
                    //   : createText('')
                  ],
                  break: 1
                }),
                new Paragraph({
                  children: [
                    ...getOperateurs()
                    // isArray(values.images)
                    //   ? values.images.map(
                    //       (img) =>
                    //         new ImageRun({
                    //           data: img,
                    //           transformation: {
                    //             width: 100,
                    //             height: 100
                    //           }
                    //         })
                    //     )
                    //   : createText('')
                  ],
                  break: 1
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
        saveAs(blob, `${values.nom} ${values.prenom} ${values.numDoss !== '' ? values.numDoss : 'Care1'}.docx`);
        // window.location.reload()
        const bodyValues = values;
        delete bodyValues.cardiaConclusion;
        delete bodyValues.osoConclusion;
        delete bodyValues.duodénumConclusion;
        delete bodyValues.fundusConclusion;
        delete bodyValues.antreConclusion;
        delete bodyValues.bulbeConclusion;
        delete bodyValues.images;
        /* fetch('http://localhost:5000/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyValues)
        })
          .then((response) => response.json())
          .then(async (data) => {
            console.log('data', data);

            // generatePDF(data);
          }); */
        // resetForm();
        setSubmitting(false);
        enqueueSnackbar('Génération de compte rendu', { variant: 'success' });
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
  const createUnderlinedBoldTextOnNewLine = (text) =>
    new TextRun({
      text,
      color: '#000000',
      break: 1,
      bold: true,
      underline: {}
    });
  const createBoldTextOnNewLine = (text) =>
    new TextRun({
      text,
      color: '#000000',
      break: 1,
      bold: true
    });
  const getImages = async () => {
    const returnArray = [];
    if (values?.images?.length && values.images.length > 0) {
      await values.images.forEach(async (img) => {
        const iblob = await (await fetch(img)).blob();
        if (iblob) {
          returnArray.push(
            new ImageRun({
              data: iblob,
              transformation: {
                width: 100,
                height: 100
              }
            })
          );
        }
      });
      return returnArray;
    }
    return returnArray;
  };
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
        createText(values.antiCoagulantsGestion.replace('Autres', values.antiCoagulantsClasseDesc) ?? '')
      ];
    }
    return [createBoldTextOnNewLine('\tAnti thrombotique: '), createText('Non')];
  };
  const getAutreTraitement = () => {
    console.log('autresTraitements', values.autresTraitements);

    if (values.autresTraitements.length > 0) {
      return [createBoldTextOnNewLine('\tAutres traitements: '), createText(values.autresTraitements)];
    }
    return [];
  };
  function getIndications() {
    const array = [];
    if (values.thérapeutiqueIndex.length > 0 || values.diagnostiqueIndex.length > 0) {
      array.push(createBoldTextOnNewLine('Indications: FOGD: '));
      if (values.typeIndication) {
        // array.push(createBoldTextOnNewLine('Indications: FOGD Thérapeutique: '));
        console.log('---thérapeutiqueIndex', values?.thérapeutiqueIndex);
        values?.thérapeutiqueIndex?.forEach((e) => {
          console.log('e', e);
          console.log('v', FGDOthérapeutique[e]);
          array.push(createText(FGDOthérapeutique[e] + '; '));
        });
      } else {
        console.log('---diagnostiqueIndex', values?.diagnostiqueIndex);
        //array.push(createBoldTextOnNewLine('Indications: FOGD Diagnostique: '));
        values?.diagnostiqueIndex?.forEach((e) => {
          console.log('e', e);
          console.log('v', FGDOdiagnostique[e]);
          array.push(createText(FGDOdiagnostique[e] + '; '));
        });
      }
    }
    if (values.autresIndications && values.autresIndications !== '') {
      array.push(createTextOnNewLine(`Autres indications: ${values.autresIndications}`));
    }
    // return [
    //   createBoldTextOnNewLine(`Indications: ${values.typeIndication ? 'FOGD Thérapeutique: ' : 'FOGD Diagnostique: '}`),
    //   createText(
    //     `${
    //       values.typeIndication
    //         ? FGDOthérapeutique[values.thérapeutiqueIndex] ?? ''
    //         : FGDOdiagnostique[values.diagnostiqueIndex] ?? ''
    //     }`
    //   )
    // ];
    return array;
  }
  const getHemoDigestive = () => {
    console.log('typeIndication', values.typeIndication);
    console.log('thérapeutiqueIndex', values.thérapeutiqueIndex);
    if (values.typeIndication && checkIndiction(true, 0)) {
      return [...getIPP(), ...getSuspicion(), ...getVasoactif(), ...getAntibioprophylaxie()];
    }
    return [];
  };
  const getIPP = () => {
    if (values.ippHD) return [createBoldTextOnNewLine('\tIPP: '), createText('Oui')];
    return [createBoldTextOnNewLine('\tIPP: '), createText('Non')];
  };
  const getSurveillance = () => {
    if (values.surveillanceLesionDesc.length > 0 && !values.typeIndication && checkIndiction(false, 4)) {
      return [
        createBoldTextOnNewLine('\tSurveillance d’une lésion prénéoplasique: '),
        createText(values.surveillanceLesionDesc)
      ];
    }
    return [];
  };
  const getSuspicion = () => {
    if (values.suspicionCirrhoseHD)
      return [createBoldTextOnNewLine('\tSuspicion d’hémorragie par hypertension portale: '), createText('Oui')];
    return [createBoldTextOnNewLine('\tSuspicion d’hémorragie par hypertension portale: '), createText('Non')];
  };
  const getVasoactif = () => {
    if (values.suspicionCirrhoseHD) {
      if (values.vasoactifHD) return [createBoldTextOnNewLine('\tTraitement vasoactif: '), createText('Oui')];
      return [createBoldTextOnNewLine('\tTraitement vasoactif: '), createText('Non')];
    }
    return [];
  };

  const getAntibioprophylaxie = () => {
    if (values.suspicionCirrhoseHD) {
      if (values.antibioprophylaxieHD) return [createBoldTextOnNewLine('\tAntibioprophylaxie: '), createText('Oui')];
      return [createBoldTextOnNewLine('\tAntibioprophylaxie: '), createText('Non')];
    }
    return [];
  };

  const getJJA = () => {
    if (values.typeIndication && checkIndiction(true, 6) && values.antibioprophylaxieJJA)
      return [
        createBoldTextOnNewLine('\tSonde de gastrostomie/jéjunostomie d’alimentation: '),
        createBoldText('Antibioprophylaxie: '),
        createText(values.antibioprophylaxieDescJJA)
      ];
    return [];
  };
  const getConsentementPatient = () => {
    if (values.consentement) return [createBoldTextOnNewLine('Consentement éclairé du patient: '), createText('Oui')];
    return [createBoldTextOnNewLine('Consentement éclairé du patient: '), createText('Non')];
  };
  const getPrémédicationIndication = () => {
    return [createBoldTextOnNewLine('Pré médication: '), createText(values.prémédicationIndication ? 'Oui' : 'Non')];
  };
  const getPatientaJeune = () => {
    console.log('jeuneExamen', values.jeuneExamen);
    if (values.jeuneExamen) return [createBoldTextOnNewLine('Patient à jeûne: '), createText('Oui')];
    return [createBoldTextOnNewLine('Patient à jeûne: '), createText('Non')];
  };

  const getProtocolSédation = () => {
    if (values.sédationExamen)
      return [
        createBoldTextOnNewLine('Sous sédation '),
        createText(values.protocoleAvantSédation !== '' ? `: ${values.protocoleAvantSédation}` : '')
      ];
    return [];
  };
  const getMaterial = () => {
    console.log('autresMateriels', values?.autresMateriels);
    let materialString = values?.autresMateriels ? values.autresMateriels.join(', ') : '';
    return [
      createBoldTextOnNewLine('Matériel: '),
      createBoldTextOnNewLine(values.endoscope !== '' ? '\tEndoscope: ' : ''),
      createText(values.endoscope),
      createBoldTextOnNewLine(values.autresMateriels !== '' ? '\tAutres: ' : ''),
      createText(materialString.replace('Autres', `${values.autresMaterielsDesc}`))
    ];
  };
  const getZoneMalExploré = () => {
    if (values.zoneMalExploré) {
      let string = values?.indexZoneMalExploré ? values.indexZoneMalExploré.join(', ') : '';
      return [
        createBoldTextOnNewLine(values.indexZoneMalExploré !== '' ? 'Zones mal explorées: ' : ''),
        createText(string)
      ];
    }
    return [createBoldTextOnNewLine('Zones mal explorées: '), createText('Non')];
  };
  const getOesophage = () => [
    createBoldTextOnNewLine('Œsophage: '),
    createText(
      values.osophage ? (values.osoNormal ? 'Aspect endoscopique normal' : values.osophageDesc ?? '') : 'Non exploré'
    ),
    values.osoBiopsies ? createTextOnNewLine("Biopsies de l'Œsophage: ") : createText(''),
    values.osoBiopsies ? createText(values.osoBiopsiesDesc !== '' ? values.osoBiopsiesDesc : 'Oui') : createText('')
  ];
  const getCardia = () => [
    createBreak(),
    createBoldTextOnNewLine('Cardia: '),
    createText(
      values.cardia ? (values.cardiaNormal ? 'Aspect endoscopique normal' : values.cardiaDesc ?? '') : 'Non exploré'
    )
  ];
  const getEstomac = () => [
    createBreak(),
    createBoldTextOnNewLine('Estomac: '),
    createText(values.lacMuqueux !== '' ? `Lac muqueux ${values.lacMuqueux}` : ''),
    createText(values.lacMuqueux !== '' && values.lacMuqueuxDesc !== '' ? ', ' : ''),
    createText(values.lacMuqueuxDesc !== '' ? values.lacMuqueuxDesc : '')
  ];
  const getFundus = () => [
    createBoldTextOnNewLine('Fundus: '),
    createText(
      values.fundus ? (values.fundusNormal ? 'Aspect endoscopique normal' : values.fundusDesc ?? '') : 'Non exploré'
    )
  ];
  const getAntre = () => [
    createBoldTextOnNewLine('Antre: '),
    createText(
      values.antre ? (values.antreNormal ? 'Aspect endoscopique normal' : values.antreDesc ?? '') : 'Non exploré'
    )
  ];
  const getPylore = () => [
    createBoldTextOnNewLine('Pylore: '),
    createText(
      values.pylore ? (values.pyloreNormal ? 'Aspect endoscopique normal' : values.pyloreDesc ?? '') : 'Non exploré'
    )
  ];
  const getBiopsiesEsto = () => [
    values.estoBiopsies ? createTextOnNewLine("Biopsies de l'estomac: ") : createText(''),
    values.estoBiopsies ? createText(values.estoBiopsiesDesc !== '' ? values.estoBiopsiesDesc : 'Oui') : createText('')
  ];
  const getBulbe = () => [
    createBreak(),
    createBoldTextOnNewLine('Bulbe: '),
    createText(
      values.bulbe ? (values.bulbeNormal ? 'Aspect endoscopique normal' : values.bulbeDesc ?? '') : 'Non exploré'
    ),
    values.bulbeBiopsies ? createTextOnNewLine('Biopsies du bulbe: ') : createText(''),
    values.bulbeBiopsies
      ? createText(values.bulbeBiopsiesDesc !== '' ? values.bulbeBiopsiesDesc : 'Oui')
      : createText('')
  ];

  const getDuodénum = () => [
    createBreak(),
    createBoldTextOnNewLine('Duodénum: '),
    values.typeIndication && values.secondTime !== '' ? createText('Premier temps: Exploration: ') : createText(''),
    createText(values.duodénum ? '' : 'Non exploré'),
    createText(
      values.duodénum ? (values.duodénumNormal ? 'Aspect endoscopique normal' : values.duodénumDesc ?? '') : ''
    ),
    values.duodénumBiopsies
      ? createTextOnNewLine(checkIndiction(false, 9) ? 'Biopsies duodénales systématiques: ' : 'Biopsies du duodénum: ')
      : createText(''),
    values.duodénumBiopsies
      ? createText(values.duodénumBiopsiesDesc !== '' ? values.duodénumBiopsiesDesc : 'Oui')
      : createText('')
  ];
  const getSecondTime = () => {
    if (values.typeIndication && values.secondTime !== '')
      return [createTextOnNewLine('Deuxiéme temps: '), createText(values.secondTime)];
    return [];
  };
  const getFOGDTotal = () => [createBoldText('FOGD Totale: '), createText(values.FOGDtotale ? 'Oui' : 'Non')];
  const getDuréeExamen = () => [createBoldTextOnNewLine("Durée de l'examen: "), createText(values.duréeExamen)];
  const getQualitéVisualisation = () => [
    createBoldTextOnNewLine('Qualité de visualisation de la muqueuse: '),
    createText(values.qualityVisualisation),
    createTextOnNewLine(
      `Qualité de la préparation selon le score de Kuo modifié par Chang :  A=1, B=2, C=3, D=4 : le score totale est la somme des scores attribués à chaque région : il varie entre 4 et 16 avec 4 pour une excellente préparation et 16 pour une très mauvaise préparation : Score : ${getScoreQV()}`
    )
  ];
  const getChromoendoscopie = () => [
    createBoldTextOnNewLine('Utilisation de la chromoendoscopie virtuelle ou au lugol: '),
    createText(values.chromoendoscopie ? 'Oui' : 'Non'),
    createText(values.chromoendoscopie && values.chromoendoscopieDesc !== '' ? `: ${values.chromoendoscopieDesc}` : '')
  ];
  const getBiopsies = () => [
    createBoldTextOnNewLine('Biopsies: '),
    createText(values.biopsies ? 'Oui' : 'Non'),
    createText(values.biopsies && values.biopsiesDesc !== '' ? `: ${values.biopsiesDesc}` : '')
  ];

  const getConclusionGeneral = () => [createBoldText('Conclusion: '), createText(values.conclusion ?? '')];
  const getCAT = () => {
    if (values.CAT && values.CAT !== '') {
      return [createBoldTextOnNewLine('CAT: '), createText(values.CAT ?? '')];
    }
    return [];
  };
  const getOperateurs = () => {
    //const seniors = isArray(values.seniors) ? values.seniors.join(', ') : '';
    console.log('seniors', values.seniors);
    console.log('residents', values.residents);

    const seniors = values.seniors.split('\n');
    const residents = values.residents.split('\n');
    console.log('seniors', seniors);
    console.log('residents', residents);
    const seniorsText = seniors.map((s) => createTextOnNewLine(s));
    const residentsText = residents.map((s) => createTextOnNewLine(s));
    //const residents = isArray(values.residents) ? values.residents.join(', ') : '';
    // const techniciens = isArray(values.techniciens) ? values.techniciens.join(', ') : '';

    return [
      createBoldText('Opérateurs: '),
      createBoldTextOnNewLine('Séniors: '),
      ...seniorsText,
      //createText(values.seniors),
      createBreak(),
      //createText(seniors.replace('Autre', values.autreSeniors)),
      createBoldTextOnNewLine('Résidents: '),
      ...residentsText
      //createText(values.residents)
      // createText(residents.replace('Autre', values.autreResidents))
      // createBoldTextOnNewLine('\tTechniciens:'),
      // createText(techniciens)
    ];
  };
  const getRessenti = () => [createBoldText('Examen mal toléré :'), createText(values.ressentiPatient ? 'Oui' : 'Non')];
  const getComplications = () => [
    createBoldTextOnNewLine('Complications de l’examen endoscopique: '),
    createText(values.complicationEndo ? 'Oui' : 'Non'),
    createText(values.complicationEndo && values.complicationEndoDesc !== '' ? `: ${values.complicationEndoDesc}` : '')
  ];
  const getComplicationSedation = () => {
    if (values.sédationExamen) {
      return [
        createBoldTextOnNewLine('Complications de la sédation: '),
        createText(values.complicationSedation ? 'Oui' : 'Non'),
        createText(
          values.complicationSedation && values.complicationSedationDesc !== ''
            ? `: ${values.complicationSedationDesc}`
            : ''
        )
      ];
    }
    return [];
  };
  const getHospitatlisation = () => [
    createBoldTextOnNewLine('Nécessité d’une hospitalisation pour surveillance: '),
    createText(values.necessiteHospitalisation ? 'Oui' : 'Non')
  ];
  const createBorderedParagraph = (children) =>
    new Paragraph({
      children,
      border: {
        bottom: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 1 },
        top: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 1 },
        left: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 1 },
        right: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 1 }
      }
    });

  const getPart1 = () =>
    new Paragraph({
      children: [
        ...getFOGDTotal(),
        // ...getDuréeExamen(),
        ...getPrémédicationIndication(),
        ...getQualitéVisualisation(),
        ...getZoneMalExploré(),
        ...getChromoendoscopie(),
        ...getBiopsies()
      ],
      border: {
        bottom: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 },
        top: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 },
        left: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 },
        right: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 }
      }
    });
  const getPart2 = () =>
    new Paragraph({
      children: [...getConclusionGeneral(), ...getCAT()],
      border: {
        // bottom: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 },
        // top: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 5 },
        left: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 },
        right: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 }
      }
    });
  const getPart3 = () =>
    new Paragraph({
      children: [...getRessenti(), ...getComplications(), ...getComplicationSedation(), ...getHospitatlisation()],
      border: {
        bottom: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 },
        top: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 },
        left: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 },
        right: { style: BorderStyle.SINGLE, color: '#000000', size: 6, space: 0 }
      }
    });

  const checkIndiction = useCallback(
    (isThérapeutique, i) => {
      if (isThérapeutique) {
        const index = values.thérapeutiqueIndex.findIndex((e) => e === i);
        if (index > -1) {
          return true;
        }
        return false;
      } else {
        const index = values.diagnostiqueIndex.findIndex((e) => e === i);
        if (index > -1) {
          return true;
        }
        return false;
      }
    },
    [values.thérapeutiqueIndex, values.diagnostiqueIndex]
  );

  const getScoreQV = () => {
    const getScore = (value) => {
      switch (value) {
        case 'A':
          return 1;
        case 'B':
          return 2;
        case 'C':
          return 3;
        case 'D':
          return 4;
        default:
          return 0;
      }
    };
    if (values.qvFundus && values.qvPartieSup && values.qvPartieInf && values.qvAntre)
      return (
        getScore(values.qvFundus) +
        getScore(values.qvPartieSup) +
        getScore(values.qvPartieInf) +
        getScore(values.qvAntre)
      );
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
