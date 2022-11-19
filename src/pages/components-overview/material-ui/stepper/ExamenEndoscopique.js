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
function ExploredItem({ label, formik }) {
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const [alignment, setAlignment] = useState('Non Exploré');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5">{label}</Typography>
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

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function UserNewForm({ isEdit, currentUser }) {
  const [alignment, setAlignment] = useState('Non Exploré');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [preview, setPreview] = useState(false);
  const [files, setFiles] = useState([]);

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
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('country is required'),
    company: Yup.string().required('Company is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    role: Yup.string().required('Role Number is required'),
    avatarUrl: Yup.mixed().required('Avatar is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      avatarUrl: currentUser?.avatarUrl || null,
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.status,
      company: currentUser?.company || '',
      role: currentUser?.role || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.user.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const FOGD = () => (
    <>
      {' '}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
        <TextField
          fullWidth
          label="materials"
          {...getFieldProps('materials')}
          error={Boolean(touched.city && errors.city)}
          helperText={touched.city && errors.city}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
        <TextField
          fullWidth
          label="oesophage"
          {...getFieldProps('oesophage')}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
        <TextField
          fullWidth
          label="cardia"
          {...getFieldProps('cardia')}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />
      </Stack>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5">Estomac</Typography>
        <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleChange} aria-label="Platform">
          <ToggleButton value="Exploré">Exploré</ToggleButton>
          <ToggleButton value="Non Exploré">Non Exploré</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {alignment === 'Exploré' && (
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
            <TextField
              fullWidth
              label="fundus"
              {...getFieldProps('fundus')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
            <TextField
              fullWidth
              label="antre"
              {...getFieldProps('antre')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
            <FormControlLabel control={<Switch />} label="Biopsie" labelPlacement="start" />
          </Stack>
        </>
      )}
      <ExploredItem label="pylore" formik={formik} />
      <ExploredItem label="DI/DII" formik={formik} />
    </>
  );
  const Coloscopie = () => (
    <>
      {' '}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
        <TextField
          fullWidth
          label="materials"
          {...getFieldProps('materials')}
          error={Boolean(touched.city && errors.city)}
          helperText={touched.city && errors.city}
        />
      </Stack>
      <Typography variant="h5">BOSTON</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
        <TextField
          select
          fullWidth
          label="Colon gauche"
          placeholder="Colon gauche"
          {...getFieldProps('Colon gauche')}
          SelectProps={{ native: true }}
          error={Boolean(touched.country && errors.country)}
          helperText={touched.country && errors.country}
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
          {...getFieldProps('Colon Transverse')}
          SelectProps={{ native: true }}
          error={Boolean(touched.country && errors.country)}
          helperText={touched.country && errors.country}
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
          {...getFieldProps('Colon droit')}
          SelectProps={{ native: true }}
          error={Boolean(touched.country && errors.country)}
          helperText={touched.country && errors.country}
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
          {...getFieldProps('Préparation')}
          SelectProps={{ native: true }}
          error={Boolean(touched.country && errors.country)}
          helperText={touched.country && errors.country}
        >
          <option value="" />
          {['bonne', 'moyenne', 'mauvaise'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </TextField>
      </Stack>
      <ExploredItem label="Iléon" formik={formik} />
      <ExploredItem label="Bas fond caecal" formik={formik} />
      <ExploredItem label="Colon droit" formik={formik} />
      <ExploredItem label="Colon Transverse" formik={formik} />
      <ExploredItem label="Colon gauche" formik={formik} />
      <ExploredItem label="Rectum" formik={formik} />
    </>
  );
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography variant="h4">FOGD</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <FOGD />
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
                    <Coloscopie />
                  </Stack>
                </Card>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
