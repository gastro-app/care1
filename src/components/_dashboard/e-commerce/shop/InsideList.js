import PropTypes from 'prop-types';
// material
import { Skeleton, Grid } from '@mui/material';
import ShopProductCard from './ShopProductCard';
import InsideCard from './InsideCard';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    {[...Array(12)].map((_, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);

const arr = [
  { name: 'tomatoes' },
  { name: 'potatoes' },
  { name: 'carrots' },
  { name: 'fishes' },
  { name: 'orange' },
  { name: 'pears' },
  { name: 'apples' }
];
export default function ProductList({ products, isLoad, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {arr.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={6}>
          <InsideCard product={product} />
        </Grid>
      ))}

      {isLoad && SkeletonLoad}
    </Grid>
  );
}
