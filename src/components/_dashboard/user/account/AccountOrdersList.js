import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import { Box, Card, Button, Typography, Stack, Paper } from '@mui/material';
// ----------------------------------------------------------------------
import { PATH_DASHBOARD } from '../../../../routes/paths';

export default function AccountOrdersList({ addressBook }) {
  const orders = [
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
      name: 'Order N°1221',

      status: 'Delivered',
      date: 'Saturday, December 4, 2021',
      amount: '25',
      street: '41256 Kamille Turnpike',
      zipCode: '85807'
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      name: 'Order N°1222',

      status: 'Delivered',
      date: 'Saturday, October 27, 2021',
      amount: '25',
      street: '41256 Kamille Turnpike',
      zipCode: '85807'
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
      name: 'Order N°1223',

      status: 'Delivered',
      date: 'Saturday, October 20, 2021',
      amount: '25',
      street: '41256 Kamille Turnpike',
      zipCode: '85807'
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
      name: 'Order N°1224',

      status: 'Delivered',
      date: 'Saturday, October 13, 2021',
      amount: '25',
      street: '41256 Kamille Turnpike',
      zipCode: '85807'
    }
  ];
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Orders history{' '}
          </Typography>

          {orders.map((address) => (
            <Paper
              key={address.id}
              sx={{
                p: 3,
                width: 1,
                bgcolor: 'background.neutral'
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                {address.name}
              </Typography>

              <Typography variant="body2" gutterBottom>
                <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                  date: &nbsp;
                </Typography>
                {address.date}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                  status: &nbsp;
                </Typography>
                {address.status}{' '}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                  amount: &nbsp;
                </Typography>
                {address.amount} $
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Button
                  color="info"
                  size="small"
                  startIcon={<Icon icon="fluent:document-pdf-16-regular" />}
                  onClick={() => {}}
                  sx={{ mr: 1 }}
                >
                  Download
                </Button>
                <Button
                  size="small"
                  startIcon={<Icon icon="carbon:task-view" />}
                  href={PATH_DASHBOARD.eCommerce.invoice}
                >
                  View
                </Button>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Card>
    </>
  );
}
