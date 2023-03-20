import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

function TaskList({ tasks, onDeleteTask, onSaveTask }) {
  return (
    <Droppable droppableId="task-list">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{ display: 'flex', flexDirection: 'column', width: '80%' }}
        >
          {tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} onDeleteTask={onDeleteTask} onSaveTask={onSaveTask} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default TaskList;
