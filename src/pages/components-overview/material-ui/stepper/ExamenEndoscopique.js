import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
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
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTimePicker, MobileDateTimePicker, DesktopDateTimePicker } from '@mui/lab';
import dayjs from 'dayjs';
import Style from './Modal.module.css';
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
// utils
import fakeRequest from '../../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { UploadMultiFile } from '../../../../components/upload';

//
// ----------------------------------------------------------------------

ExploredItem.propTypes = {
  label: PropTypes.string,
  formik: PropTypes.object
};

// function ExploredItem({ labelExplored, value, label, formik }) {
//   const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

//   const handleChange = (event, newAlignment) => {
//     formik.setFieldValue(labelExplored, newAlignment);
//   };
//   return (
//     <>
//       <Box sx={{ flexGrow: 1 }}>
//         <Typography variant="h5">{label}</Typography>
//         <ToggleButtonGroup
//           color="primary"
//           value={values[labelExplored]}
//           exclusive
//           onChange={handleChange}
//           aria-label="Platform"
//         >
//           <ToggleButton value="Exploré">Exploré</ToggleButton>
//           <ToggleButton value="Non Exploré">Non Exploré</ToggleButton>
//         </ToggleButtonGroup>
//       </Box>
//       {values[labelExplored] === 'Exploré' && (
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
//           <TextField
//             fullWidth
//             multiline
//             label={label}
//             {...getFieldProps(value)}
//             error={Boolean(touched[value] && errors[value])}
//             helperText={touched[value] && errors[value]}
//           />
//         </Stack>
//       )}
//     </>
//   );
// }
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

export default function UserNewForm({ isEdit, formik }) {
  // const handleChange = (event, newAlignment) => {
  //   formik.setFieldValue('FOGDEstomac', newAlignment);
  // };

  const [alignment, setAlignment] = useState('explorer');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNumber, setModalNumber] = useState(0);
  function displayModal(number) {
    setModalNumber(number);
    setModalVisible(true);
  }
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [preview, setPreview] = useState(false);
  const [files, setFiles] = useState([]);
  const [date, setDate] = React.useState(dayjs('2022-04-17T15:30'));
  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFiles]
  );

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
      default:
        break;
    }
  }
  const isModalWide = modalNumber === 1 || modalNumber === 2 || modalNumber === 4;
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
            width: isModalWide ? '55vw' : '40vw',
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
                <ExploredItem
                  noLabel="Non"
                  yesLabel="Oui"
                  formik={formik}
                  field="examenPhysiqueInterrogatoire"
                  label="Examen physique et interrogatoire "
                />
                <TextField
                  fullWidth
                  multiline
                  label="Délai entre la demande de l’examen et sa réalisation "
                  {...getFieldProps('délaiExamen')}
                />
                <MobileDateTimePicker
                  label="Date et heure de l'examen"
                  value={date}
                  onChange={(newDate) => {
                    setDate(newDate);
                    formik.setFieldValue('dateExamen', newDate);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />

                <ExploredItem
                  noLabel="Non"
                  yesLabel="Oui"
                  formik={formik}
                  field="prémédicationIndication"
                  label="Pré médication"
                />
                {values.prémédicationIndication && (
                  <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField fullWidth label="Pré médication" {...getFieldProps('prémédicationIndicationDesc')} />
                  </Stack>
                )}
                <ExploredItem
                  noLabel="Non"
                  yesLabel="Oui"
                  formik={formik}
                  field="consoTabacAvantExamen"
                  label="Patient ayant reçu les instructions appropriées du jeûne"
                />
                <ExploredItem
                  noLabel="Non"
                  yesLabel="Oui"
                  formik={formik}
                  field="jeuneExamen"
                  label="Patient à jeûne"
                />
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
                      label="Protocole examen avant sédation"
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
                          label="Description des anomalies"
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
                  label="Choisir type de l'endoscope"
                >
                  <option key="0" value="" />
                  {[
                    'Olympus GIF-Q150 2206251',
                    'Olympus GIF-Q150 2620604',
                    'Olympus GIF-H180',
                    'Olympus GIF-H170 (EXERA III)'
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
                <ExploredItem noLabel="Non" yesLabel="Oui" formik={formik} field="pince" label="Pince" />
                {values.pince && (
                  <ExploredItem noLabel="Unique" yesLabel="Multiple" formik={formik} field="usagePince" label="Usage" />
                )}
                <TextField
                  select
                  fullWidth
                  label="Autres Materiels"
                  SelectProps={{ native: true }}
                  {...getFieldProps('autresMateriels')}
                >
                  <option key="0" value="" />
                  {[
                    'Clips d’hémostase',
                    'Kit de ligature élastique des varices oesophagiennes',
                    'Aiguille d’injection',
                    'Pince froide',
                    'Pince chaude',
                    'Anse à polypectomie à panier de type Dormia',
                    'Autres'
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
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
                    <TextField fullWidth label="Exploration Œsophage" {...getFieldProps('osophageDesc')} />
                    <ExploredItem
                      noLabel="Non"
                      yesLabel="Oui"
                      formik={formik}
                      field="osoBiopsies"
                      label="Biopsises Œsophage"
                    />
                    {values.osoBiopsies && (
                      <TextField
                        fullWidth
                        label="Biopsises Œsophage: nombre de biopsies, nombre de tubes, selon le 
                  Protocole de seattle si EBO"
                        {...getFieldProps('osoBiopsiesDesc')}
                      />
                    )}
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
                  </Stack>
                )}

                <ExploredItem noLabel="Non exploré" yesLabel="Exploré" formik={formik} field="cardia" label="Cardia" />
                {values.cardia && <TextField fullWidth label="Exploration Cardia" {...getFieldProps('cardiaDesc')} />}

                <Typography variant="h4">Estomac</Typography>
                <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Lac muqueux "
                    SelectProps={{ native: true }}
                    {...getFieldProps('lacMuqueux')}
                  >
                    <option key="0" value="" />
                    {[
                      'Claire',
                      'Sale avec présence de débris alimentaire',
                      'Mousseux',
                      'Bilieux',
                      'Normo-abondant',
                      'Abondant'
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                  <ExploredItem
                    noLabel="Non exploré"
                    yesLabel="Exploré"
                    formik={formik}
                    field="fundus"
                    label="Fundus"
                  />
                  {values.fundus && <TextField fullWidth label="Exploration Fundus" {...getFieldProps('fundusDesc')} />}
                  <ExploredItem noLabel="Non exploré" yesLabel="Exploré" formik={formik} field="antre" label="Antre" />
                  {values.antre && <TextField fullWidth label="Exploration Antre" {...getFieldProps('antreDesc')} />}
                  <ExploredItem
                    noLabel="Non exploré"
                    yesLabel="Exploré"
                    formik={formik}
                    field="pylore"
                    label="Pylore"
                  />
                  {values.pylore && <TextField fullWidth label="Exploration Pylore" {...getFieldProps('pyloreDesc')} />}
                  <ExploredItem noLabel="Non" yesLabel="Oui" formik={formik} field="estoBiopsies" label="Biopsies" />
                  {values.estoBiopsies && (
                    <TextField
                      fullWidth
                      label="Biopsies estomac: nombre et localisation, nombre de tubes"
                      {...getFieldProps('estoBiopsiesDesc')}
                    />
                  )}
                  <ExploredItem noLabel="Non exploré" yesLabel="Exploré" formik={formik} field="bulbe" label="Bulbe" />
                  {values.bulbe && (
                    <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField fullWidth label="Exploration bulbe" {...getFieldProps('bulbeDesc')} />
                      <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="bulbeBiopsies"
                        label="Biopsies bulbe"
                      />
                      {values.bulbeBiopsies && (
                        <TextField fullWidth label="Biopsies bulbe: nombre " {...getFieldProps('bulbeBiopsiesDesc')} />
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
                      <TextField fullWidth label="Exploration duodénum" {...getFieldProps('duodénumDesc')} />
                      <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="duodénumBiopsies"
                        label="Biopsies duodénum"
                      />
                      {values.duodénumBiopsies && (
                        <TextField
                          fullWidth
                          label="Biopsies duodénum: nombre "
                          {...getFieldProps('duodénumBiopsiesDesc')}
                        />
                      )}
                    </Stack>
                  )}
                  <ExploredItem
                    noLabel="Non"
                    yesLabel="Oui"
                    formik={formik}
                    field="zoneMalExploré"
                    label="Y a-t-il des zones non ou mal explorées?"
                  />
                  {values.zoneMalExploré && (
                    <TextField
                      select
                      fullWidth
                      {...getFieldProps('indexZoneMalExploré')}
                      SelectProps={{ native: true }}
                    >
                      <option key="0" value="">
                        Choisir zone mal exploré
                      </option>
                      {[
                        'Œsophage supérieur',
                        'Œsophage inférieur',
                        'Ligne Z et sommet des plis gastriques',
                        'Cardia, fundus et la petite courbure en rétroversion',
                        'Antre',
                        'L’angle de la petite  courbure en rétrovision',
                        'Bulbe',
                        'DI, DII'
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                  )}
                </Stack>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">Images prises durant l’examen endoscopiques</Typography>
                  <UploadMultiFile
                    showPreview={preview}
                    files={files}
                    onDrop={handleDropMultiFile}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                  />
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
          {/* */}
          {/* <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="h4">FOGD</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Typography variant="h5">Information générale</Typography>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h5">sous anesthésie générale</Typography>
                      <ToggleButtonGroup
                        color="primary"
                        exclusive
                        value={values.FOGDsag}
                        onChange={(event, newAlignment) => {
                          formik.setFieldValue('FOGDsag', newAlignment);
                        }}
                        aria-label="Platform"
                      >
                        <ToggleButton value="Oui">Oui</ToggleButton>
                        <ToggleButton value="Non">Non</ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <DateTimePicker
                      label="date de l'examen"
                      value={values.FOGDDateExam}
                      onChange={(event, newAlignment) => {
                        formik.setFieldValue('FOGDDateExam', newAlignment);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      label="Durée de l'examen"
                      {...getFieldProps('FOGDDureExam')}
                      error={Boolean(touched.FOGDDureExam && errors.FOGDDureExam)}
                      helperText={touched.FOGDDureExam && errors.FOGDDureExam}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Typography variant="h5">Materials</Typography>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      label="endoscope"
                      {...getFieldProps('FOGDendoscope')}
                      error={Boolean(touched.FOGDendoscope && errors.FOGDendoscope)}
                      helperText={touched.FOGDendoscope && errors.FOGDendoscope}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      label="pince"
                      {...getFieldProps('FOGDpince')}
                      error={Boolean(touched.FOGDpince && errors.FOGDpince)}
                      helperText={touched.FOGDpince && errors.FOGDpince}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      label="autres"
                      {...getFieldProps('FOGDautres')}
                      error={Boolean(touched.FOGDautres && errors.FOGDautres)}
                      helperText={touched.FOGDautres && errors.FOGDautres}
                    />
                  </Stack>
                  <ExploredItem
                    labelExplored="FOGDOesophageExplored"
                    label="FOGD Oesophage"
                    value="FOGDOesophage"
                    formik={formik}
                  />
                  <ExploredItem
                    labelExplored="FOGDCardiaExplored"
                    label="FOGD Cardia"
                    value="FOGDCardia"
                    formik={formik}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5">Estomac</Typography>
                    <ToggleButtonGroup
                      color="primary"
                      value={values.FOGDEstomac}
                      exclusive
                      onChange={handleChange}
                      aria-label="Platform"
                    >
                      <ToggleButton value="Exploré">Exploré</ToggleButton>
                      <ToggleButton value="Non Exploré">Non Exploré</ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                  {values.FOGDEstomac === 'Exploré' && (
                    <>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label="fundus"
                          {...getFieldProps('FOGDfundus')}
                          error={Boolean(touched.FOGDfundus && errors.FOGDfundus)}
                          helperText={touched.FOGDfundus && errors.FOGDfundus}
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label="antre"
                          {...getFieldProps('FOGDantre')}
                          error={Boolean(touched.FOGDantre && errors.FOGDantre)}
                          helperText={touched.FOGDantre && errors.FOGDantre}
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <FormControlLabel
                          checked={values.biopsie}
                          onChange={(e, newValue) => formik.setFieldValue('FOGDBiopsie', newValue)}
                          control={<Switch />}
                          label="Biopsie"
                          labelPlacement="start"
                        />
                      </Stack>
                    </>
                  )}
                  <ExploredItem
                    labelExplored="FOGDpyloreExplored"
                    label="FOGD pylore"
                    value="FOGDpylore"
                    formik={formik}
                  />
                  <ExploredItem
                    labelExplored="FOGDdidiiExplored"
                    label="FOGD DIDII"
                    value="FOGDdidii"
                    formik={formik}
                  />
                </>
              </Stack>
            </Card>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="h4">Coloscopie</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Typography variant="h5">Materials</Typography>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      label="endoscope"
                      {...getFieldProps('Coloscopieendoscope')}
                      error={Boolean(touched.Coloscopieendoscope && errors.Coloscopieendoscope)}
                      helperText={touched.Coloscopieendoscope && errors.Coloscopieendoscope}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      label="pince"
                      {...getFieldProps('Coloscopiepince')}
                      error={Boolean(touched.Coloscopiepince && errors.Coloscopiepince)}
                      helperText={touched.Coloscopiepince && errors.Coloscopiepince}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      label="autres"
                      {...getFieldProps('Coloscopieautres')}
                      error={Boolean(touched.Coloscopieautres && errors.Coloscopieautres)}
                      helperText={touched.Coloscopieautres && errors.Coloscopieautres}
                    />
                  </Stack>
                  <Typography variant="h5">BOSTON</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Colon gauche"
                      placeholder="Colon gauche"
                      {...getFieldProps('ColoscopieColonGauche')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.ColoscopieColonGauche && errors.ColoscopieColonGauche)}
                      helperText={touched.ColoscopieColonGauche && errors.ColoscopieColonGauche}
                    >
                      <option value="" />
                      {['1', '2', '3'].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Colon Transverse"
                      placeholder="Colon Transverse"
                      {...getFieldProps('ColoscopieColonTansverse')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.ColoscopieColonTansverse && errors.ColoscopieColonTansverse)}
                      helperText={touched.ColoscopieColonTansverse && errors.ColoscopieColonTansverse}
                    >
                      <option value="" />
                      {['1', '2', '3'].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Colon droit"
                      placeholder="Colon droit"
                      {...getFieldProps('ColoscopieColonDroit')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.ColoscopieColonDroit && errors.ColoscopieColonDroit)}
                      helperText={touched.ColoscopieColonDroit && errors.ColoscopieColonDroit}
                    >
                      <option value="" />
                      {['1', '2', '3'].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Préparation"
                      placeholder="Préparation"
                      {...getFieldProps('ColoscopiePreparation')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.ColoscopiePreparation && errors.ColoscopiePreparation)}
                      helperText={touched.ColoscopiePreparation && errors.ColoscopiePreparation}
                    >
                      <option value="" />
                      {['bonne', 'moyenne', 'mauvaise'].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                  </Stack>
                  <ExploredItem
                    labelExplored="ColoscopieIleonExplored"
                    value="ColoscopieIleon"
                    label="Iléon"
                    formik={formik}
                  />
                  <ExploredItem
                    labelExplored="ColoscopieBasFondCaecalExplored"
                    value="ColoscopieBasFondCaecal"
                    label="Bas fond caecal"
                    formik={formik}
                  />
                  <ExploredItem
                    labelExplored="ColoscopieColonDroitTextExplored"
                    value="ColoscopieColonDroitText"
                    label="Colon droit"
                    formik={formik}
                  />
                  <ExploredItem
                    labelExplored="ColoscopieColonTansverseTextExplored"
                    value="ColoscopieColonTansverseText"
                    label="Colon Transverse"
                    formik={formik}
                  />
                  <ExploredItem
                    labelExplored="ColoscopieColonGaucheTextExplored"
                    value="ColoscopieColonGaucheText"
                    label="Colon gauche"
                    formik={formik}
                  />
                  <ExploredItem
                    labelExplored="ColoscopieRectumExplored"
                    value="ColoscopieRectum"
                    label="Rectum"
                    formik={formik}
                  />
                </>
              </Stack>
            </Card>
          </AccordionDetails>
        </Accordion> */}
        </Grid>
      </Grid>
    </>
  );
}
