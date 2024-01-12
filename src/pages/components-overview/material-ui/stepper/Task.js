import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box, Button, Typography, TextField, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { drop } from 'lodash';

function Task({ task, index, onSaveTask, onDeleteTask, setFieldValue, formikValue }) {
  // console.log('task', task);
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');
  const [dropDownValue, setDropDownValue] = useState('');
  const [dropDownValue2, setDropDownValue2] = useState('');
  const [choiceValue, setChoiceValue] = useState(false);
  const [content, setContent] = useState(task.content);
  const [firstPart, setFirstPart] = useState('');
  const [secondPart, setSecondPart] = useState('');
  const [displayFields, setDisplayFields] = useState(task.hasDropdown || task.hasTextField);

  useEffect(() => {
    if (task.hasDropdown) {
      const part1 = content.split('(')[0];
      const part2 = content.split(')')[1];
      setFirstPart(part1);
      setSecondPart(part2);
    } else if (task.hasChoice) {
      const part1 = content.split('(')[0];
      const part2 = content.split(')')[1];
      setFirstPart(part1);
      setSecondPart(part2);
    } else if (task.hasTextField) {
      const part1 = content.split('(')[0];
      const part2 = content.split(')')[1];
      setFirstPart(part1);
      setSecondPart(part2);
    }
  }, [task]);
  // useEffect(() => {
  //   if (task.hasChoice) {
  //     const part1 = content.split('[')[0];
  //     const part2 = content.split(']')[1];
  //     setThirdPart(part1);
  //     setForthPart(part2);
  //   }
  // }, [secondPart]);
  function ExploredItem({ label, yesLabel, noLabel, choiceValue, setChoiceValue }) {
    const handleChange = (event, checked) => {
      setChoiceValue(checked);
    };
    return (
      <>
        <Stack direction={{ xs: 'column' }} spacing={{ xs: 3, sm: 2 }}>
          {label && <Typography variant="h6">{label}</Typography>}
          <ToggleButtonGroup
            name={label}
            color="primary"
            value={choiceValue}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value={false}>{noLabel}</ToggleButton>
            <ToggleButton value>{yesLabel}</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </>
    );
  }
  const getCustomTask = () => {
    switch (task.customNb) {
      case 1:
        return (
          <>
            {displayFields ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  flex: 1,
                  alignItems: 'center'
                }}
              >
                Varices oesophagiennes grade{' '}
                <TextField
                  select
                  sx={{ width: '10vw' }}
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
                <ExploredItem
                  formikValue={formikValue}
                  setFieldValue={setFieldValue}
                  label={undefined}
                  yesLabel={task.yesLabel}
                  noLabel={task.noLabel}
                  choiceValue={choiceValue}
                  setChoiceValue={setChoiceValue}
                />
                <Button
                  onClick={() => {
                    const choice = choiceValue ? task.yesLabel : task.noLabel;
                    const newContent = `Varices oesophagiennes grade ${dropDownValue} ${choice}`;
                    console.log(newContent);
                    setContent(newContent);
                    setDisplayFields(false);
                    onSaveTask(index, newContent);
                  }}
                >
                  <Typography>Enregister</Typography>
                </Button>
              </Box>
            ) : (
              content
            )}
          </>
        );
      case 2:
        return (
          <>
            {displayFields ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  flex: 1,
                  alignItems: 'center'
                }}
              >
                EBO classé C{' '}
                <TextField
                  label={task.textFieldLabel}
                  sx={{ width: '5vw' }}
                  value={text}
                  onChange={(e) => {
                    console.log('textField', e.target.value);
                    task.textField = e.target.value;
                    setText(e.target.value);
                  }}
                />
                M{' '}
                <TextField
                  sx={{ width: '5vw' }}
                  label={task.textFieldLabel2}
                  value={text2}
                  onChange={(e) => {
                    console.log('textField2', e.target.value);
                    task.textField2 = e.target.value;
                    setText2(e.target.value);
                  }}
                />
                Biopsies oesophagiennes selon le protocole de Seattle
                <ExploredItem
                  formikValue={formikValue}
                  setFieldValue={setFieldValue}
                  label={undefined}
                  yesLabel={task.yesLabel}
                  noLabel={task.noLabel}
                  choiceValue={choiceValue}
                  setChoiceValue={setChoiceValue}
                />{' '}
                <Button
                  onClick={() => {
                    const choice = choiceValue ? task.yesLabel : task.noLabel;
                    const newContent = `EBO classé C${text} M${text2}, Biopsies oesophagiennes selon le protocole de Seattle ${choice}`;
                    setContent(newContent);
                    setDisplayFields(false);

                    onSaveTask(index, newContent);
                  }}
                >
                  <Typography>Enregister</Typography>
                </Button>
              </Box>
            ) : (
              content
            )}
          </>
        );

      default:
        return <Typography>{content}</Typography>;
    }
  };
  const getCustom = () => (
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
          &#x2022; {getCustomTask()}
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

  if (task.isCustom) {
    return getCustom();
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Box
          variant="contained"
          className="task"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <>
            &#x2022;{' '}
            {displayFields ? (
              <>
                {task.hasDropdown && (
                  <>
                    {firstPart}
                    <TextField
                      select
                      sx={{ width: '10vw' }}
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
                    {secondPart}
                  </>
                )}
                {task?.hasSecondDropdown && (
                  <>
                    et
                    <TextField
                      select
                      sx={{ width: '10vw' }}
                      label={task.dropdownLabel}
                      SelectProps={{ native: true }}
                      value={dropDownValue2}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setDropDownValue2(e.target.value);
                      }}
                    >
                      <option key="0" value="" />
                      {task.dropdownValues.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </TextField>
                    {secondPart}
                  </>
                )}
                {task.hasChoice && (
                  <>
                    {firstPart}
                    <ExploredItem
                      formikValue={formikValue}
                      setFieldValue={setFieldValue}
                      label={undefined}
                      yesLabel={task.yesLabel}
                      noLabel={task.noLabel}
                    />
                    {secondPart}
                  </>
                )}
                {task.hasTextField && (
                  <>
                    {firstPart}
                    <TextField
                      label={task.textFieldLabel}
                      value={text}
                      onChange={(e) => {
                        console.log('textField', e.target.value);
                        task.textField = e.target.value;
                        setText(e.target.value);
                      }}
                    />
                    {secondPart}
                  </>
                )}
                <Button
                  onClick={() => {
                    if (task.hasDropdown) {
                      // let string = '';
                      // task.dropdownValues.forEach((element) => {
                      //   if (string !== '') {
                      //     string = `${string}/${element}`;
                      //   } else string = element;
                      // });
                      // console.log('string', string);
                      // console.log('find', content.includes(string));
                      // const newContent = content.replace(string, dropDownValue);
                      // setContent(newContent.replace('(', '').replace(')', ''));
                      // console.log('content', newContent);
                      let newContent = `${firstPart} ${dropDownValue} ${secondPart}`;
                      if (task?.hasSecondDropdown) {
                        newContent = `${firstPart} ${dropDownValue} et ${dropDownValue2} ${secondPart}`;
                      }
                      setContent(newContent);
                      onSaveTask(index, newContent);
                    } else if (task.hasChoice) {
                      const newContent = `${firstPart} ${choiceValue} ${secondPart}`;
                      setContent(newContent);
                      onSaveTask(index, newContent);
                    } else if (task.hasTextField) {
                      const newContent = `${firstPart} ${text} ${secondPart}`;
                      setContent(newContent);
                      onSaveTask(index, newContent);
                    }

                    setDisplayFields(false);
                  }}
                >
                  <Typography>Enregister</Typography>
                </Button>
              </>
            ) : (
              content
            )}
            <Button
              onClick={() => {
                onDeleteTask(index);
              }}
            >
              <Typography>Supprimer</Typography>
            </Button>
          </>
        </Box>
      )}
    </Draggable>
  );
}

export default Task;
