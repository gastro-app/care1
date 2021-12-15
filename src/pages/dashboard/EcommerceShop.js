import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { filter, includes, orderBy } from 'lodash';
// material
import { Backdrop, Container, Typography, CircularProgress, Stack } from '@mui/material';
// // redux
// import { useDispatch, useSelector } from '../../redux/store';
// import { getProducts, filterProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import fakeRequest from '../../utils/fakeRequest';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterSidebar
} from '../../components/_dashboard/e-commerce/shop';
import CartWidget from '../../components/_dashboard/e-commerce/CartWidget';

// ----------------------------------------------------------------------

function applyFilter(products, sortBy, filters) {
  // SORT BY
  if (sortBy === 'featured') {
    products = orderBy(products, ['sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }
  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }
  // FILTER PRODUCTS
  if (filters.gender.length > 0) {
    products = filter(products, (_product) => includes(filters.gender, _product.gender));
  }
  if (filters.category !== 'All') {
    products = filter(products, (_product) => _product.category === filters.category);
  }
  if (filters.colors.length > 0) {
    products = filter(products, (_product) => _product.colors.some((color) => filters.colors.includes(color)));
  }
  if (filters.priceRange) {
    products = filter(products, (_product) => {
      if (filters.priceRange === 'below') {
        return _product.price < 25;
      }
      if (filters.priceRange === 'between') {
        return _product.price >= 25 && _product.price <= 75;
      }
      return _product.price > 75;
    });
  }
  if (filters.rating) {
    products = filter(products, (_product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return _product.totalRating > convertRating(filters.rating);
    });
  }
  return products;
}
const sortBy = 'priceDesc';
const products = [
  {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
    cover: '/static/mock-images/products/product_1.jpg',
    images: [
      '/static/mock-images/products/product_1.jpg',
      '/static/mock-images/products/product_2.jpg',
      '/static/mock-images/products/product_3.jpg',
      '/static/mock-images/products/product_4.jpg',
      '/static/mock-images/products/product_5.jpg',
      '/static/mock-images/products/product_6.jpg'
    ],
    name: 'Full FRESHK box',
    code: '38BEE270',
    sku: 'WW75K5210YW/SV',
    tags: ['Dangal', 'The Sting', '2001: A Space Odyssey', "Singin' in the Rain"],
    price: 16.19,
    priceSale: 16.19,
    totalRating: 2.5,
    totalReview: 866,
    ratings: [
      {
        name: '1 Star',
        starCount: 1057,
        reviewCount: 1206
      },
      {
        name: '2 Star',
        starCount: 6494,
        reviewCount: 2954
      },
      {
        name: '3 Star',
        starCount: 9025,
        reviewCount: 6587
      },
      {
        name: '4 Star',
        starCount: 1353,
        reviewCount: 4258
      },
      {
        name: '5 Star',
        starCount: 6448,
        reviewCount: 8744
      }
    ],
    reviews: [
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        name: 'Jayvion Simon',
        avatarUrl: '/static/mock-images/avatars/avatar_1.jpg',
        comment: 'Assumenda nam repudiandae rerum fugiat vel maxime.',
        rating: 2.5,
        isPurchased: true,
        helpful: 3714,
        postedAt: '2021-12-09T00:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        name: 'Lucian Obrien',
        avatarUrl: '/static/mock-images/avatars/avatar_2.jpg',
        comment: 'Quis veniam aut saepe aliquid nulla.',
        rating: 2,
        isPurchased: true,
        helpful: 1211,
        postedAt: '2021-12-07T23:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        name: 'Deja Brady',
        avatarUrl: '/static/mock-images/avatars/avatar_3.jpg',
        comment: 'Reprehenderit ut voluptas sapiente ratione nostrum est.',
        rating: 4.9,
        isPurchased: true,
        helpful: 2750,
        postedAt: '2021-12-06T22:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        name: 'Harrison Stein',
        avatarUrl: '/static/mock-images/avatars/avatar_4.jpg',
        comment: 'Error ut sit vel molestias velit.',
        rating: 2,
        isPurchased: false,
        helpful: 5286,
        postedAt: '2021-12-05T21:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        name: 'Reece Chung',
        avatarUrl: '/static/mock-images/avatars/avatar_5.jpg',
        comment: 'Quo quia sit nihil nemo doloremque et.',
        rating: 4,
        isPurchased: false,
        helpful: 4058,
        postedAt: '2021-12-04T20:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
        name: 'Lainey Davidson',
        avatarUrl: '/static/mock-images/avatars/avatar_6.jpg',
        comment: 'Autem doloribus harum vero laborum.',
        rating: 5,
        isPurchased: true,
        helpful: 5553,
        postedAt: '2021-12-03T19:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
        name: 'Cristopher Cardenas',
        avatarUrl: '/static/mock-images/avatars/avatar_7.jpg',
        comment: 'Tempora officiis consequuntur architecto nostrum autem nam adipisci.',
        rating: 4.9,
        isPurchased: false,
        helpful: 3305,
        postedAt: '2021-12-02T18:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
        name: 'Melanie Noble',
        avatarUrl: '/static/mock-images/avatars/avatar_8.jpg',
        comment: 'Voluptas sunt magni adipisci praesentium saepe.',
        rating: 5,
        isPurchased: false,
        helpful: 5766,
        postedAt: '2021-12-01T17:51:41.102Z'
      }
    ],
    colors: ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'],
    status: 'sale',
    inventoryType: 'low_stock',
    sizes: ['6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
    available: 48,
    description:
      '\n<p><strong><small> SPECIFICATION</small></strong></p>\n<p>Leather panels. Laces. Rounded toe. Rubber sole.\n<br /><br />\n<p><strong><small> MATERIAL AND WASHING INSTRUCTIONS</small></strong></p>\n<p>Shoeupper: 54% bovine leather,46% polyurethane. Lining: 65% polyester,35% cotton. Insole: 100% polyurethane. Sole: 100% thermoplastic. Fixing sole: 100% glued.</p>\n',
    sold: 638,
    createdAt: '2021-12-09T00:51:41.102Z',
    category: 'Accessories',
    gender: 'Men'
  },
  {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
    cover: '/static/mock-images/products/product_2.jpg',
    images: [
      '/static/mock-images/products/product_1.jpg',
      '/static/mock-images/products/product_2.jpg',
      '/static/mock-images/products/product_3.jpg',
      '/static/mock-images/products/product_4.jpg',
      '/static/mock-images/products/product_5.jpg',
      '/static/mock-images/products/product_6.jpg'
    ],
    name: 'Full FRESHK Organic box',
    code: '38BEE271',
    sku: 'WW75K5211YW/SV',
    tags: ['Dangal', 'The Sting', '2001: A Space Odyssey', "Singin' in the Rain"],
    price: 35.71,
    priceSale: null,
    totalRating: 2,
    totalReview: 872,
    ratings: [
      {
        name: '1 Star',
        starCount: 8708,
        reviewCount: 977
      },
      {
        name: '2 Star',
        starCount: 2959,
        reviewCount: 2080
      },
      {
        name: '3 Star',
        starCount: 2914,
        reviewCount: 1838
      },
      {
        name: '4 Star',
        starCount: 4388,
        reviewCount: 8491
      },
      {
        name: '5 Star',
        starCount: 4790,
        reviewCount: 9769
      }
    ],
    reviews: [
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        name: 'Jayvion Simon',
        avatarUrl: '/static/mock-images/avatars/avatar_1.jpg',
        comment: 'Assumenda nam repudiandae rerum fugiat vel maxime.',
        rating: 2.5,
        isPurchased: true,
        helpful: 6515,
        postedAt: '2021-12-09T00:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        name: 'Lucian Obrien',
        avatarUrl: '/static/mock-images/avatars/avatar_2.jpg',
        comment: 'Quis veniam aut saepe aliquid nulla.',
        rating: 2,
        isPurchased: true,
        helpful: 8648,
        postedAt: '2021-12-07T23:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        name: 'Deja Brady',
        avatarUrl: '/static/mock-images/avatars/avatar_3.jpg',
        comment: 'Reprehenderit ut voluptas sapiente ratione nostrum est.',
        rating: 4.9,
        isPurchased: true,
        helpful: 8420,
        postedAt: '2021-12-06T22:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        name: 'Harrison Stein',
        avatarUrl: '/static/mock-images/avatars/avatar_4.jpg',
        comment: 'Error ut sit vel molestias velit.',
        rating: 2,
        isPurchased: false,
        helpful: 9681,
        postedAt: '2021-12-05T21:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        name: 'Reece Chung',
        avatarUrl: '/static/mock-images/avatars/avatar_5.jpg',
        comment: 'Quo quia sit nihil nemo doloremque et.',
        rating: 4,
        isPurchased: false,
        helpful: 1160,
        postedAt: '2021-12-04T20:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
        name: 'Lainey Davidson',
        avatarUrl: '/static/mock-images/avatars/avatar_6.jpg',
        comment: 'Autem doloribus harum vero laborum.',
        rating: 5,
        isPurchased: true,
        helpful: 3433,
        postedAt: '2021-12-03T19:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
        name: 'Cristopher Cardenas',
        avatarUrl: '/static/mock-images/avatars/avatar_7.jpg',
        comment: 'Tempora officiis consequuntur architecto nostrum autem nam adipisci.',
        rating: 4.9,
        isPurchased: false,
        helpful: 247,
        postedAt: '2021-12-02T18:51:41.102Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
        name: 'Melanie Noble',
        avatarUrl: '/static/mock-images/avatars/avatar_8.jpg',
        comment: 'Voluptas sunt magni adipisci praesentium saepe.',
        rating: 5,
        isPurchased: false,
        helpful: 6236,
        postedAt: '2021-12-01T17:51:41.102Z'
      }
    ],
    colors: ['#00AB55', '#000000'],
    status: '',
    inventoryType: 'out_of_stock',
    sizes: ['6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
    available: 2,
    description:
      '\n<p><strong><small> SPECIFICATION</small></strong></p>\n<p>Leather panels. Laces. Rounded toe. Rubber sole.\n<br /><br />\n<p><strong><small> MATERIAL AND WASHING INSTRUCTIONS</small></strong></p>\n<p>Shoeupper: 54% bovine leather,46% polyurethane. Lining: 65% polyester,35% cotton. Insole: 100% polyurethane. Sole: 100% thermoplastic. Fixing sole: 100% glued.</p>\n',
    sold: 264,
    createdAt: '2021-12-07T23:51:41.102Z',
    category: 'Apparel',
    gender: 'Kids'
  },
  {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
    cover: '/static/mock-images/products/product_3.jpg',
    images: [
      '/static/mock-images/products/product_1.jpg',
      '/static/mock-images/products/product_2.jpg',
      '/static/mock-images/products/product_3.jpg',
      '/static/mock-images/products/product_4.jpg',
      '/static/mock-images/products/product_5.jpg',
      '/static/mock-images/products/product_6.jpg'
    ],
    name: 'Mini FRESHK box',
    code: '38BEE272',
    sku: 'WW75K5212YW/SV',
    tags: ['Dangal', 'The Sting', '2001: A Space Odyssey', "Singin' in the Rain"],
    price: 34.3,
    priceSale: null,
    totalRating: 4.9,
    totalReview: 5612,
    ratings: [
      {
        name: '1 Star',
        starCount: 4873,
        reviewCount: 3190
      },
      {
        name: '2 Star',
        starCount: 4498,
        reviewCount: 4715
      },
      {
        name: '3 Star',
        starCount: 9712,
        reviewCount: 1132
      },
      {
        name: '4 Star',
        starCount: 4301,
        reviewCount: 7513
      },
      {
        name: '5 Star',
        starCount: 6856,
        reviewCount: 1977
      }
    ],
    reviews: [
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        name: 'Jayvion Simon',
        avatarUrl: '/static/mock-images/avatars/avatar_1.jpg',
        comment: 'Assumenda nam repudiandae rerum fugiat vel maxime.',
        rating: 2.5,
        isPurchased: true,
        helpful: 1460,
        postedAt: '2021-12-09T00:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        name: 'Lucian Obrien',
        avatarUrl: '/static/mock-images/avatars/avatar_2.jpg',
        comment: 'Quis veniam aut saepe aliquid nulla.',
        rating: 2,
        isPurchased: true,
        helpful: 9906,
        postedAt: '2021-12-07T23:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        name: 'Deja Brady',
        avatarUrl: '/static/mock-images/avatars/avatar_3.jpg',
        comment: 'Reprehenderit ut voluptas sapiente ratione nostrum est.',
        rating: 4.9,
        isPurchased: true,
        helpful: 404,
        postedAt: '2021-12-06T22:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        name: 'Harrison Stein',
        avatarUrl: '/static/mock-images/avatars/avatar_4.jpg',
        comment: 'Error ut sit vel molestias velit.',
        rating: 2,
        isPurchased: false,
        helpful: 7235,
        postedAt: '2021-12-05T21:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        name: 'Reece Chung',
        avatarUrl: '/static/mock-images/avatars/avatar_5.jpg',
        comment: 'Quo quia sit nihil nemo doloremque et.',
        rating: 4,
        isPurchased: false,
        helpful: 5385,
        postedAt: '2021-12-04T20:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
        name: 'Lainey Davidson',
        avatarUrl: '/static/mock-images/avatars/avatar_6.jpg',
        comment: 'Autem doloribus harum vero laborum.',
        rating: 5,
        isPurchased: true,
        helpful: 9680,
        postedAt: '2021-12-03T19:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
        name: 'Cristopher Cardenas',
        avatarUrl: '/static/mock-images/avatars/avatar_7.jpg',
        comment: 'Tempora officiis consequuntur architecto nostrum autem nam adipisci.',
        rating: 4.9,
        isPurchased: false,
        helpful: 3469,
        postedAt: '2021-12-02T18:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
        name: 'Melanie Noble',
        avatarUrl: '/static/mock-images/avatars/avatar_8.jpg',
        comment: 'Voluptas sunt magni adipisci praesentium saepe.',
        rating: 5,
        isPurchased: false,
        helpful: 8540,
        postedAt: '2021-12-01T17:51:41.103Z'
      }
    ],
    colors: ['#000000', '#FFFFFF'],
    status: '',
    inventoryType: 'low_stock',
    sizes: ['6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
    available: 2,
    description:
      '\n<p><strong><small> SPECIFICATION</small></strong></p>\n<p>Leather panels. Laces. Rounded toe. Rubber sole.\n<br /><br />\n<p><strong><small> MATERIAL AND WASHING INSTRUCTIONS</small></strong></p>\n<p>Shoeupper: 54% bovine leather,46% polyurethane. Lining: 65% polyester,35% cotton. Insole: 100% polyurethane. Sole: 100% thermoplastic. Fixing sole: 100% glued.</p>\n',
    sold: 640,
    createdAt: '2021-12-06T22:51:41.103Z',
    category: 'Apparel',
    gender: 'Men'
  },
  {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
    cover: '/static/mock-images/products/product_4.jpg',
    images: [
      '/static/mock-images/products/product_1.jpg',
      '/static/mock-images/products/product_2.jpg',
      '/static/mock-images/products/product_3.jpg',
      '/static/mock-images/products/product_4.jpg',
      '/static/mock-images/products/product_5.jpg',
      '/static/mock-images/products/product_6.jpg'
    ],
    name: 'Mini FRESHK Organic box',
    code: '38BEE273',
    sku: 'WW75K5213YW/SV',
    tags: ['Dangal', 'The Sting', '2001: A Space Odyssey', "Singin' in the Rain"],
    price: 93.1,
    priceSale: 93.1,
    totalRating: 2,
    totalReview: 5038,
    ratings: [
      {
        name: '1 Star',
        starCount: 3380,
        reviewCount: 244
      },
      {
        name: '2 Star',
        starCount: 8562,
        reviewCount: 9765
      },
      {
        name: '3 Star',
        starCount: 2572,
        reviewCount: 2144
      },
      {
        name: '4 Star',
        starCount: 5625,
        reviewCount: 2087
      },
      {
        name: '5 Star',
        starCount: 1512,
        reviewCount: 346
      }
    ],
    reviews: [
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        name: 'Jayvion Simon',
        avatarUrl: '/static/mock-images/avatars/avatar_1.jpg',
        comment: 'Assumenda nam repudiandae rerum fugiat vel maxime.',
        rating: 2.5,
        isPurchased: true,
        helpful: 9532,
        postedAt: '2021-12-09T00:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        name: 'Lucian Obrien',
        avatarUrl: '/static/mock-images/avatars/avatar_2.jpg',
        comment: 'Quis veniam aut saepe aliquid nulla.',
        rating: 2,
        isPurchased: true,
        helpful: 4384,
        postedAt: '2021-12-07T23:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        name: 'Deja Brady',
        avatarUrl: '/static/mock-images/avatars/avatar_3.jpg',
        comment: 'Reprehenderit ut voluptas sapiente ratione nostrum est.',
        rating: 4.9,
        isPurchased: true,
        helpful: 2575,
        postedAt: '2021-12-06T22:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        name: 'Harrison Stein',
        avatarUrl: '/static/mock-images/avatars/avatar_4.jpg',
        comment: 'Error ut sit vel molestias velit.',
        rating: 2,
        isPurchased: false,
        helpful: 2460,
        postedAt: '2021-12-05T21:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        name: 'Reece Chung',
        avatarUrl: '/static/mock-images/avatars/avatar_5.jpg',
        comment: 'Quo quia sit nihil nemo doloremque et.',
        rating: 4,
        isPurchased: false,
        helpful: 5352,
        postedAt: '2021-12-04T20:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
        name: 'Lainey Davidson',
        avatarUrl: '/static/mock-images/avatars/avatar_6.jpg',
        comment: 'Autem doloribus harum vero laborum.',
        rating: 5,
        isPurchased: true,
        helpful: 2442,
        postedAt: '2021-12-03T19:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
        name: 'Cristopher Cardenas',
        avatarUrl: '/static/mock-images/avatars/avatar_7.jpg',
        comment: 'Tempora officiis consequuntur architecto nostrum autem nam adipisci.',
        rating: 4.9,
        isPurchased: false,
        helpful: 14,
        postedAt: '2021-12-02T18:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
        name: 'Melanie Noble',
        avatarUrl: '/static/mock-images/avatars/avatar_8.jpg',
        comment: 'Voluptas sunt magni adipisci praesentium saepe.',
        rating: 5,
        isPurchased: false,
        helpful: 7240,
        postedAt: '2021-12-01T17:51:41.103Z'
      }
    ],
    colors: ['#FFFFFF', '#FFC0CB'],
    status: 'sale',
    inventoryType: 'out_of_stock',
    sizes: ['6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
    available: 65,
    description:
      '\n<p><strong><small> SPECIFICATION</small></strong></p>\n<p>Leather panels. Laces. Rounded toe. Rubber sole.\n<br /><br />\n<p><strong><small> MATERIAL AND WASHING INSTRUCTIONS</small></strong></p>\n<p>Shoeupper: 54% bovine leather,46% polyurethane. Lining: 65% polyester,35% cotton. Insole: 100% polyurethane. Sole: 100% thermoplastic. Fixing sole: 100% glued.</p>\n',
    sold: 680,
    createdAt: '2021-12-05T21:51:41.103Z',
    category: 'Accessories',
    gender: 'Women'
  },
  {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
    cover: '/static/mock-images/products/product_5.jpg',
    images: [
      '/static/mock-images/products/product_1.jpg',
      '/static/mock-images/products/product_2.jpg',
      '/static/mock-images/products/product_3.jpg',
      '/static/mock-images/products/product_4.jpg',
      '/static/mock-images/products/product_5.jpg',
      '/static/mock-images/products/product_6.jpg'
    ],
    name: 'Super FRESHK box',
    code: '38BEE274',
    sku: 'WW75K5214YW/SV',
    tags: ['Dangal', 'The Sting', '2001: A Space Odyssey', "Singin' in the Rain"],
    price: 55.47,
    priceSale: null,
    totalRating: 4,
    totalReview: 4017,
    ratings: [
      {
        name: '1 Star',
        starCount: 5351,
        reviewCount: 5137
      },
      {
        name: '2 Star',
        starCount: 2135,
        reviewCount: 9730
      },
      {
        name: '3 Star',
        starCount: 705,
        reviewCount: 471
      },
      {
        name: '4 Star',
        starCount: 2809,
        reviewCount: 5317
      },
      {
        name: '5 Star',
        starCount: 572,
        reviewCount: 6811
      }
    ],
    reviews: [
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        name: 'Jayvion Simon',
        avatarUrl: '/static/mock-images/avatars/avatar_1.jpg',
        comment: 'Assumenda nam repudiandae rerum fugiat vel maxime.',
        rating: 2.5,
        isPurchased: true,
        helpful: 8972,
        postedAt: '2021-12-09T00:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        name: 'Lucian Obrien',
        avatarUrl: '/static/mock-images/avatars/avatar_2.jpg',
        comment: 'Quis veniam aut saepe aliquid nulla.',
        rating: 2,
        isPurchased: true,
        helpful: 1366,
        postedAt: '2021-12-07T23:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        name: 'Deja Brady',
        avatarUrl: '/static/mock-images/avatars/avatar_3.jpg',
        comment: 'Reprehenderit ut voluptas sapiente ratione nostrum est.',
        rating: 4.9,
        isPurchased: true,
        helpful: 2694,
        postedAt: '2021-12-06T22:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        name: 'Harrison Stein',
        avatarUrl: '/static/mock-images/avatars/avatar_4.jpg',
        comment: 'Error ut sit vel molestias velit.',
        rating: 2,
        isPurchased: false,
        helpful: 4871,
        postedAt: '2021-12-05T21:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        name: 'Reece Chung',
        avatarUrl: '/static/mock-images/avatars/avatar_5.jpg',
        comment: 'Quo quia sit nihil nemo doloremque et.',
        rating: 4,
        isPurchased: false,
        helpful: 1026,
        postedAt: '2021-12-04T20:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
        name: 'Lainey Davidson',
        avatarUrl: '/static/mock-images/avatars/avatar_6.jpg',
        comment: 'Autem doloribus harum vero laborum.',
        rating: 5,
        isPurchased: true,
        helpful: 8385,
        postedAt: '2021-12-03T19:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
        name: 'Cristopher Cardenas',
        avatarUrl: '/static/mock-images/avatars/avatar_7.jpg',
        comment: 'Tempora officiis consequuntur architecto nostrum autem nam adipisci.',
        rating: 4.9,
        isPurchased: false,
        helpful: 8586,
        postedAt: '2021-12-02T18:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
        name: 'Melanie Noble',
        avatarUrl: '/static/mock-images/avatars/avatar_8.jpg',
        comment: 'Voluptas sunt magni adipisci praesentium saepe.',
        rating: 5,
        isPurchased: false,
        helpful: 2049,
        postedAt: '2021-12-01T17:51:41.103Z'
      }
    ],
    colors: ['#FFC0CB', '#FF4842', '#1890FF'],
    status: '',
    inventoryType: 'low_stock',
    sizes: ['6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
    available: 2,
    description:
      '\n<p><strong><small> SPECIFICATION</small></strong></p>\n<p>Leather panels. Laces. Rounded toe. Rubber sole.\n<br /><br />\n<p><strong><small> MATERIAL AND WASHING INSTRUCTIONS</small></strong></p>\n<p>Shoeupper: 54% bovine leather,46% polyurethane. Lining: 65% polyester,35% cotton. Insole: 100% polyurethane. Sole: 100% thermoplastic. Fixing sole: 100% glued.</p>\n',
    sold: 567,
    createdAt: '2021-12-04T20:51:41.103Z',
    category: 'Shose',
    gender: 'Women'
  },
  {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
    cover: '/static/mock-images/products/product_6.jpg',
    images: [
      '/static/mock-images/products/product_1.jpg',
      '/static/mock-images/products/product_2.jpg',
      '/static/mock-images/products/product_3.jpg',
      '/static/mock-images/products/product_4.jpg',
      '/static/mock-images/products/product_5.jpg',
      '/static/mock-images/products/product_6.jpg'
    ],
    name: 'Super FRESHK Organic box',
    code: '38BEE275',
    sku: 'WW75K5215YW/SV',
    tags: ['Dangal', 'The Sting', '2001: A Space Odyssey', "Singin' in the Rain"],
    price: 89.09,
    priceSale: null,
    totalRating: 5,
    totalReview: 5220,
    ratings: [
      {
        name: '1 Star',
        starCount: 2941,
        reviewCount: 9645
      },
      {
        name: '2 Star',
        starCount: 510,
        reviewCount: 5211
      },
      {
        name: '3 Star',
        starCount: 9148,
        reviewCount: 1735
      },
      {
        name: '4 Star',
        starCount: 6720,
        reviewCount: 9092
      },
      {
        name: '5 Star',
        starCount: 828,
        reviewCount: 3460
      }
    ],
    reviews: [
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        name: 'Jayvion Simon',
        avatarUrl: '/static/mock-images/avatars/avatar_1.jpg',
        comment: 'Assumenda nam repudiandae rerum fugiat vel maxime.',
        rating: 2.5,
        isPurchased: true,
        helpful: 1339,
        postedAt: '2021-12-09T00:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        name: 'Lucian Obrien',
        avatarUrl: '/static/mock-images/avatars/avatar_2.jpg',
        comment: 'Quis veniam aut saepe aliquid nulla.',
        rating: 2,
        isPurchased: true,
        helpful: 5702,
        postedAt: '2021-12-07T23:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        name: 'Deja Brady',
        avatarUrl: '/static/mock-images/avatars/avatar_3.jpg',
        comment: 'Reprehenderit ut voluptas sapiente ratione nostrum est.',
        rating: 4.9,
        isPurchased: true,
        helpful: 8157,
        postedAt: '2021-12-06T22:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        name: 'Harrison Stein',
        avatarUrl: '/static/mock-images/avatars/avatar_4.jpg',
        comment: 'Error ut sit vel molestias velit.',
        rating: 2,
        isPurchased: false,
        helpful: 6581,
        postedAt: '2021-12-05T21:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        name: 'Reece Chung',
        avatarUrl: '/static/mock-images/avatars/avatar_5.jpg',
        comment: 'Quo quia sit nihil nemo doloremque et.',
        rating: 4,
        isPurchased: false,
        helpful: 9440,
        postedAt: '2021-12-04T20:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
        name: 'Lainey Davidson',
        avatarUrl: '/static/mock-images/avatars/avatar_6.jpg',
        comment: 'Autem doloribus harum vero laborum.',
        rating: 5,
        isPurchased: true,
        helpful: 9734,
        postedAt: '2021-12-03T19:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
        name: 'Cristopher Cardenas',
        avatarUrl: '/static/mock-images/avatars/avatar_7.jpg',
        comment: 'Tempora officiis consequuntur architecto nostrum autem nam adipisci.',
        rating: 4.9,
        isPurchased: false,
        helpful: 7481,
        postedAt: '2021-12-02T18:51:41.103Z'
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
        name: 'Melanie Noble',
        avatarUrl: '/static/mock-images/avatars/avatar_8.jpg',
        comment: 'Voluptas sunt magni adipisci praesentium saepe.',
        rating: 5,
        isPurchased: false,
        helpful: 9914,
        postedAt: '2021-12-01T17:51:41.103Z'
      }
    ],
    colors: ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'],
    status: 'new',
    inventoryType: 'out_of_stock',
    sizes: ['6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
    available: 2,
    description:
      '\n<p><strong><small> SPECIFICATION</small></strong></p>\n<p>Leather panels. Laces. Rounded toe. Rubber sole.\n<br /><br />\n<p><strong><small> MATERIAL AND WASHING INSTRUCTIONS</small></strong></p>\n<p>Shoeupper: 54% bovine leather,46% polyurethane. Lining: 65% polyester,35% cotton. Insole: 100% polyurethane. Sole: 100% thermoplastic. Fixing sole: 100% glued.</p>\n',
    sold: 560,
    createdAt: '2021-12-03T19:51:41.103Z',
    category: 'Shose',
    gender: 'Men'
  }
];
const filters = {
  gender: [],
  category: 'All',
  colors: [],
  priceRange: '',
  rating: ''
};
export default function EcommerceShop() {
  const { themeStretch } = useSettings();
  // const dispatch = useDispatch();
  const [openFilter, setOpenFilter] = useState(false);

  // const { sortBy, filters } = useSelector((state) => state.product);
  const filteredProducts = applyFilter(products, sortBy, filters);

  const formik = useFormik({
    initialValues: {
      gender: filters.gender,
      category: filters.category,
      colors: filters.colors,
      priceRange: filters.priceRange,
      rating: filters.rating
    },
    onSubmit: async (values, { setSubmitting }) => {
      // try {
      //   await fakeRequest(500);
      //   setSubmitting(false);
      // } catch (error) {
      //   console.error(error);
      //   setSubmitting(false);
      // }
    }
  });

  const { values, resetForm, handleSubmit, isSubmitting, initialValues } = formik;

  const isDefault =
    !values.priceRange &&
    !values.rating &&
    values.gender.length === 0 &&
    values.colors.length === 0 &&
    values.category === 'All';

  // useEffect(() => {
  //   dispatch(getProducts());
  // }, [dispatch]);

  // useEffect(() => {
  //   dispatch(filterProducts(values));
  // }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };

  return (
    <Page title="FRESHK Shop">
      {values && (
        <Backdrop open={isSubmitting} sx={{ zIndex: 9999 }}>
          <CircularProgress />
        </Backdrop>
      )}

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="FRESHK Shop"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Shop' }]}
        />

        {!isDefault && (
          <Typography gutterBottom>
            <Typography component="span" variant="subtitle1">
              {filteredProducts.length}
            </Typography>
            &nbsp;Products found
          </Typography>
        )}

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <ShopTagFiltered
            filters={filters}
            formik={formik}
            isShowReset={openFilter}
            onResetFilter={handleResetFilter}
            isDefault={isDefault}
          />

          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ShopFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ShopProductSort />
          </Stack>
        </Stack>

        <ShopProductList products={filteredProducts} isLoad={!filteredProducts && !initialValues} />
        {/* <CartWidget /> */}
      </Container>
    </Page>
  );
}
