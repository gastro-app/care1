// material
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
import { LandingHero } from '../components/_external-pages/landing';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  height: '100%'
});

// ----------------------------------------------------------------------

export default function LandingPage() {
  return (
    <RootStyle title="Care1" id="move_top">
      <LandingHero />
    </RootStyle>
  );
}
