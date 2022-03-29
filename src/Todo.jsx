import React, { useState } from 'react';
import { List, ListItem, ListItemText, Checkbox} from '@mui/material';
import "./Todo.css";

function Todo(props) {

  const [clicked, setClicked] = useState(false);
  const [style, setStyle] = useState("normal");

  const boxClicked = () => {
    setClicked(true);
    setStyle("checked");
  }
  const boxUnClicked = () => {
    setClicked(false);
    setStyle("normal");
  }
  return (
      <List className='todo_data'>
          <ListItem>
              <Checkbox style={{marginRight: "20px",marginLeft: "5px"}}  onClick={!clicked ? boxClicked : boxUnClicked }/>
              <ListItemText className={style} primary={props.newTodo} secondary='Dummy deadline⌛'/>
          </ListItem>
      </List>

  )
}

export default Todo;