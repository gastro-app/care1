import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useState, useCallback, useEffect } from 'react';
import { isArray } from 'lodash';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
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
  Switch,
  Select,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem
} from '@mui/material';
import MultiSelect from './MultiSelect';

ExploredItem.propTypes = {
  label: PropTypes.string,
  formik: PropTypes.object
};
// function ExploredItem({ label, formik }) {
//   const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
//   const [alignment, setAlignment] = useState('Non Exploré');

//   const handleChange = (event, newAlignment) => {
//     setAlignment(newAlignment);
//   };
//   return (
//     <>
//       <Box sx={{ flexGrow: 1 }}>
//         <Typography variant="subtitle2">{label}</Typography>
//         <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleChange} aria-label="Platform">
//           <ToggleButton value="Exploré">Exploré</ToggleButton>
//           <ToggleButton value="Non Exploré">Non Exploré</ToggleButton>
//         </ToggleButtonGroup>
//       </Box>
//       {alignment === 'Exploré' && (
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
//           <TextField
//             fullWidth
//             multiline
//             label={label}
//             {...getFieldProps(label)}
//             error={Boolean(touched.email && errors.email)}
//             helperText={touched.email && errors.email}
//           />
//         </Stack>
//       )}
//     </>
//   );
// }

function ExploredItem({ label, field, formik, yesLabel, noLabel }) {
  const { setFieldValue } = formik;
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event, checked) => {
    setIsChecked(checked);
    setFieldValue(field, checked, false);
  };
  return (
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
  );
}
UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  formik: PropTypes.object
};

export default function UserNewForm({ isEdit, formik }) {
  const { values, getFieldProps, setFieldValue } = formik;
  const [conclusionText, setConclusionText] = useState('');

  const optionsSeniors = ['Dr Enaifer', 'Dr Bougassas', 'Dr Ben Nejma', 'Dr Bouchabou', 'Dr Hemdani', 'Dr Nakhli'];
  const optionsResidents = [
    'Rste Medhioub',
    'Rste Smaoui',
    'Rste Kefi',
    'Rste Ben Safta',
    'Rste Ghanouchi',
    'Rste Mbarek'
  ];
  const optionsTechniciens = [
    'Assili Nader',
    'Amri Wajdi',
    'Sellami Aroua',
    'Jarroudi Hassen',
    'Abdelhafidh Hermi',
    'Nouri Meriem'
  ];
  useEffect(() => {
    // console.log(values.osoConclusion);
    // console.log(values.osoConclusion);
    const a1 = isArray(values.osoConclusion) ? values.osoConclusion : [];
    const a2 = isArray(values.cardiaConclusion) ? values.cardiaConclusion : [];
    const a3 = isArray(values.fundusConclusion) ? values.fundusConclusion : [];
    const a4 = isArray(values.pyloreConclusion) ? values.pyloreConclusion : [];
    const a5 = isArray(values.bulbeConclusion) ? values.bulbeConclusion : [];
    const a6 = isArray(values.duodénumConclusion) ? values.duodénumConclusion : [];

    const array = [
      // { content: '- Conclusion Oseophage' },
      ...a1,
      // { content: '- Conclusion Cardia' },
      ...a2,
      // { content: '- Conclusion Fundus' },
      ...a3,
      // { content: '- Conclusion Pylore' },
      ...a4,
      // { content: '- Conclusion Bulbe' },
      ...a5,
      // { content: '- Conclusion Duodénum' },
      ...a6
    ];
    let string = '';
    array.forEach((e) => {
      string += `${e.content}\n`;
    });
    setConclusionText(string);
    setFieldValue('conclusion', string);
  }, []);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
              <ExploredItem noLabel="Non" yesLabel="Oui" formik={formik} field="FOGDtotale" label="FOGD totale" />
              <TextField fullWidth label="Durée de l’examen endoscopique" {...getFieldProps('duréeExamen')} />
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
              <ExploredItem
                noLabel="Non"
                yesLabel="Oui"
                formik={formik}
                field="chromoendoscopie"
                label="Chromoendoscopie vituelle ou au lugol"
              />
              {values.chromoendoscopie && (
                <TextField
                  fullWidth
                  label="Chromoendoscopie vituelle ou au lugol: pourquoi"
                  {...getFieldProps('chromoendoscopieDesc')}
                />
              )}
              <ExploredItem noLabel="Non" yesLabel="Oui" formik={formik} field="biopsies" label="Biopsies" />
              {values.biopsies && (
                <TextField
                  fullWidth
                  label="Biopsies: nombre (), nombre de tubes ()"
                  {...getFieldProps('biopsiesDesc')}
                />
              )}
              {/* TODO display all conclusion */}
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Conclusion"
                {...getFieldProps('conclusion')}
                value={conclusionText}
                onChange={(e) => {
                  setConclusionText(e.target.value);
                  setFieldValue('conclusion', e.target.value);
                }}
              />
              <TextField fullWidth multiline minRows={4} label="CAT" {...getFieldProps('CAT')} />
              <MultiSelect
                label="Séniors"
                options={optionsSeniors}
                setFieldValue={setFieldValue}
                formikValue="seniors"
                limit={3}
              />
              <MultiSelect
                label="Résidents"
                options={optionsResidents}
                setFieldValue={setFieldValue}
                formikValue="residents"
                limit={3}
              />
              <MultiSelect
                label="Techniciens"
                options={optionsTechniciens}
                setFieldValue={setFieldValue}
                formikValue="techniciens"
                limit={3}
              />

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Ressenti du patient"
                {...getFieldProps('ressentiPatient')}
              />

              {values.sédationExamen && (
                <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                  <ExploredItem
                    noLabel="Non"
                    yesLabel="Oui"
                    formik={formik}
                    field="complicationSedation"
                    label="Complications de la sédation"
                  />
                  {values.complicationSedation && (
                    <TextField
                      fullWidth
                      label="Complications de la sédation"
                      {...getFieldProps('complicationSedationDesc')}
                    />
                  )}
                </Stack>
              )}
              <ExploredItem
                noLabel="Non"
                yesLabel="Oui"
                formik={formik}
                field="complicationEndo"
                label="Complications de l’examen endoscopique"
              />
              {values.complicationEndo && (
                <TextField
                  fullWidth
                  label="Complications de l’examen endoscopique"
                  {...getFieldProps('complicationEndoDesc')}
                />
              )}
              <ExploredItem
                noLabel="Non"
                yesLabel="Oui"
                formik={formik}
                field="necessiteHospitalisation"
                label="Nécessité d’une hospitalisation pour surveillance"
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
