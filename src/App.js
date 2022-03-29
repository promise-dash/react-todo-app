import React,{ useEffect, useState }from 'react';
import './App.css';
import Todo from './Todo';
import { db } from "./firebase-config";
import { addDoc, collection, deleteDoc, query, onSnapshot, doc, updateDoc} from "firebase/firestore";
import { Button, TextField } from "@mui/material";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const [toggleBtn, setToggleBtn] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);


  const todoCollectionRef = collection(db, "todoList");

  const addTodo = async () => {
    if(!toggleBtn){
      setTodos(
        todos.map((ele)=>{
          if(ele.id === isEditItem){
            updateTodo(isEditItem, input);
          }
          return ele;
        })
      );
      deleteTodo(isEditItem);
      setInput('');
      setToggleBtn(true);
      setIsEditItem(null);
    }
    setInput('');
    await addDoc(todoCollectionRef, {todo: input});
  }

  useEffect(() => {
      const q = query(todoCollectionRef);
      const unsub = onSnapshot(q, (snapshot) => {
        setTodos(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
      });
      return () => unsub();
  },[]);


  const editTodo = (id) => {

    let editItem = todos.find((e) => {
      return (e.id === id);
    });

    setInput(editItem.todo);

    setToggleBtn(false);

    setIsEditItem(id);

  }

  const updateTodo = async (id, newValue) => {

    const todoDoc = doc(db, "todoList", id);
    const newFields = {todo: newValue};
    await updateDoc(todoDoc,newFields);
  }

  const deleteTodo = async (id) => {
    const todoDoc = doc(db, "todoList", id);
    await deleteDoc(todoDoc);
  }

  const removeAll =() => {

    todos.forEach(element => {
      deleteTodo(element.id);
    });
  }

  return (
    <div className="App">
      <h2>React Todo App🔥</h2>
     <br />

      <div className="input">
        <TextField id="standard-basic" label={toggleBtn ? "✅Write your todo" : "✍️Edit your todo"} variant="standard" style={{cursor: "pointer",width: "30%"}} onChange={(e) => {setInput(e.target.value)}} value={input}/>
        { toggleBtn ?  <Button disabled={!input} onClick={addTodo} variant="contained" style={{cursor: "pointer"}}>Add Todo</Button> :  
          <Button variant="outlined" color="success" style={{cursor: "pointer"}} onClick={addTodo}>Edit</Button> }
      </div>

     <div className="list">
        {todos.map((element) => {
                return(
                  <div className='todo_item'>
                    <Todo newTodo={element.todo}/>
                    <div className="buttons">
                      <Button variant="outlined" color="success" style={{cursor: "pointer"}} onClick={() => {editTodo(element.id)}}>Edit</Button>
                      <Button variant="outlined" color="error" style={{cursor: "pointer"}} onClick={() => {deleteTodo(element.id)}}>Delete</Button>
                    </div>
                  </div>
                )
              })}
     </div>
     <br /><br />

     <Button variant="outlined" color="error" disabled={todos.length===0} onClick={removeAll}>Remove All</Button>

     <br /><br />

    </div>
  );
}

export default App;
