/* eslint-disable */
import PropTypes from 'prop-types';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import moment from 'moment/moment';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import Image from 'mui-image';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import {
  Chip,
  Card,
  Grid,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Switch,
  DatePicker,
  Select,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Autocomplete
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DragDropContext } from 'react-beautiful-dnd';
import { DateTimePicker, MobileDateTimePicker, DesktopDateTimePicker } from '@mui/lab';
import dayjs from 'dayjs';
// import Style from './Modal.module.css';
import Criterion from '../../../../assets/examen/criterion.png';
import Forrest from '../../../../assets/examen/forrest.png';
import Gastrooeso from '../../../../assets/examen/gastro-oeso.jpg';
import Gov from '../../../../assets/examen/gov.jpg';
import Paris from '../../../../assets/examen/paris.png';
import Prague from '../../../../assets/examen/prague.jpg';
import Reflux from '../../../../assets/examen/reflux.jpg';
import VO from '../../../../assets/examen/vo.png';
import Zargar from '../../../../assets/examen/zargar.png';
import Cancel from '../../../../assets/examen/cancel.png';
import A from '../../../../assets/examen/A.png';
import B from '../../../../assets/examen/B.png';
import C from '../../../../assets/examen/C.png';
import D from '../../../../assets/examen/D.png';
import checklist from '../../../../assets/examen/checklist.jpg';
// utils
import fakeRequest from '../../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { UploadMultiFile } from '../../../../components/upload';
import ConclusionGenerator from './ConclusionGenerator';
import MultiSelect from './MultiSelect';

//
// ----------------------------------------------------------------------

ExploredItem.propTypes = {
  label: PropTypes.string,
  formik: PropTypes.object
};
function ExploredItem({ label, field, formik, yesLabel, noLabel }) {
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event, checked) => {
    setIsChecked(checked);
    setFieldValue(field, checked, false);
  };
  return (
    <>
      <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
        <Typography variant="h6">{label}</Typography>
        <ToggleButtonGroup
          name={field}
          color="primary"
          value={isChecked}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value={false}>{noLabel}</ToggleButton>
          <ToggleButton value>{yesLabel}</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </>
  );
}
UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  formik: PropTypes.object
};
const zones = [
  'Œsophage supérieur',
  'Œsophage inférieur',
  'Ligne Z et sommet des plis gastriques',
  'Cardia, fundus et la petite courbure en rétroversion',
  'Corps gastrique avec la petite courbure en vision directe',
  'Corps gastrique avec la grande courbure en rétrovision',
  'Antre',
  'L’angle de la petite courbure en rétrovision partielle',
  'Bulbe',
  'Deuxième duodénum'
];
const endoscopes = [
  '1- Olympus GIF-Q150 2206251',
  '2- Olympus GIF-Q150 2620604',
  '3- Olympus GIF-H180',
  '4- Olympus GIF-H170 (EXERA III)',
  '5- FUJINON SN7G361K493'
];
const autresMateriels = [
  'Clips d’hémostase',
  'Kit de ligature élastique des varices oesophagiennes',
  'Aiguille d’injection',
  'Pince froide',
  'Pince chaude',
  'Pince à usage unique',
  'Pince à usage multiple',
  'Anse à polypectomie à panier de type Dormia',
  'Argon/sonde d’électrocoagulation',
  'Autres'
];
const optionsOesophage = [
  { id: '1', label: 'Aspect d’acanthose glycogénique de l’œsophage' },
  {
    id: '2',
    label: 'Oesophagite caustique grade (0/I/IIA/IIB/IIIA/IIIB/IV) selon la classification de Zargar ',
    hasDropdown: true,
    dropdownValues: ['0', 'I', 'IIA', 'IIB', 'IIIA', 'IIIB', 'IV'],
    dropdownLabel: 'Grade'
  },
  {
    id: '3',
    label: 'Oesophagite grade (A/B/C/D) selon la classification de Los Angeles',
    hasDropdown: true,
    dropdownValues: ['A', 'B', 'C', 'D'],
    dropdownLabel: 'Grade'
  },
  { id: '7', label: 'Oesophagite mycotique ' },
  {
    id: '4',
    label: 'Varices oesophagiennes grade (I/II/III) [sans signes rouges/avec signes rouges]',
    hasDropdown: true,
    dropdownValues: ['I', 'II', 'III'],
    dropdownLabel: 'Grade',
    hasChoice: true,
    yesLabel: 'sans signes rouges',
    noLabel: 'avec signes rouges',
    isCustom: true,
    customNb: 1
  },
  {
    id: '5',
    label:
      'EBO classé C(chiffre)M(chiffre) selon la classification de Prague, Biopsies oesophagiennes selon le protocole de Seattle [oui/non]',
    hasTextField: true,
    textFieldLabel: 'C',
    textField: '',
    hasTextField2: true,
    textFieldLabel2: 'M',
    textField2: '',
    hasChoice: true,
    yesLabel: 'Oui',
    noLabel: 'Non',
    isCustom: true,
    customNb: 2
  },
  {
    id: '6',
    label: 'Processus ulcéro-bourgeonnant de l’œsophage (supérieur, moyen, inférieur) ',
    hasDropdown: true,
    dropdownValues: ['supérieur', 'moyen', 'inférieur'],
    dropdownLabel: 'Localisation'
  }
];
const optionsCardia = [
  {
    id: '1',
    label: 'Hernie hiatale par (glissement/roulement)',
    hasDropdown: true,
    dropdownValues: ['glissement', 'roulement'],
    dropdownLabel: 'Type'
  }
];
const optionsFundus = [
  { id: '1', label: 'Aspect de métaplasie intestinale gastrique' },
  {
    id: '2',
    label: 'Gastropathie fundique (en mosaïque/congestive/nodulaire/ulcérée/érosive/varioliforme/atrophique)',
    hasDropdown: true,
    dropdownValues: ['en mosaïque', 'congestive', 'nodulaire', 'ulcérée', 'érosive', 'varioliforme', 'atrophique'],
    dropdownLabel: 'Description'
  },
  {
    id: '3',
    label: 'Ulcère fundique'
  },
  {
    id: '4',
    label: 'Aspect de gros plis fundique'
  },
  {
    id: '5',
    label: 'Aspect de compression extrinsèque'
  },
  {
    id: '6',
    label: 'Formation d’allure sous-muqueuse fundique'
  },
  {
    id: '7',
    label: 'Polype fundique classé () selon la classification de Paris ',
    hasTextField: true,
    textFieldLabel: 'Classe'
  },
  {
    id: '8',
    label: 'Processus ulcéro-bourgeonnant fundique'
  },
  {
    id: '9',
    label: 'Varice gastrique type (GOV 1/GOV 2/IGV 1)',
    hasDropdown: true,
    dropdownValues: ['GOV 1', 'GOV 2', 'IGV 1'],
    dropdownLabel: 'Type'
  }
];
const optionsAntre = [
  { id: '1', label: 'Aspect de métaplasie intestinale gastrique, Biopsies' },
  {
    id: '2',
    label: 'Gastropathie antrale (en mosaïque,congestive,nodulaire,ulcérée,érosive,varioliforme,atrophique)',
    hasDropdown: true,
    dropdownValues: ['en mosaïque', 'congestive', 'nodulaire', 'ulcérée', 'erosive', 'varioliforme', 'atrophique'],
    dropdownLabel: 'Description',
    hasSecondDropdown: true
  },
  {
    id: '3',
    label: 'Ulcère antral'
  },
  {
    id: '4',
    label: 'Aspect de gros (plis antraux/pré pyloriques)',

    hasDropdown: true,
    dropdownValues: ['plis antraux', 'pré pyloriques'],
    dropdownLabel: 'Description'
  },
  {
    id: '5',
    label: 'Aspect de compression extrinsèque'
  },
  {
    id: '6',
    label: 'Formation d’allure sous-muqueuse antrale'
  },
  {
    id: '7',
    label: 'Polype antral classé () selon la classification de Paris ',
    hasTextField: true,
    textFieldLabel: 'Classe'
  },
  {
    id: '8',
    label: 'Processus ulcéro-bourgeonnant antral'
  },
  {
    id: '9',
    label: 'Varice gastrique type IGV 2'
  }
];
const optionsBulbe = [
  { id: '1', label: 'Ulcère évolutif du bulbe' },
  {
    id: '2',
    label: 'Bulbe déformé cicatriciel'
  },
  {
    id: '3',
    label: 'Bulbe atrophique'
  },
  {
    id: '4',
    label: 'Bulbite congestive'
  }
];
const optionsDuodénum = [
  {
    id: '1',
    label: 'Aspect (en mosaïque/nodulaire/blanchâtre) de la muqueuse duodénale',
    hasDropdown: true,
    dropdownValues: ['en mosaïque', 'nodulaire', 'blanchâtre'],
    dropdownLabel: 'Description'
  },
  {
    id: '2',
    label: 'Aspect d’atrophie duodénale'
  },
  {
    id: '3',
    label: 'Aspect déchiqueté et atrophique des plis duodénaux'
  },
  {
    id: '4',
    label: 'Grosse papille'
  },
  {
    id: '5',
    label: 'Processus ulcéro-bourgeonnant duodénal '
  },
  {
    id: '6',
    label: 'Aspect de lymphangiectasies duodénales'
  }
];
const scores = [
  { label: 'A: Absence de mucus', value: 'A' },
  { label: 'B: Faible quantité de mucus', value: 'B' },
  { label: 'C: Mucus qui nécessite moins de 50 ml pou d’eau pour être lavé', value: 'C' },
  { label: 'D: Mucus qui nécessite plus de 50 ml d’eau pour être lavé', value: 'D' }
];

export default function UserNewForm({ isEdit, formik }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNumber, setModalNumber] = useState(0);
  function displayModal(number) {
    setModalNumber(number);
    setModalVisible(true);
  }
  const [preview, setPreview] = useState(true);
  const [files, setFiles] = useState([]);
  // const [date, setDate] = React.useState(dayjs('2022-04-17T15:30'));

  const reader = new FileReader();
  const checkIndiction = (isThérapeutique, i) => {
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
  };

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      // setFiles(
      acceptedFiles.forEach((f, i) => {
        console.log(f);

        // reader.onloadend = function () {
        //   // console.log('RESULT', reader.result);
        //   return Object.assign(f, {
        //     preview: URL.createObjectURL(f),
        //     result: reader.result
        //   });
        //   //  return reader.result;
        // };
        if (i === 0) {
          // const a = [...files];
          // a.push(
          //   Object.assign(f, {
          //     preview: URL.createObjectURL(f)
          //     // result: reader?.result?.split(',')[1] ?? ''
          //   })
          // );
          // setFiles(a);
          reader.onload = function () {
            // console.log('RESULT', reader.result);
            console.log('FILES HERE', files);
            const a = [...files];
            a.push(
              Object.assign(f, {
                preview: URL.createObjectURL(f),
                result: reader.result // dataURLtoBlob(reader.result)
                // blob: window.dataURLtoBlob(reader.result)
              })
            );
            setFiles(a);

            // dataURLtoBlob(reader.result, function (blob) {
            //   console.log(blob);
            // });
            //  return reader.result;
          };
          reader.readAsDataURL(f);
        }
        // return Object.assign(f, {
        //   preview: URL.createObjectURL(f)
        // });
      });
      // );
    },
    [setFiles, files]
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
  useEffect(() => {
    if (files) {
      // console.log('Files', files);
      const array = [];
      files.forEach((e) => {
        // console.log('f', e.result);
        if (e.result) {
          array.push(e.result.split(',')[1]);
        }
      });
      // console.log('array', array);
      setFieldValue('images', array);
    }
  }, [files]);

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const modalViewStyle = { display: 'flex', justifyContent: 'center', marginTop: '40px', alignItems: 'center' };
  function getModalContent() {
    switch (modalNumber) {
      case 0:
        return (
          <Stack
            direction={{ xs: 'column' }}
            sx={modalViewStyle}
            // spacing={{ xs: 3, sm: 2 }}
          >
            <Image src={VO} height="40vh" fit="contain" alt="vo" />
          </Stack>
        );
      case 1:
        return (
          <Stack
            direction={{ xs: 'column' }}
            sx={modalViewStyle}
            // spacing={{ xs: 3, sm: 2 }}
          >
            <Image src={Prague} width="50vw" fit="contain" alt="prague" />
          </Stack>
        );
      case 2:
        return (
          <Stack
            direction={{ xs: 'column' }}
            sx={modalViewStyle}
            // spacing={{ xs: 3, sm: 2 }}
          >
            <Image src={Reflux} width="50vw" fit="contain" alt="reflux" />
          </Stack>
        );
      case 3:
        return (
          <Stack
            direction={{ xs: 'column' }}
            sx={modalViewStyle}
            // spacing={{ xs: 3, sm: 2 }}
          >
            <Image src={Zargar} height="40vh" fit="contain" alt="zargar" />
          </Stack>
        );
      case 4:
        return (
          <Stack
            direction={{ xs: 'column' }}
            sx={modalViewStyle}
            // spacing={{ xs: 3, sm: 2 }}
          >
            <Image src={Gastrooeso} width="40vw" fit="contain" alt="Gastrooeso" />
          </Stack>
        );
      case 5:
        return (
          <Stack
            direction={{ xs: 'column' }}
            sx={modalViewStyle}
            // spacing={{ xs: 3, sm: 2 }}
          >
            <Image src={Paris} width="40vw" fit="contain" alt="Paris" />
          </Stack>
        );
      case 6:
        return (
          <Stack
            direction={{ xs: 'column' }}
            sx={modalViewStyle}
            // spacing={{ xs: 3, sm: 2 }}
          >
            <Image src={Gov} width="40vw" fit="contain" alt="Gov" />
          </Stack>
        );
      case 7:
        return (
          <Stack
            direction={{ xs: 'column' }}
            sx={modalViewStyle}
            // spacing={{ xs: 3, sm: 2 }}
          >
            <Image src={Forrest} width="40vw" fit="contain" alt="forrest" />
          </Stack>
        );
      case 8:
        return (
          <Stack
            direction={{ xs: 'column' }}
            sx={modalViewStyle}
            // spacing={{ xs: 3, sm: 2 }}
          >
            <Image src={Criterion} width="40vw" fit="contain" alt="Criterion" />
          </Stack>
        );
      default:
        break;
    }
  }
  const isModalWide = modalNumber === 1 || modalNumber === 2 || modalNumber === 4;

  const [tasks, setTasks] = useState([]);
  const onDeleteTask = (index) => {
    const newTasks = Array.from(tasks);
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };
  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const newTasks = Array.from(tasks);
    const [removed] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, removed);

    setTasks(newTasks);
  }
  const [text, setText] = useState('');
  const autocRef = useRef();
  function handleSubmitForm() {
    console.log('submit', text);
    if (text.trim().length === 0 || tasks.find((t) => t.content === text)) {
      return;
    }
    const task = optionsFundus.find((e) => e.label === text);

    // props.onSubmit(text);
    const newTasks = Array.from(tasks);
    if (task) {
      newTasks.push({ id: task.id.toString(), content: task.label, ...task });
    } else {
      newTasks.push({ id: Math.random().toFixed(3).toString(), content: text });
    }
    setTasks(newTasks);
    setText('');
  }
  const onSaveTask = (index, content) => {
    const newTasks = Array.from(tasks);
    newTasks[index].content = content;
    setTasks(newTasks);
  };
  console.log('tasks', tasks);

  return (
    <>
      <ReactModal
        shouldCloseOnOverlayClick
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        // className="Modal"
        // overlayClassName="Overlay"
        style={{
          content: {
            // height: '80vh',
            // eslint-disable-next-line
            width: isModalWide
              ? '55vw'
              : modalNumber === 5 || modalNumber === 6 || modalNumber === 7 || modalNumber === 8
              ? '45vw'
              : '40vw',
            top: isModalWide ? '15%' : '20%',
            left: isModalWide ? '25%' : '30%',
            // right: '40%',
            // marginRight: '-50%',
            // transform: 'translate(-50%, 37%)',
            position: 'sticky'
          },
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            height: '100vh',
            width: '100vw'
          }
          // content: { height: '100%', width: '100%' }
        }}
      >
        <Button title="Close" onClick={() => setModalVisible(false)} sx={{ position: 'absolute', right: 0, top: 0 }}>
          {/* <Typography>Close</Typography> */}
          <img src={Cancel} height="40px" width="40px" alt="close" />
        </Button>
        {getModalContent()}
      </ReactModal>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="h4">Avant Examen</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                {/* <ExploredItem
                  noLabel="Non"
                  yesLabel="Oui"
                  formik={formik}
                  field="examenPhysiqueInterrogatoire"
                  label="Examen physique et interrogatoire "
                /> */}
                {/*  <TextField
                  fullWidth
                  multiline
                  label="Délai entre la demande de l’examen et sa réalisation "
                  {...getFieldProps('délaiExamen')}
                /> */}
                {/* <MobileDateTimePicker
                  label="Date et heure de l'examen"
                  value={date}
                  onChange={(newDate) => {
                    console.log('newDate', moment(newDate).format('DD-MM-YYYY HH:MM'));
                    setDate(moment(newDate));
                    setFieldValue('dateExamen', moment(newDate).format('DD-MM-YYYY HH:MM'));
                  }}
                  renderInput={(params) => <TextField {...params} />}
                /> */}
                <ExploredItem
                  noLabel="Non"
                  yesLabel="Oui"
                  formik={formik}
                  field="prémédicationIndication"
                  label="Pré médication"
                />
                {/*
                {values.prémédicationIndication && (
                  <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField fullWidth label="Pré médication" {...getFieldProps('prémédicationIndicationDesc')} />
                  </Stack>
                )} */}
                <ExploredItem
                  noLabel="Non"
                  yesLabel="Oui"
                  formik={formik}
                  field="consoTabacAvantExamen"
                  label="Patient ayant reçu les instructions appropriées du jeûne"
                />
                <ExploredItem noLabel="Non" yesLabel="Oui" formik={formik} field="jeuneExamen" label="Patient à jeun" />
                {/* {values.jeuneExamen && (
                <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Depuis combien d'heures pour les solides"
                    {...getFieldProps('duréeJeuneSolide')}
                  />
                  <TextField
                    fullWidth
                    label="Depuis combien d'heures pour les liquides"
                    {...getFieldProps('duréeJeuneLiquide')}
                  />
                </Stack>
              )} */}

                <ExploredItem
                  noLabel="Non"
                  yesLabel="Oui"
                  formik={formik}
                  field="sédationExamen"
                  label="Sous sédation"
                />
                {values.sédationExamen && (
                  <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label="Protocole de la sédation"
                      {...getFieldProps('protocoleAvantSédation')}
                    />
                    <ExploredItem
                      noLabel="Sans anomalies"
                      yesLabel="Avec anomalies"
                      formik={formik}
                      field="anomaliesAvantSédation"
                      label="Examen avant sédation"
                    />
                    {values.anomaliesAvantSédation && (
                      <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label="Les anomalies à l'examen"
                          {...getFieldProps('anomaliesAvantSédationDesc')}
                        />
                      </Stack>
                    )}
                  </Stack>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="h4">Matériel</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: 'column' }} spacing={{ xs: 3 }}>
                <TextField
                  select
                  fullWidth
                  {...getFieldProps('endoscope')}
                  SelectProps={{ native: true }}
                  label="L'endoscope"
                >
                  <option key="0" value="" />
                  {endoscopes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
                {/* <ExploredItem noLabel="Non" yesLabel="Oui" formik={formik} field="pince" label="Pince" />
                {values.pince && (
                  <ExploredItem noLabel="Unique" yesLabel="Multiple" formik={formik} field="usagePince" label="Usage" />
                )} */}
                {/* <TextField
                  select
                  fullWidth
                  label="Autres Materiels"
                  SelectProps={{ native: true }}
                  {...getFieldProps('autresMateriels')}
                >
                  <option key="0" value="" />
                  {.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField> */}

                <MultiSelect
                  label="Autres Materiels"
                  options={autresMateriels}
                  formikValue="autresMateriels"
                  setFieldValue={setFieldValue}
                />

                {values.autresMateriels.includes('Autres') && (
                  <TextField fullWidth label="Autres" {...getFieldProps('autresMaterielsDesc')} />
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="h4">Examen</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                <ExploredItem
                  noLabel="Non exploré"
                  yesLabel="Exploré"
                  formik={formik}
                  field="osophage"
                  label="Œsophage"
                />
                {values.osophage && (
                  <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                    <ExploredItem
                      noLabel="Non"
                      yesLabel="Oui"
                      formik={formik}
                      field="osoNormal"
                      label="Aspect endoscopique normal"
                    />
                    {!values.osoNormal && (
                      <TextField fullWidth label="Exploration de l'Œsophage" {...getFieldProps('osophageDesc')} />
                    )}
                    <ExploredItem
                      noLabel="Non"
                      yesLabel="Oui"
                      formik={formik}
                      field="osoBiopsies"
                      label="Biopsises de l'Œsophage"
                    />
                    {values.osoBiopsies && (
                      <TextField
                        fullWidth
                        label="Biopsises de l'Œsophage: nombre(), localisation (), nombre de tubes()"
                        {...getFieldProps('osoBiopsiesDesc')}
                      />
                    )}
                    {!values.osoNormal && (
                      <>
                        <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                          <Button variant="contained" onClick={() => displayModal(0)}>
                            <Typography>Classification de Baveno pour les varices oesophagiennes</Typography>
                          </Button>
                          <Button variant="contained" onClick={() => displayModal(1)}>
                            <Typography>Classification de Prague</Typography>
                          </Button>
                        </Stack>
                        <Stack direction={{ xs: 'row', width: '100%' }} spacing={{ xs: 3, sm: 2 }}>
                          <Button variant="contained" onClick={() => displayModal(2)}>
                            <Typography>Classification de Los Angeles</Typography>
                          </Button>
                          <Button variant="contained" onClick={() => displayModal(3)}>
                            <Typography>Classification de Zargar</Typography>
                          </Button>
                          <Button variant="contained" onClick={() => displayModal(4)}>
                            <Typography>Classification de Siewert</Typography>
                          </Button>
                        </Stack>
                        <Typography variant="h6">Conclusion</Typography>
                        <ConclusionGenerator
                          formikValue="osoConclusion"
                          options={optionsOesophage}
                          setFieldValue={setFieldValue}
                        />
                      </>
                    )}
                  </Stack>
                )}
                <ExploredItem noLabel="Non exploré" yesLabel="Exploré" formik={formik} field="cardia" label="Cardia" />
                {values.cardia && (
                  <>
                    <ExploredItem
                      noLabel="Non"
                      yesLabel="Oui"
                      formik={formik}
                      field="cardiaNormal"
                      label="Aspect endoscopique normal"
                    />

                    {!values.cardiaNormal && (
                      <>
                        <TextField fullWidth label="Exploration du cardia" {...getFieldProps('cardiaDesc')} />
                        <Typography variant="h6">Conclusion</Typography>
                        <ConclusionGenerator
                          formikValue="cardiaConclusion"
                          options={optionsCardia}
                          setFieldValue={setFieldValue}
                        />
                      </>
                    )}
                  </>
                )}
                <Typography variant="h4">Estomac</Typography>
                <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                  <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Lac muqueux "
                      SelectProps={{ native: true }}
                      {...getFieldProps('lacMuqueux')}
                    >
                      <option key="0" value="" />
                      {['Clair', 'Sale avec présence de débris alimentaires', 'Mousseux', 'Bilieux'].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                    <TextField
                      select
                      fullWidth
                      label=""
                      SelectProps={{ native: true }}
                      {...getFieldProps('lacMuqueuxDesc')}
                    >
                      <option key="0" value="" />
                      {['Normo-abondant', 'Abondant'].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                  </Stack>
                  <ExploredItem
                    noLabel="Non exploré"
                    yesLabel="Exploré"
                    formik={formik}
                    field="fundus"
                    label="Fundus"
                  />
                  {values.fundus && (
                    <>
                      <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="fundusNormal"
                        label="Aspect endoscopique normal"
                      />
                      {!values.fundusNormal && (
                        <>
                          <TextField fullWidth label="Exploration du fundus" {...getFieldProps('fundusDesc')} />
                          <Typography variant="h6">Conclusion</Typography>
                          <ConclusionGenerator
                            formikValue="fundusConclusion"
                            options={optionsFundus}
                            setFieldValue={setFieldValue}
                          />
                        </>
                      )}
                    </>
                  )}
                  <ExploredItem noLabel="Non exploré" yesLabel="Exploré" formik={formik} field="antre" label="Antre" />
                  {values.antre && (
                    <>
                      <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="antreNormal"
                        label="Aspect endoscopique normal"
                      />
                      {!values.antreNormal && (
                        <>
                          <TextField fullWidth label="Exploration de l'antre" {...getFieldProps('antreDesc')} />
                          <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                            <Button variant="contained" onClick={() => displayModal(6)}>
                              <Typography>Classification de Sarin pour les varices gastriques</Typography>
                            </Button>
                            <Button variant="contained" onClick={() => displayModal(5)}>
                              <Typography>Classification de Paris</Typography>
                            </Button>
                          </Stack>
                          <Stack direction={{ xs: 'row', width: '100%' }} spacing={{ xs: 3, sm: 2 }}>
                            <Button variant="contained" onClick={() => displayModal(7)}>
                              <Typography>Classification de Forrest</Typography>
                            </Button>
                          </Stack>
                          <Typography variant="h6">Conclusion</Typography>
                          <ConclusionGenerator
                            formikValue="antreConclusion"
                            options={optionsAntre}
                            setFieldValue={setFieldValue}
                          />
                        </>
                      )}
                    </>
                  )}
                  <ExploredItem
                    noLabel="Non exploré"
                    yesLabel="Exploré"
                    formik={formik}
                    field="pylore"
                    label="Pylore"
                  />
                  {values.pylore && (
                    <>
                      <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="pyloreNormal"
                        label="Aspect endoscopique normal"
                      />
                      {!values.pyloreNormal && (
                        <TextField fullWidth label="Exploration du pylore" {...getFieldProps('pyloreDesc')} />
                      )}
                    </>
                  )}
                  {/* <ExploredItem noLabel="Non" yesLabel="Oui" formik={formik} field="estoBiopsies" label="Biopsies" />
                  {values.estoBiopsies && (
                    <TextField
                      fullWidth
                      label="Biopsies estomac: nombre et localisation, nombre de tubes"
                      {...getFieldProps('estoBiopsiesDesc')}
                    />
                  )} */}
                  <ExploredItem
                    noLabel="Non"
                    yesLabel="Oui"
                    formik={formik}
                    field="estoBiopsies"
                    label="Biopsies de l'Estomac"
                  />
                  {values.estoBiopsies && (
                    <TextField
                      fullWidth
                      label="Biopsies de l'Estomac: nombre(), localisation (), nombre de tubes()"
                      {...getFieldProps('estoBiopsiesDesc')}
                    />
                  )}
                  <ExploredItem noLabel="Non exploré" yesLabel="Exploré" formik={formik} field="bulbe" label="Bulbe" />
                  {values.bulbe && (
                    <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                      <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="bulbeNormal"
                        label="Aspect endoscopique normal"
                      />
                      {!values.bulbeNormal && (
                        <TextField fullWidth label="Exploration du bulbe" {...getFieldProps('bulbeDesc')} />
                      )}
                      <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="bulbeBiopsies"
                        label="Biopsies bulbe"
                      />
                      {values.bulbeBiopsies && (
                        <TextField
                          fullWidth
                          label="Biopsies du bulbe: nombre(), localisation (), nombre de tubes()"
                          {...getFieldProps('bulbeBiopsiesDesc')}
                        />
                      )}
                      {!values.bulbeNormal && (
                        <>
                          <Typography variant="h6">Conclusion</Typography>
                          <ConclusionGenerator
                            formikValue="bulbeConclusion"
                            options={optionsBulbe}
                            setFieldValue={setFieldValue}
                          />
                        </>
                      )}
                    </Stack>
                  )}
                  <ExploredItem
                    noLabel="Non exploré"
                    yesLabel="Exploré"
                    formik={formik}
                    field="duodénum"
                    label="Duodénum"
                  />
                  {values.duodénum && (
                    <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                      <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="duodénumNormal"
                        label="Aspect endoscopique normal"
                      />
                      {!values.duodénumNormal && (
                        <TextField fullWidth label="Exploration du duodénum" {...getFieldProps('duodénumDesc')} />
                      )}
                      <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="duodénumBiopsies"
                        //TODO add condition
                        label={checkIndiction(false, 9) ? 'Biopsies duodénales systématiques' : 'Biopsies du duodénum'}
                      />
                      {values.duodénumBiopsies && (
                        <TextField
                          fullWidth
                          label="Biopsies du duodénum: nombre(), localisation (), nombre de tubes()"
                          {...getFieldProps('duodénumBiopsiesDesc')}
                        />
                      )}
                      {!values.duodénumNormal && (
                        <>
                          <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                            <Button variant="contained" onClick={() => displayModal(8)}>
                              <Typography>Classification de Spigelman</Typography>
                            </Button>
                          </Stack>
                          <Typography variant="h6">Conclusion</Typography>
                          <ConclusionGenerator
                            formikValue="duodénumConclusion"
                            options={optionsDuodénum}
                            setFieldValue={setFieldValue}
                          />
                        </>
                      )}
                    </Stack>
                  )}
                  {values.typeIndication && (
                    <TextField fullWidth label="Deuxiéme temps" {...getFieldProps('secondTime')} />
                  )}
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="h4">Qualité de la visualisation de la muqueuse </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                <Typography variant="h6">Score totale de visibilité muqueuse : </Typography>
                <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Fundus"
                    SelectProps={{ native: true }}
                    {...getFieldProps('qvFundus')}
                  >
                    <option key="0" value="" />
                    {scores.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Partie supérieure de la grosse tubérosité "
                    SelectProps={{ native: true }}
                    {...getFieldProps('qvPartieSup')}
                  >
                    <option key="0" value="" />
                    {scores.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Stack>
                <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Partie inférieure de la grosse tubérosité"
                    SelectProps={{ native: true }}
                    {...getFieldProps('qvPartieInf')}
                  >
                    <option key="0" value="" />
                    {scores.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Antre"
                    SelectProps={{ native: true }}
                    {...getFieldProps('qvAntre')}
                  >
                    <option key="0" value="" />
                    {scores.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Stack>
                <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Image src={A} height="20vh" fit="contain" alt="A" />
                  <Image src={B} height="20vh" fit="contain" alt="B" />
                  <Image src={C} height="20vh" fit="contain" alt="C" />
                  <Image src={D} height="20vh" fit="contain" alt="D" />
                </Stack>
                <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  Qualité de la préparation selon le score de Kuo modifié par Chang : A=1, B=2, C=3, D=4 : le score
                  totale est la somme des scores attribués à chaque région : il varie entre 4 et 16 avec 4 pour une
                  excellente préparation et 16 pour une très mauvaise préparation
                </Stack>
                <Typography variant="h6">Score: {getScoreQV()}</Typography>
                <TextField
                  select
                  fullWidth
                  label="Qualité de la visualisation de la muqueuse"
                  SelectProps={{ native: true }}
                  {...getFieldProps('qualityVisualisation')}
                >
                  <option key="0" value="" />
                  {['Bonne', 'Moyenne', 'Mauvaise'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
              </Stack>
            </AccordionDetails>
          </Accordion> */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="h4">Photodocumentation </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                <Typography>
                  Les sociétés savantes recommandent de réaliser un examen complet et de prendre des photos des
                  différentes zones à explorer à savoir : oesophage proximal, oesophage distal, ligne Z et cardia
                  anatomique, cardia et fundus en rétrovision, corps gastriqur avec la petite courbure en vision
                  directe, corps gastrique avec la grande courbure en rétrovision partielle, l'angle de la petite
                  courbure en rétrovision partielle, l'antre, le bulbe et le deuxième duodénum. À défaut de prendre des
                  photos, ces zones doivent être considérées comme des check-points ou il faut faire un temps de latence
                  pour bien les explorer. (photos ci dessous)
                </Typography>
                <Image src={checklist} width={'100%'} fit="contain" alt="A" />
                {/* <MultiSelect
                    label="Zones explorées"
                    formikValue="indexZoneExploré"
                    options={zones}
                    setFieldValue={setFieldValue}
                  /> */}
                <ExploredItem
                  noLabel="Non"
                  yesLabel="Oui"
                  formik={formik}
                  field="zoneMalExploré"
                  label="Y a-t-il des zones non ou mal explorées?"
                />
                {values.zoneMalExploré && (
                  <MultiSelect
                    label="Zones mal explorées"
                    formikValue="indexZoneMalExploré"
                    options={zones}
                    setFieldValue={setFieldValue}
                  />
                )}

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" sx={{ mb: '2%' }}>
                    Images prises durant l’examen endoscopiques
                  </Typography>
                  <UploadMultiFile
                    showPreview={preview}
                    files={files}
                    onDrop={handleDropMultiFile}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                    onUpload={async () => {
                      console.log('files', files);
                      const a = [];
                      files.forEach(async (f) => {
                        if (f?.result && f.result !== '') {
                          //   a.push(Uint8Array.from(atob(f.result), (c) => c.charCodeAt(0)));
                          a.push(f.result);

                          // fetch(f.result)
                          //   .then((res) => res.blob())
                          //   .then((blob) => {
                          //     console.log(blob);
                          //     a.push(blob);
                          //   });
                        }
                      });
                      setFieldValue('images', a);
                      console.log('a', a);
                    }}
                  />
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="h4">Ressenti du patient </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                <ExploredItem
                  noLabel="Non"
                  yesLabel="Oui"
                  formik={formik}
                  field="ressentiPatient"
                  label="Examen mal toléré"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </>
  );
}
function dataURLtoBlob(dataUrl) {
  var req = new XMLHttpRequest();

  req.open('GET', dataUrl);
  req.responseType = 'arraybuffer'; // Can't use blob directly because of https://crbug.com/412752

  req.onload = function fileLoaded(e) {
    // If you require the blob to have correct mime type
    var mime = this.getResponseHeader('content-type');

    return new Blob([this.response], { type: mime });
  };

  req.send();
}

// dataURLtoBlob(
//   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
//   function (blob) {
//     console.log(blob);
//     return blob;
//   }
// );
