import React, { useState } from 'react';
import {
  Chip,
  Card,
  Grid,
  Stack,
  Autocomplete,
  TextField,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Switch,
  Select,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
function getStyles(name, className) {
  return {
    fontWeight: className.indexOf(name) === -1 ? '300' : 'bold'
  };
}
function MultiSelect({ label, options, limit = options.length, setFieldValue, formikValue }) {
  const [className, setClassName] = useState([]);
  const handleChangeClassName = (event) => {
    const {
      target: { value }
    } = event;
    const newArray = typeof value === 'string' ? value.split(',') : value;
    if (newArray.length <= limit) setClassName(newArray);
    setFieldValue(formikValue, newArray);
  };
  return (
    <FormControl sx={{ width: '100%' }}>
      <InputLabel id="demo-multiple-name-label">{label ?? 'Classe'}</InputLabel>
      <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        multiple
        value={className}
        onChange={handleChangeClassName}
        input={<OutlinedInput label="Name" />}
        MenuProps={MenuProps}
      >
        {options.map((name) => (
          <MenuItem key={name} value={name} style={getStyles(name, className)}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultiSelect;
