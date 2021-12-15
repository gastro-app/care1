import * as React from 'react';
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Box,
  Card,
  Link,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
//----------------------------------------------------
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import { MIconButton } from '../../../@material-extend';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
//
import { DialogAnimate } from '../../../animate';

import Label from '../../../Label';
import ColorPreview from '../../../ColorPreview';
import InsideList from './InsideList';
//-----------------------------------------------------------------------

// ----------------------------------------------------------------------
const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`
}));
const LabelIncrementer = styled('div')(({ theme }) => ({
  position: 'absolute',
  marginTop: '-40px',
  marginLeft: '0.3px',
  color: theme.palette.text.disabled,
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: '2px 2px',
  fontSize: '75%'
}));

function Incrementer({ available, quantity, onIncrease, onDecrease }) {
  return (
    <Box sx={{ width: 100, textAlign: 'right' }}>
      <IncrementerStyle>
        <LabelIncrementer>Quantity</LabelIncrementer>
        <MIconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Icon icon={minusFill} width={20} height={20} />
        </MIconButton>
        {quantity}
        <MIconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
          <Icon icon={plusFill} width={20} height={20} />
        </MIconButton>
      </IncrementerStyle>
      {/* <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        available: {available}
      </Typography> */}
    </Box>
  );
}
// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
  const { name, cover, price, colors, status, priceSale } = product;
  const linkTo = `${PATH_DASHBOARD.eCommerce.root}/product/${paramCase(name)}`;
  //
  const [quantity, setQuantity] = React.useState(1);
  const [frequency, setFrequency] = React.useState('4 weeks');
  const [openInside, setOpenInside] = React.useState(false);

  const handleOpenInside = () => {
    setOpenInside(true);
  };

  const handleCloseInside = () => {
    setOpenInside(false);
  };
  const handleChangeQuantity = (event) => {
    setQuantity(event.target.value);
  };
  const handleChangeFrequency = (event) => {
    setFrequency(event.target.value);
  };

  //
  return (
    <>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {status && (
            <Label
              variant="filled"
              color={(status === 'sale' && 'error') || 'info'}
              sx={{
                top: 16,
                right: 16,
                zIndex: 9,
                position: 'absolute',
                textTransform: 'uppercase'
              }}
            >
              {status}
            </Label>
          )}
          <Label
            style={{ cursor: 'pointer' }}
            variant="filled"
            color="info"
            onClick={() => setOpenInside(true)}
            sx={{
              bottom: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            WHAT'S INSIDE
          </Label>
          <ProductImgStyle alt={name} src={cover} />
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Link to={linkTo} color="inherit" component={RouterLink}>
              <Typography variant="subtitle1" noWrap>
                {name}
              </Typography>
            </Link>
            &nbsp;
            <Typography variant="subtitle1">
              <Typography
                component="span"
                variant="body1"
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through'
                }}
              >
                {priceSale && fCurrency(priceSale + 5)}
                {priceSale && <br />}
              </Typography>
              {fCurrency(price)}
            </Typography>
          </Stack>
          {!priceSale && <br />}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Incrementer
              quantity={quantity}
              // available={available}
              // onDecrease={() => onDecreaseQuantity(id)}
              // onIncrease={() => onIncreaseQuantity(id)}
              onDecrease={() => setQuantity(quantity - 1)}
              onIncrease={() => {
                setQuantity(quantity + 1);
              }}
            />
            &nbsp;
            <FormControl style={{ width: '60%' }}>
              <InputLabel id="demo-simple-select-label">Frequency</InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={frequency}
                label="Frequency"
                onChange={handleChangeFrequency}
              >
                <MenuItem value="1 week">1 week</MenuItem>
                <MenuItem value="2 weeks">2 weeks</MenuItem>
                <MenuItem value="3 weeks">3 weeks</MenuItem>
                <MenuItem value="4 weeks">4 weeks</MenuItem>
              </Select>
            </FormControl>{' '}
            {/* <ColorPreview colors={colors} /> */}
          </Stack>
          <Button variant="contained">+ Add to delivery</Button>
        </Stack>
      </Card>
      <DialogAnimate fullWidth open={openInside} maxWidth="md" scroll="paper" onClose={() => setOpenInside(false)}>
        <DialogTitle>{`BOX CONTENT FOR "${name}" `}</DialogTitle>
        <DialogContent>
          <DialogContentText>Showing the box contents for the week of: 11/22/2021 - 11/28/2021</DialogContentText>
          <InsideList />{' '}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInside} variant="contained">
            Close
          </Button>
        </DialogActions>
      </DialogAnimate>
    </>
  );
}
