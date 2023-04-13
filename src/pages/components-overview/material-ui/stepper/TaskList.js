import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

function TaskList({ tasks, onDeleteTask, onSaveTask, setFieldValue, formikValue }) {
  return (
    <Droppable droppableId="task-list">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          {tasks.map((task, index) => (
            <Task
              key={task.id}
              task={task}
              index={index}
              onDeleteTask={onDeleteTask}
              onSaveTask={onSaveTask}
              setFieldValue={setFieldValue}
              formikValue={formikValue}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default TaskList;
