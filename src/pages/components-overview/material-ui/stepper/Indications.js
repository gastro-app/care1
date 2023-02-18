import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
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
  RadioGroup
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTimePicker, MobileDateTimePicker, DesktopDateTimePicker } from '@mui/lab';
// utils
import fakeRequest from '../../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { UploadMultiFile } from '../../../../components/upload';

//

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
  const [indicationIndex, setIndicationIndex] = useState('0');

  const handleChangeRadioGroup = (event) => {
    console.log('value', event.target.value);
    setIndicationIndex(event.target.value);
    setFieldValue('indications', event.target.value, false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        {/* <Card sx={{ py: 3 }}> */}
        <Stack spacing={3}>
          <ExploredItem
            formik={formik}
            field="consentement"
            label="Consentement éclairé signé par le patient "
            noLabel="Non"
            yesLabel="Oui"
          />
          <Accordion>
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
                {/* {values.consoAlcool && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      inputMode="numeric"
                      label="Nombre de bières par jour"
                      {...getFieldProps('nombreBiereParJour')}
                    />
                    <TextField
                      fullWidth
                      inputMode="numeric"
                      label="Nombre de jour de consommation par semaine"
                      {...getFieldProps('nombreDeJourConsoAlcoolParSemaine')}
                    />
                  </Stack>
                )} */}
                <Typography variant="h6">Autres</Typography>
                <TextField fullWidth label="Autres habitudes" {...getFieldProps('autresHabitudes')} />
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="h4">Traitements en cours</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                <ExploredItem
                  formik={formik}
                  field="antiCoagulants"
                  label="Anticoagulants"
                  yesLabel="Oui"
                  noLabel="Non"
                />
                {values.antiCoagulants && (
                  <>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField fullWidth label="Classe" {...getFieldProps('antiCoagulantsClasse')} />
                      <TextField fullWidth label="Dose" {...getFieldProps('antiCoagulantsDose')} />
                      <TextField fullWidth label="Nombre de prise" {...getFieldProps('antiCoagulantsNb')} />
                    </Stack>
                    <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                      <Typography variant="h6">Gestion des anticoagulants</Typography>
                      <TextField
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
                      />
                    </Stack>
                  </>
                )}
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
                <RadioGroup value={indicationIndex} onChange={handleChangeRadioGroup}>
                  {indications.map((item, index) => (
                    <FormControlLabel key={index} value={index} control={<Radio />} label={item} />
                  ))}
                </RadioGroup>
              </Stack>

              {indicationIndex === '0' && (
                <Stack spacing={3} style={{ marginTop: 20 }}>
                  <Typography variant="h5">Indication choisie: {indications[0]}</Typography>
                  <DateTimePicker
                    label="Date et heure de survenue"
                    value={values.dateHémoragieDigestive}
                    onChange={(event, newAlignment) => {
                      formik.setFieldValue('dateHémoragieDigestive', newAlignment);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
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
                      label="Suspicion de cirrhose"
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
                    <ExploredItem
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
                    )}
                  </Stack>
                </Stack>
              )}

              {indicationIndex === '22' && (
                <Stack spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="h5">Indication choisie: {indications[22]}</Typography>
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
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
        {/* </Card> */}
      </Grid>
    </Grid>
  );
}
