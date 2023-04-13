import React, { useState, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
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
  Switch,
  DatePicker,
  Select,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Autocomplete
} from '@mui/material';
import TaskList from './TaskList';

const ConclusionGenerator = ({ options, setFieldValue, formikValue }) => {
  const autocRef = useRef();
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  const onDeleteTask = (index) => {
    const newTasks = Array.from(tasks);
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };
  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const newTasks = Array.from(tasks);
    const [removed] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, removed);
    setTasks(newTasks);
  }
  function handleSubmitForm() {
    console.log('submit', text);
    if (text.trim().length === 0 || tasks.find((t) => t.content === text)) {
      return;
    }
    const task = options.find((e) => e.label === text);
    // props.onSubmit(text);
    const newTasks = Array.from(tasks);
    if (task) {
      newTasks.push({ id: task.id.toString(), content: task.label, ...task });
    } else {
      newTasks.push({ id: Math.random().toFixed(3).toString(), content: text });
    }
    setTasks(newTasks);
    setText('');
  }
  const onSaveTask = (index, content) => {
    const newTasks = Array.from(tasks);
    newTasks[index].content = content;
    setTasks(newTasks);
    setFieldValue(formikValue, newTasks);
  };
  const onSaveConclusion = () => {
    setFieldValue(formikValue, tasks);
    console.log('saved tasks', tasks);
  };
  return (
    <>
      <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 2 }}>
        <Autocomplete
          ref={autocRef}
          // disablePortal
          // freeSolo
          id="combo-box-demo"
          options={options}
          sx={{ width: '60%' }}
          inputValue={text}
          value={text}
          onChange={(e) => {
            if (!e.target.innerHTML.includes('<path')) {
              console.log('autoc', e.target.innerHTML);
              setText(e.target.innerHTML);
            } else {
              setText('');
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Conclusion"
              value={text}
              setFieldValue={setFieldValue}
              formikValue={formikValue}
              onChange={(e) => {
                console.log('textField', e.target.value);
                setText(e.target.value);
              }}
            />
          )}
        />
        <Button variant="contained" onClick={(e) => handleSubmitForm(e)}>
          <Typography>Ajouter</Typography>
        </Button>
      </Stack>
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <TaskList tasks={tasks} onDeleteTask={onDeleteTask} onSaveTask={onSaveTask} />
      </DragDropContext>
      <Button variant="contained" onClick={() => onSaveConclusion()} sx={{ width: '30%' }}>
        <Typography>Enregister la conclusion</Typography>
      </Button>
    </>
  );
};

export default ConclusionGenerator;
