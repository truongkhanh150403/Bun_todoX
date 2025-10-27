import React from 'react'
import TaskEmptyState from './TaskEmptyState';
import TaskCards from './TaskCards';

const TaskList = ({filteredTasks, filter, handleTaskChanged}) => {

    if(!filteredTasks || filteredTasks.length === 0) {
      return <TaskEmptyState filter = {filter} />
    }

  return (
    <div className = 'space-y-3'>
      {filteredTasks.map((task, index) => (
        <TaskCards
          key = {task._id ?? index}
          task =  {task} 
          index = {index}    
          handleTaskChanged = {handleTaskChanged}   
        />
      ))}

    </div>
  )
}

export default TaskList
