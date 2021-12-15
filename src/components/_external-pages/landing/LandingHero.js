import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import flashFill from '@iconify/icons-eva/flash-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Button, Box, Link, Container, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { varFadeIn, varFadeInUp, varWrapEnter, varFadeInRight } from '../../animate';

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: 'theme.palette.grey[300]',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center'
  }
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 520,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left'
  }
}));

const HeroOverlayStyle = styled(motion.img)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

const HeroImgStyle = styled(motion.img)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  width: '100%',
  margin: 'auto',
  position: 'absolute',
  [theme.breakpoints.up('lg')]: {
    right: '8%',
    width: 'auto',
    height: '72vh'
  }
}));

// ----------------------------------------------------------------------

export default function LandingHero() {
  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <HeroOverlayStyle alt="overlay" src="/static/overlay.svg" variants={varFadeIn} />

        <HeroImgStyle alt="hero" src="/static/home/hero.png" variants={varFadeInUp} />

        <Container maxWidth="lg">
          <ContentStyle>
            <motion.div variants={varFadeInRight}>
              <Typography variant="h1" sx={{ color: 'common.white' }}>
                Get your <br /> FRESH
                <Typography component="span" variant="h1" sx={{ color: 'primary.main' }}>
                  K
                </Typography>
                &nbsp; BOX now !
              </Typography>
            </motion.div>

            <motion.div variants={varFadeInRight}>
              <Typography sx={{ color: 'common.white' }}>
                Here at FRESH
                <Typography component="span" sx={{ color: 'primary.main' }}>
                  K
                </Typography>{' '}
                we’ve made it easy for you to get the freshest hand-cut produces delivered right to your door every
                week. We offer a variety of subscription plans that will fit any budget or lifestyle, so you can enjoy
                great tasting fresh produces whenever you want
              </Typography>
            </motion.div>

            {/* <Stack
              component={motion.div}
              variants={varFadeInRight}
              direction="row"
              spacing={1}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <img alt="sketch icon" src="/static/home/ic_sketch_small.svg" width={20} height={20} />

              <Link
                underline="always"
                href="https://www.sketch.com/s/0fa4699d-a3ff-4cd5-a3a7-d851eb7e17f0"
                target="_blank"
                color="common.white"
                sx={{ typography: 'body2' }}
              >
                Preview in Sketch Cloud
              </Link>
            </Stack> */}

            <motion.div variants={varFadeInRight}>
              <Button
                size="large"
                variant="contained"
                component={RouterLink}
                to="/dashboard/e-commerce/shop"
                startIcon={<Icon icon="fa-solid:box-open" width={20} height={20} />}
              >
                Explore our boxes{' '}
              </Button>
            </motion.div>

            <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <motion.img variants={varFadeInRight} src="/static/home/Asset 1.svg" />
              <motion.img variants={varFadeInRight} src="/static/home/Asset 5.svg" />
              <motion.img variants={varFadeInRight} src="/static/home/Asset 6.svg" />
              <motion.img variants={varFadeInRight} src="/static/home/Asset 7.svg" />{' '}
              <motion.img variants={varFadeInRight} src="/static/home/Asset 2.svg" />
              <motion.img variants={varFadeInRight} src="/static/home/Asset 3.svg" />
              {/* <motion.img variants={varFadeInRight} src="/static/home/Asset 4.svg" /> */}
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}
