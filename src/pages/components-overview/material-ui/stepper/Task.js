import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box, Button, Typography, TextField } from '@mui/material';

function Task({ task, index, onSaveTask, onDeleteTask }) {
  // console.log('task', task);
  const [text, setText] = useState('');
  const [dropDownValue, setDropDownValue] = useState('');
  const [content, setContent] = useState(task.content);
  const [displayFields, setDisplayFields] = useState(task.hasDropdown || task.hasTextField);
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Box
          variant="contained"
          className="task"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
        >
          &#x2022;
          {` ${content}`}
          {displayFields && (
            <>
              {task.hasDropdown && (
                <TextField
                  select
                  label={task.dropdownLabel}
                  SelectProps={{ native: true }}
                  value={dropDownValue}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setDropDownValue(e.target.value);
                  }}
                >
                  <option key="0" value="" />
                  {task.dropdownValues.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
              )}

              {task.hasTextField && (
                <TextField
                  label={task.textFieldLabel}
                  value={text}
                  onChange={(e) => {
                    console.log('textField', e.target.value);
                    task.textField = e.target.value;
                    setText(e.target.value);
                  }}
                />
              )}
              <Button
                onClick={() => {
                  if (task.hasDropdown) {
                    let string = '';
                    task.dropdownValues.forEach((element) => {
                      if (string !== '') {
                        string = `${string}/${element}`;
                      } else string = element;
                    });
                    console.log('string', string);
                    console.log('find', content.includes(string));
                    const newContent = content.replace(string, dropDownValue);
                    setContent(newContent);
                    console.log('content', newContent);
                    onSaveTask(index, newContent);
                  }

                  setDisplayFields(false);
                }}
              >
                <Typography>Enregister</Typography>
              </Button>
            </>
          )}
          <Button
            onClick={() => {
              onDeleteTask(index);
            }}
          >
            <Typography>Supprimer</Typography>
          </Button>
        </Box>
      )}
    </Draggable>
  );
}

export default Task;
