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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Switch
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
function ExploredItem({ labelExplored, value, label, formik }) {
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleChange = (event, newAlignment) => {
    formik.setFieldValue(label, newAlignment);
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5">{label}</Typography>
        <ToggleButtonGroup
          color="primary"
          value={values[labelExplored]}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="Exploré">Exploré</ToggleButton>
          <ToggleButton value="Non Exploré">Non Exploré</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {values[labelExplored] === 'Exploré' && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
          <TextField
            fullWidth
            multiline
            label={label}
            {...getFieldProps(value)}
            error={Boolean(touched[value] && errors[value])}
            helperText={touched[value] && errors[value]}
          />
        </Stack>
      )}
    </>
  );
}

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  formik: PropTypes.object
};

export default function UserNewForm({ isEdit, formik }) {
  const [alignment, setAlignment] = useState('Non Exploré');

  const handleChange = (event, newAlignment) => {
    formik.setFieldValue('FOGDEstomac', newAlignment);
  };
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="h4">FOGD</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <>
                  {' '}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label="Materials"
                      {...getFieldProps('FOGDmaterials')}
                      error={Boolean(touched.FOGDmaterials && errors.FOGDmaterials)}
                      helperText={touched.FOGDmaterials && errors.FOGDmaterials}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label="Oesophage"
                      {...getFieldProps('FOGDoesophage')}
                      error={Boolean(touched.FOGDoesophage && errors.FOGDoesophage)}
                      helperText={touched.FOGDoesophage && errors.FOGDoesophage}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label="Cardia"
                      {...getFieldProps('FOGDcardia')}
                      error={Boolean(touched.FOGDcardia && errors.FOGDcardia)}
                      helperText={touched.FOGDcardia && errors.FOGDcardia}
                    />
                  </Stack>
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
                        <FormControlLabel control={<Switch />} label="Biopsie" labelPlacement="start" />
                      </Stack>
                    </>
                  )}
                  <ExploredItem labelExplored="FOGDpyloreExplored" label="FOGDpylore" formik={formik} />
                  <ExploredItem labelExplored="FOGDdidiiExplored" label="FOGDdidii" formik={formik} />
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
                  {' '}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label="materials"
                      {...getFieldProps('ColoscopieMaterials')}
                      error={Boolean(touched.ColoscopieMaterials && errors.ColoscopieMaterials)}
                      helperText={touched.ColoscopieMaterials && errors.ColoscopieMaterials}
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
        </Accordion>
      </Grid>
    </Grid>
  );
}
