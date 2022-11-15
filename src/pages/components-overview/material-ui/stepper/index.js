// material
import { styled } from '@mui/material/styles';
import { Box, Paper, Container, Stack } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../../routes/paths';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
//
import { Block } from '../../Block';
import CustomizedStepper from './CustomizedStepper';
import useSettings from '../../../../hooks/useSettings';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15)
}));

// ----------------------------------------------------------------------

export default function StepperComponent() {
  const { themeStretch } = useSettings();

  return (
    <Page title="General: Banking | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack spacing={5}>
          <Block title="Rapport">
            <Paper
              sx={{
                p: 3,
                width: '100%',
                boxShadow: (theme) => theme.customShadows.z8
              }}
            >
              <CustomizedStepper />
            </Paper>
          </Block>
        </Stack>
      </Container>
    </Page>
  );
}
