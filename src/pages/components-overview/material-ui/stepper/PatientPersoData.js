import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
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
  Switch
} from '@mui/material';
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
function ExploredItem({ label, formik }) {
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const [alignment, setAlignment] = useState('Non Exploré');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{label}</Typography>
        <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleChange} aria-label="Platform">
          <ToggleButton value="Exploré">Exploré</ToggleButton>
          <ToggleButton value="Non Exploré">Non Exploré</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {alignment === 'Exploré' && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
          <TextField
            fullWidth
            multiline
            label={label}
            {...getFieldProps(label)}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        </Stack>
      )}
    </>
  );
}

PatientPersoData.propTypes = {
  isEdit: PropTypes.bool,
  formik: PropTypes.object
};

export default function PatientPersoData({ isEdit, formik }) {
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label="Nom"
                {...getFieldProps('nom')}
                error={Boolean(touched.nom && errors.nom)}
                helperText={touched.nom && errors.nom}
              />
              <TextField
                fullWidth
                label="Prénom"
                {...getFieldProps('prenom')}
                error={Boolean(touched.prenom && errors.prenom)}
                helperText={touched.prenom && errors.prenom}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label="Age"
                {...getFieldProps('age')}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                error={Boolean(touched.age && errors.age)}
                helperText={touched.age && errors.age}
              />
              <TextField
                select
                fullWidth
                label="Genre"
                placeholder="Genre"
                {...getFieldProps('genre')}
                SelectProps={{ native: true }}
                error={Boolean(touched.genre && errors.genre)}
                helperText={touched.genre && errors.genre}
              >
                <option key="0" value="choisir" />
                {['Homme', 'Femme'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label="Adresse"
                {...getFieldProps('adresse')}
                error={Boolean(touched.adresse && errors.adresse)}
                helperText={touched.adresse && errors.adresse}
              />
              <TextField
                fullWidth
                label="Numéro de téléphone"
                {...getFieldProps('numTel')}
                error={Boolean(touched.numTel && errors.numTel)}
                helperText={touched.numTel && errors.numTel}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label="Numéro de dossier médical"
                {...getFieldProps('numDoss')}
                error={Boolean(touched.numDoss && errors.numDoss)}
                helperText={touched.numDoss && errors.numDoss}
              />
            </Stack>
            {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                multiline
                fullWidth
                label="antecedents"
                {...getFieldProps('antecedents')}
                error={Boolean(touched.antecedents && errors.antecedents)}
                helperText={touched.antecedents && errors.antecedents}
              />
            </Stack> */}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
