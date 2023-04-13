import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import ReactModal from 'react-modal';

import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import dayjs from 'dayjs';
// material
import {
  Chip,
  Card,
  Grid,
  Stack,
  Autocomplete,
  TextField,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  Select,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTimePicker, MobileDateTimePicker, DesktopDateTimePicker } from '@mui/lab';
import Style from './Modal.module.css';
import BSG from '../../../../assets/indications/bsg.pdf';
import ACG from '../../../../assets/indications/acg.pdf';
import Fig1 from '../../../../assets/indications/fig1.pdf';
import Fig2 from '../../../../assets/indications/fig2.pdf';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
FixedTags.propTypes = {
  label: PropTypes.string
};
function FixedTags({ label }) {
  const [value, setValue] = useState([]);

  return (
    <Autocomplete
      multiple
      id="fixed-tags-demo"
      value={value}
      onChange={(event, newValue) => {
        setValue([...newValue]);
      }}
      options={[]}
      getOptionLabel={(option) => option.title}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => <Chip key={option.title} label={option.title} {...getTagProps({ index })} />)
      }
      fullWidth
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
// ----------------------------------------------------------------------

ExploredItem.propTypes = {
  label: PropTypes.string,
  field: PropTypes.string,
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

export default function UserNewForm({ isEdit, formik }) {
  // const [alignment, setAlignment] = useState('explorer');

  // const handleChange = (event, newAlignment) => {
  //   setAlignment(newAlignment);
  // };
  // const navigate = useNavigate();
  // const { enqueueSnackbar } = useSnackbar();
  // const [preview, setPreview] = useState(false);
  // const [files, setFiles] = useState([]);

  // const handleDropMultiFile = useCallback(
  //   (acceptedFiles) => {
  //     setFiles(
  //       acceptedFiles.map((file) =>
  //         Object.assign(file, {
  //           preview: URL.createObjectURL(file)
  //         })
  //       )
  //     );
  //   },
  //   [setFiles]
  // );

  // const handleRemoveAll = () => {
  //   setFiles([]);
  // };

  // const handleRemove = (file) => {
  //   const filteredItems = files.filter((_file) => _file !== file);
  //   setFiles(filteredItems);
  // };
  const [modalVisible, setModalVisible] = useState(false);
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const indications = [
    'Prise en charge d’une hémorragie digestive',
    'Extraction d’un corps étranger',
    'Evaluation dans le cadre d’une ingestion de caustique',
    'Dilatation d’une sténose digestive',
    'Mise en place d’une prothèse pour une sténose digestive bénigne ou maligne',
    'Recherche d’une néoplasie (AEG avec symptomatologie digestive ou anémie ferriprive, découverte radiologique fortuite…)',
    'Dysphagie/Odynophagie',
    'Dysphagie/Odynophagie	RGO persistant ou récurrent malgré un traitement médical	Contrôle endoscopique d’un ulcère oesophagien après traitement par IPP',
    'Contrôle endoscopique d’un ulcère oesophagien après traitement par IPP',
    'Contrôle endoscopique d’une oesophagite grade D après traitement par IPP	Surveillance d’un endobrachyoesophage	Traitement endoscopique d’une achalasie (injection de toxine botulique, dilatation endoscopique, POEM)',
    'Surveillance d’un endobrachyoesophage',
    'Traitement endoscopique d’une achalasie (injection de toxine botulique, dilatation endoscopique, POEM)',
    'Epigastralgies ne répondant pas à un traitement médical, ou présence de signes d’alarme (âge>45ans, AEG, amaigrissement, saignement exteriorisé, anémie…)',
    'Vomissements persistants ne répondants pas un traitement symptomatique ou avec des signes d’alarme',
    'Surveillance d’une atrophie gastrique, métaplasie intestinale',
    'Polypes gastriques',
    'Bilan d’une hypertension portale',
    'Ligature élastique de varices oesophagiennes',
    'Colle biologique de varices gastriques',
    'Ligature élastique d’ectasies veineuses antrales gastriques',
    'Exploration d’une diarrhée chronique',
    'Bilan d’une polypose-adénomateurse-familiale',
    'Mise en place d’une gastro/jéjunostomie d’alimentation'
  ];
  //  const [date, setDate] = React.useState(dayjs('2022-04-17T15:30'));
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
  const classes = ['Aspirine', 'Antiagrégant plaquettaire', 'Anticoagulant oral', 'Anti vitamine K'];
  const [className, setClassName] = useState([]);
  const [diagnostiqueIndex, setDiagnostiqueIndex] = useState('-1');
  const [thérapeutiqueIndex, setThérapeutiqueIndex] = useState('-1');
  const [modalNumber, setModalNumber] = useState(0);
  function displayModal(number) {
    setModalNumber(number);
    setModalVisible(true);
  }
  const handleChangeRadioGroupDiagnostique = (event) => {
    console.log('value', event.target.value);
    setDiagnostiqueIndex(event.target.value);
    setFieldValue('diagnostiqueIndex', event.target.value, false);
  };
  const handleChangeRadioGroupThérapeutique = (event) => {
    console.log('value', event.target.value);
    setThérapeutiqueIndex(event.target.value);
    setFieldValue('thérapeutiqueIndex', event.target.value, false);
  };
  function getStyles(name, className) {
    return {
      fontWeight: className.indexOf(name) === -1 ? '300' : 'bold'
    };
  }

  const handleChangeClassName = (event) => {
    const {
      target: { value }
    } = event;

    console.log('val', value);
    console.log('className', typeof value === 'string' ? value.split(',') : value);
    const newArray = typeof value === 'string' ? value.split(',') : value;
    if (newArray.length < 3) {
      setClassName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value
      );
    }
  };

  function getModalContent() {
    switch (modalNumber) {
      case 0:
        return <Typography style={{ color: 'black' }}>Modal {modalNumber}</Typography>;
      case 1:
        return <Typography style={{ color: 'black' }}>Modal {modalNumber}</Typography>;
      default:
        break;
    }
  }
  return (
    <>
      <ReactModal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        // className="Modal"
        overlayClassName="Overlay"
        style={{
          content: {
            height: '50vh',
            width: '50vw',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, 20%)'
          }
          // content: { height: '100%', width: '100%' }
        }}
      >
        {getModalContent()}
        <Button variant="contained" title="Close" onClick={() => setModalVisible(false)}>
          <Typography>Close</Typography>
        </Button>
      </ReactModal>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Stack spacing={3}>
            <ExploredItem
              formik={formik}
              field="consentement"
              label="Consentement éclairé signé par le patient "
              noLabel="Non"
              yesLabel="Oui"
            />
            {/* <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography variant="h4">Antécédents</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="h6">Antécédents familiaux</Typography>
                  <TextField
                    select
                    fullWidth
                    {...getFieldProps('antecedentsFam')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.antecedentsFam && errors.antecedentsFam)}
                    helperText={touched.antecedentsFam && errors.antecedentsFam}
                  >
                    <option key="0" value="">
                      Pas d'antécédent familiale
                    </option>
                    {[
                      'Cancer digestif',
                      'Cancer non digestif',
                      'Maladie de crohn',
                      'Polypose adénomateuse familiale',
                      'Maladie coeliaque'
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                  {values.antecedentsFam === 'Cancer non digestif' && (
                    <TextField
                      fullWidth
                      label="Description du cancer non digestif"
                      {...getFieldProps('descAntecedentFam')}
                    />
                  )}
                  <Typography variant="h6">Antécédents personnels</Typography>
                  <TextField select fullWidth {...getFieldProps('antecedentsPerso')} SelectProps={{ native: true }}>
                    <option key="0" value="">
                      Pas d'antécédent personnel
                    </option>
                    {[
                      'Cancer digestif',
                      'Cancer non digestif',
                      'Maladie de crohn',
                      'Polypose adénomateuse familiale',
                      'Maladie coeliaque'
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                  {values.antecedentsPerso === 'Cancer non digestif' && (
                    <TextField
                      fullWidth
                      label="Description du cancer non digestif"
                      {...getFieldProps('descAntecedentPerso')}
                    />
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
         <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography variant="h4">Habitudes</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="h6">Consommation du tabac</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      inputMode="numeric"
                      label="Nombre de packets par année"
                      {...getFieldProps('nombrePacketTabac')}
                    />
                  </Stack>
                  <ExploredItem
                    formik={formik}
                    field="consoAlcool"
                    label="Consommation du l'alcool"
                    noLabel="Occasionnel"
                    yesLabel="Fréquent"
                  />
              
                  <Typography variant="h6">Autres</Typography>
                  <TextField fullWidth label="Autres habitudes" {...getFieldProps('autresHabitudes')} />
                </Stack>
              </AccordionDetails>
            </Accordion> */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography variant="h4">Traitements en cours</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                  <ExploredItem
                    formik={formik}
                    field="antiThrombotique"
                    label="Traitement anti thrombotique"
                    yesLabel="Oui"
                    noLabel="Non"
                  />
                  {values.antiThrombotique && (
                    <>
                      <Stack direction={{ xs: 'column', sm: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                        {/* <TextField fullWidth label="Classe" {...getFieldProps('antiCoagulantsClasse')} /> */}
                        <FormControl sx={{ width: '100%' }}>
                          <InputLabel id="demo-multiple-name-label">Classe</InputLabel>
                          <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={className}
                            onChange={handleChangeClassName}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                          >
                            {classes.map((name) => (
                              <MenuItem key={name} value={name} style={getStyles(name, className)}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {/* <TextField fullWidth label="Dose" {...getFieldProps('antiCoagulantsDose')} />
                        <TextField fullWidth label="Nombre de prise" {...getFieldProps('antiCoagulantsNb')} /> */}
                      </Stack>
                      <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                        <Typography variant="h6">Gestion des anticoagulants</Typography>
                        {/* <TextField
                          fullWidth
                          inputMode="numeric"
                          label="Arrêté depuis quand ?"
                          {...getFieldProps('antiCoagulantsGestionDebut')}
                        />
                        <TextField
                          fullWidth
                          inputMode="numeric"
                          label="A
                  reprendre quand après l’examen endoscopique ?"
                          {...getFieldProps('antiCoagulantsGestionFin')}
                        /> */}
                        <TextField
                          select
                          fullWidth
                          label="Gestion des anticoagulants"
                          {...getFieldProps('antiCoagulantsGestion')}
                          SelectProps={{ native: true }}
                        >
                          <option key="0" value="choisir" />
                          {['Maintenus', 'Arrêtés', 'Chevauchement'].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </TextField>
                      </Stack>
                    </>
                  )}
                  <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Button
                      sx={{ width: '50%', textAlign: 'center' }}
                      variant="contained"
                      href={BSG}
                      target="_blank"
                      rel="noreferrer"
                    >
                      BSG_ESGE : Antiplatelets and anticoagulation update 2021
                    </Button>

                    <Button
                      sx={{ width: '50%', textAlign: 'center' }}
                      variant="contained"
                      href={ACG}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ACG_CAG : Management of anticoagulant and antiplatelets in gastrointestinal bleeding and
                      periendoscopic period
                    </Button>
                  </Stack>
                  <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Button
                      sx={{ width: '50%', textAlign: 'center' }}
                      variant="contained"
                      href={Fig1}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Fig 1 : Guidelines for the management of patients on P2Y12 receptor antagonist antiplatelet agents
                      undergoing endoscopic procedures
                    </Button>
                    <Button
                      sx={{ width: '50%', textAlign: 'center' }}
                      variant="contained"
                      href={Fig2}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Fig 2 : Guidelines for the management of patients on warfarin or Direct Oral Anticoagulants (DOAC)
                      undergoing endoscopic procedures
                    </Button>
                  </Stack>
                  <Typography variant="h6">Autres</Typography>
                  <TextField fullWidth label="Autres traitements" {...getFieldProps('autresTraitements')} />
                </Stack>
              </AccordionDetails>
            </Accordion>
            {/* <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">Piéces a joindre</Typography>
              <UploadMultiFile
                showPreview={preview}
                files={files}
                onDrop={handleDropMultiFile}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
              />
            </Box> */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography variant="h4">Indications</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <ExploredItem
                    noLabel="FOGD diagnostique"
                    yesLabel="FOGD thérapeutique"
                    formik={formik}
                    field="typeIndication"
                    label="Catégorie d'indications"
                  />
                  {values.typeIndication ? (
                    <RadioGroup value={thérapeutiqueIndex} onChange={handleChangeRadioGroupThérapeutique}>
                      {FGDOthérapeutique.map((item, index) => (
                        <FormControlLabel key={index} value={index} control={<Radio />} label={item} />
                      ))}
                    </RadioGroup>
                  ) : (
                    <RadioGroup value={diagnostiqueIndex} onChange={handleChangeRadioGroupDiagnostique}>
                      {FGDOdiagnostique.map((item, index) => (
                        <FormControlLabel key={index} value={index} control={<Radio />} label={item} />
                      ))}
                    </RadioGroup>
                  )}
                </Stack>
                {/* <Typography variant="h5">
                  Indication choisie:{' '}
                  {values.typeIndication ? FGDOthérapeutique[thérapeutiqueIndex] : FGDOdiagnostique[diagnostiqueIndex]}
                </Typography> */}
                {values.typeIndication && thérapeutiqueIndex === '0' && (
                  <Stack spacing={3} style={{ marginTop: 20 }}>
                    {/* <MobileDateTimePicker
                      label="Date et heure de survenue"
                      value={date}
                      onChange={(newDate) => {
                        console.log('new date', newDate);
                        setDate(newDate);
                        formik.setFieldValue('dateHD', newDate);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    /> */}
                    <Typography variant="h5">Prise en charge</Typography>
                    <Stack spacing={{ xs: 3, sm: 2 }} style={{}}>
                      <ExploredItem noLabel="Non" yesLabel="Oui" formik={formik} field="ippHD" label="IPP" />
                      {values.ippHD && (
                        <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                          <TextField fullWidth label="Protocole IPP" {...getFieldProps('ippProtocolHD')} />
                        </Stack>
                      )}
                      <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="suspicionCirrhoseHD"
                        label="Suspicion d’hémorragie par hypertension portale "
                      />
                      {values.suspicionCirrhoseHD && (
                        <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                          <ExploredItem
                            noLabel="Non"
                            yesLabel="Oui"
                            formik={formik}
                            field="vasoactifHD"
                            label="Traitement vasoactif"
                          />
                          {values.vasoactifHD && (
                            <TextField
                              fullWidth
                              label="Traitement vasoactif: lequel/protocole/depuis"
                              {...getFieldProps('vasoactifDescHD')}
                            />
                          )}

                          <ExploredItem
                            noLabel="Non"
                            yesLabel="Oui"
                            formik={formik}
                            field="antibioprophylaxieHD"
                            label="Antibioprophylaxie"
                          />
                          {values.antibioprophylaxieHD && (
                            <TextField
                              fullWidth
                              label="Antibioprophylaxie: lequel/dose/depuis"
                              {...getFieldProps('antibioprophylaxieDescHD')}
                            />
                          )}
                        </Stack>
                      )}
                      {/* <ExploredItem
                        noLabel="Non"
                        yesLabel="Oui"
                        formik={formik}
                        field="transfusionHD"
                        label="Transfusion"
                      />
                      {values.transfusionHD && (
                        <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                          <TextField
                            fullWidth
                            label="Nombre de CGR Hémoglobine avant l’endoscopie"
                            {...getFieldProps('cgrHD')}
                          />
                        </Stack>
                      )} */}
                    </Stack>
                  </Stack>
                )}
                {values.typeIndication && thérapeutiqueIndex === '6' && (
                  <Stack spacing={{ xs: 3, sm: 2 }}>
                    <ExploredItem
                      noLabel="Non"
                      yesLabel="Oui"
                      formik={formik}
                      field="antibioprophylaxieJJA"
                      label="Antibioprophyaxie"
                    />
                    {values.antibioprophylaxieJJA && (
                      <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label="Antibioprophyaxie: lequel/dose/depuis"
                          {...getFieldProps('antibioprophylaxieDescJJA')}
                        />
                      </Stack>
                    )}
                  </Stack>
                )}
                <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }} style={{ marginTop: 20 }}>
                  <Typography variant="h6">Autres indications</Typography>
                  <TextField fullWidth label="Autres indications" {...getFieldProps('autresIndications')} />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
          {/* </Card> */}
        </Grid>
      </Grid>
    </>
  );
}
