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
              <TextField fullWidth label="Nom" {...getFieldProps('nom')} />
              <TextField fullWidth label="Prénom" {...getFieldProps('prenom')} />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                select
                fullWidth
                label="Genre"
                placeholder="Genre"
                {...getFieldProps('genre')}
                SelectProps={{ native: true }}
              >
                <option key="0" value="choisir genre" />
                {['Homme', 'Femme'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Age"
                {...getFieldProps('age')}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                select
                fullWidth
                label="Service d'origine"
                {...getFieldProps('serviceOrigine')}
                SelectProps={{ native: true }}
              >
                <option key="0" value="choisir service" />
                {[
                  'Service des urgences',
                  'Service de chirurgie générale',
                  'Service de gastroentérologie',
                  'Consultation externe de gastroentérologie',
                  'Service de médecine'
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
              <TextField fullWidth label="Numéro de téléphone" {...getFieldProps('numTel')} />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField fullWidth label="Numéro de dossier médical" {...getFieldProps('numDoss')} />
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
