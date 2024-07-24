import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getTasks, updateTaskStatus, deleteTask, createTask, updateTask } from '../../api'; 
import { notification, Drawer, Button, Input, Select, Card } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import formattedDateTime from '../../Utils/helper';
import "./Task.css"
const { Option } = Select;

const Task = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
  
    const fetchTasks = async () => {
      try {
        const response = await getTasks({ searchTerm, sortBy });
        setTasks({
          todo: response.data[0]?.todo || [],
          inProgress: response.data[0]?.in_progress || [],
          done: response.data[0]?.done || []
        });
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to fetch tasks.'
        });
      }
    };

    fetchTasks();
  }, [searchTerm, sortBy]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
  
  
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
  
    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;
  

    const startColumnTasks = Array.from(tasks[sourceColumn] || []);
    const [removed] = startColumnTasks.splice(source.index, 1);
  
   
    if (sourceColumn === destinationColumn) {
    
      startColumnTasks.splice(destination.index, 0, removed);
  
      const updatedTasks = {
        ...tasks,
        [sourceColumn]: startColumnTasks
      };
  
      setTasks(updatedTasks);
      return;
    }
  
    const endColumnTasks = Array.from(tasks[destinationColumn] || []);
    endColumnTasks.splice(destination.index, 0, removed);
  
    const updatedTasks = {
      ...tasks,
      [sourceColumn]: startColumnTasks,
      [destinationColumn]: endColumnTasks
    };
  
    setTasks(updatedTasks);
  
    try {
    
      if (sourceColumn !== destinationColumn) {
        await updateTaskStatus(draggableId, destinationColumn === "inProgress" ? "in_progress" : destinationColumn);
        notification.success({
          message: 'Task Updated',
          description: 'Task status updated successfully.'
        });
      }
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: 'Failed to update task status.'
      });
    }
  };
  
  const handleDelete = async (taskId, column) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [column]: prevTasks[column].filter((task) => task._id !== taskId)
      }));
      notification.success({
        message: 'Task Deleted',
        description: 'Task deleted successfully.'
      });
    } catch (error) {
      notification.error({
        message: 'Delete Failed',
        description: 'Failed to delete task.'
      });
    }
  };

  const showDrawer = (task = null, edit = false, view = false) => {
    if (task) {
      setSelectedTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setIsEdit(edit);
      setIsView(view);
    } else {
      setSelectedTask(null);
      setTitle('');
      setDescription('');
      setIsEdit(false);
      setIsView(false);
    }
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedTask(null);
    setTitle('');
    setDescription('');
    setIsEdit(false);
    setIsView(false);
  };

  const handleSave = async () => {
    if (!title || !description) {
      notification.warning({
        message: 'Validation Error',
        description: 'Title and description are required.'
      });
      return;
    }

    try {
      if (isEdit && selectedTask) {
        await updateTask(selectedTask._id, { title, description });
        setTasks((prevTasks) => {
          let column = selectedTask.status.toLowerCase();
           column = column==="in_progress" ? "inProgress" :column
          return {
            ...prevTasks,
            [column]: prevTasks[column].map((task) =>
              task._id === selectedTask._id ? { ...task, title, description } : task
            )
          };
        });
        notification.success({
          message: 'Task Updated',
          description: 'Task updated successfully.'
        });
      } else {
        const newTask = await createTask({ title, description, status: 'TODO' });
        setTasks((prevTasks) => ({
          ...prevTasks,
          todo: [...prevTasks.todo, newTask.data]
        }));
        notification.success({
          message: 'Task Created',
          description: 'Task created successfully.'
        });
      }
      closeDrawer();
    } catch (error) {
      notification.error({
        message: 'Save Failed',
        description: 'Failed to save task.'
      });
    }
  };

  return (
    <>
      <div style={{ padding: '0.5rem', margin: "2rem 0" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer()} style={{ marginBottom: "2rem" }}>
          Add Task
        </Button>
        <div className="search-sort-container">
      <div className="search-item">
        <div>Search:</div>
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="sort-item">
        <div>Sort By:</div>
        <Select value={sortBy} onChange={(value) => setSortBy(value)}>
          <Option value="recent">Recent</Option>
          <Option value="title">Title</Option>
        </Select>
      </div>
    </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
      <div className="container">
        {['todo', 'inProgress', 'done'].map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="column"
              >
                <h3 className="columnHeader">
                  {column.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </h3>
                {tasks[column].map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="task"
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        <h4 className="taskTitle">{task.title.toUpperCase()}</h4>
                        <p className="taskDescription">{task.description}</p>
                        <small className="taskDate">Created At: {formattedDateTime(task.createdAt)}</small>
                        <div className="taskActions">
                          <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => showDrawer(task, false, true)}
                            style={{ marginRight: '4px' }}
                          />
                          <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => showDrawer(task, true)}
                            style={{ marginRight: '4px' }}
                          />
                          <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => handleDelete(task._id, column)}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>

      <Drawer
        title={isEdit ? "Edit Task" : isView ? "View Task" : "Add Task"}
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={400}
      >
        {isView ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div><strong>Title:</strong> {title}</div>
            <div><strong>Description:</strong> {description}</div>
            <div><strong>CreateAt:</strong> {formattedDateTime(selectedTask.createdAt)}</div>
          </div>
        ) : (
          <>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginBottom: '16px' }}
            />
            <Input.TextArea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ marginBottom: '16px' }}
            />
            <Button type="primary" onClick={handleSave} block>
              {isEdit ? "Save Changes" : "Add Task"}
            </Button>
          </>
        )}
      </Drawer>
    </>
  );
};

export default Task;
