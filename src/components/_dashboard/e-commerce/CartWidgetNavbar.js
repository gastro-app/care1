import { sum } from 'lodash';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Badge } from '@mui/material';
// redux
import { useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// extend material
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

const RootStyle = styled(RouterLink)(({ theme }) => ({
  cursor: 'pointer',
  position: 'fixed',
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,

  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 }
}));

// ----------------------------------------------------------------------

export default function CartWidget() {
  const { checkout } = useSelector((state) => state.product);
  const totalItems = sum(checkout.cart.map((item) => item.quantity));

  return (
    <MIconButton
      sx={{
        padding: 0,
        width: 44,
        height: 44
      }}
    >
      <RootStyle to={PATH_DASHBOARD.eCommerce.checkout}>
        <Badge showZero badgeContent={totalItems} color="error" max={99}>
          <Icon icon="fa-solid:box-open" width={30} height={30} />
        </Badge>
      </RootStyle>
    </MIconButton>
  );
}
