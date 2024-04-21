/* eslint-disable */
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
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
import MultiSelect from './MultiSelect';
import moment from 'moment';

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
const gestionAntiCoagulants = ['Maintenus', 'Arrêtés', 'Chevauchement', 'Autres'];
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
  const { setFieldValue } = formik;
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
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  //  const [date, setDate] = React.useState(dayjs('2022-04-17T15:30'));
  const [date, setDate] = React.useState(new Date());
  const [diagnostiqueIndex, setDiagnostiqueIndex] = useState([]);
  const [thérapeutiqueIndex, setThérapeutiqueIndex] = useState([]);
  const handleChangeRadioGroupDiagnostique = (event) => {
    console.log('value', event.target.value);
    const value = parseInt(event.target.value);
    const array = [...diagnostiqueIndex];
    const index = array.findIndex((e) => e === value);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(value);
    }
    const set = [...new Set(array)].sort((a, b) => a - b);
    console.log('diagnostiqueIndex', set);
    setDiagnostiqueIndex(set);
    setFieldValue('diagnostiqueIndex', set, false);
  };
  const handleChangeRadioGroupThérapeutique = (event) => {
    console.log('value', event.target.value);
    const value = parseInt(event.target.value);
    const array = [...thérapeutiqueIndex];
    const index = array.findIndex((e) => e === value);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(value);
    }
    const set = [...new Set(array)].sort((a, b) => a - b);
    console.log('thérapeutiqueIndex', set);
    setThérapeutiqueIndex(set);
    setFieldValue('thérapeutiqueIndex', set, false);
  };
  const checkIndiction = useCallback(
    (isThérapeutique, i) => {
      if (isThérapeutique) {
        const index = thérapeutiqueIndex.findIndex((e) => e === i);
        if (index > -1) {
          return true;
        }
        return false;
      } else {
        const index = diagnostiqueIndex.findIndex((e) => e === i);
        if (index > -1) {
          return true;
        }
        return false;
      }
    },
    [thérapeutiqueIndex, diagnostiqueIndex]
  );
  useEffect(() => {
    setThérapeutiqueIndex([]);
    setDiagnostiqueIndex([]);
  }, [values.typeIndication]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Stack spacing={3}>
          <ExploredItem
            noLabel="Non"
            yesLabel="Oui"
            formik={formik}
            field="examenPhysiqueInterrogatoire"
            label="Examen physique et interrogatoire "
          />
          <MobileDateTimePicker
            label="Date et heure de l'examen"
            value={date}
            onChange={(newDate) => {
              console.log('newDate', moment(newDate).format('DD-MM-YYYY HH:MM'));
              setDate(moment(newDate));
              setFieldValue('dateExamen', moment(newDate).format('DD-MM-YYYY HH:MM'));
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <ExploredItem
            formik={formik}
            field="consentement"
            label="Consentement éclairé du patient"
            noLabel="Non"
            yesLabel="Oui"
          />
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="h4">Traitements en cours</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                <ExploredItem
                  formik={formik}
                  field="antiThrombotique"
                  label="Traitement anti coagulant"
                  yesLabel="Oui"
                  noLabel="Non"
                />
                {values.antiThrombotique && (
                  <>
                    <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                      <MultiSelect
                        label="Classe des anti coagulants"
                        options={classes}
                        formikValue="antiCoagulantsClasse"
                        setFieldValue={setFieldValue}
                        limit={3}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                      <Typography variant="h6">Gestion des anticoagulants</Typography>
                      <TextField
                        select
                        fullWidth
                        label="Gestion des anticoagulants"
                        {...getFieldProps('antiCoagulantsGestion')}
                        SelectProps={{ native: true }}
                      >
                        <option key="0" value="choisir" />
                        {gestionAntiCoagulants.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </TextField>
                      {values.antiCoagulantsGestion.includes('Autres') && (
                        <TextField fullWidth label="Autres" {...getFieldProps('antiCoagulantsClasseDesc')} />
                      )}
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
                  label=""
                />
                {values.typeIndication ? (
                  <FormGroup value={thérapeutiqueIndex} onChange={handleChangeRadioGroupThérapeutique}>
                    {FGDOthérapeutique.map((item, index) => (
                      <FormControlLabel key={index} value={index} control={<Checkbox />} label={item} />
                    ))}
                  </FormGroup>
                ) : (
                  <FormGroup value={diagnostiqueIndex} onChange={handleChangeRadioGroupDiagnostique}>
                    {FGDOdiagnostique.map((item, index) => (
                      <FormControlLabel key={`${index}00`} value={index} control={<Checkbox />} label={item} />
                    ))}
                  </FormGroup>
                )}
              </Stack>

              {values.typeIndication && checkIndiction(true, 0) && (
                <Stack spacing={3} style={{ marginTop: 20 }}>
                  <Typography variant="h5">Prise en charge</Typography>
                  <Stack spacing={{ xs: 3, sm: 2 }} style={{}}>
                    <ExploredItem noLabel="Non" yesLabel="Oui" formik={formik} field="ippHD" label="IPP" />

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
                        <ExploredItem
                          noLabel="Non"
                          yesLabel="Oui"
                          formik={formik}
                          field="antibioprophylaxieHD"
                          label="Antibioprophylaxie"
                        />
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              )}
              {!values.typeIndication && checkIndiction(false, 4) && (
                <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }} sx={{ mt: '1vh' }}>
                  {/* <MultiSelect
                    label="Surveillance d’une lésion prénéoplasique"
                    options={['Atrophie', 'Métaplasie intestinale']}
                    formikValue="surveillanceLesionDesc"
                    setFieldValue={setFieldValue}
                    limit={2}
                  /> */}
                  <TextField
                    fullWidth
                    label="Surveillance d’une lésion prénéoplasique"
                    {...getFieldProps('surveillanceLesionDesc')}
                  />
                </Stack>
              )}
              {values.typeIndication && checkIndiction(true, 6) && (
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
      </Grid>
    </Grid>
  );
}
