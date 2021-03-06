import React, { useState, useEffect } from 'react';
import { URL } from './config';

const App = () => {
    const [todoList, setTodoList] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const fetchTodos = async () => {
        try {
            const res = await fetch(URL);
            const data = await res.json();
            const todosData = Object.values(data);
            const todos = todosData.map(todo => todo.title);
            setTodoList(todos);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTodos();
        document.title = `you have ${todoList.length} things to do`;
    }, [todoList.length, newTodo]);

    const handleResize = () => setWindowWidth(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    const device = () => {
        if (windowWidth < 480) {
            return 'phone';
        } else if (windowWidth < 768) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    };

    /*
    |--------------------------------------------------------------------------
    | PREV STUFF
    |--------------------------------------------------------------------------
    */

    const handleAddTodo = todo => {
        // setTodoList([...todoList, todo]);
        fetch(URL, {
            method: 'POST',
            body: JSON.stringify({ title: todo })
        })
            .then(res => res.json)
            .catch(err => console.error(err));

        setNewTodo([...newTodo, todo]);
    };

    const handleDeleteTodo = todoToDelete => {
        const updatedTodoList = todoList.filter(
            (_, todo) => todo !== todoToDelete
        );
        setTodoList(updatedTodoList);
    };

    return (
        <>
            <TodoForm addTodo={handleAddTodo} />
            {todoList.length !== 0 && (
                <>
                    <h2>Todo List</h2>
                    <ul>
                        {todoList.map((todo, index) => (
                            <Todo
                                key={Math.random()}
                                todo={todo}
                                index={index}
                                deleteTodo={handleDeleteTodo}
                            />
                        ))}
                    </ul>
                    <hr />
                    <p>
                        You are using <em>{device()}</em>
                    </p>
                </>
            )}
        </>
    );
};

/*
|--------------------------------------------------------------------------
| TODO FORM
|--------------------------------------------------------------------------
*/

const TodoForm = ({ addTodo }) => {
    const [inputValue, setInputValue] = useState('');
    const handleFormSubmit = e => {
        e.preventDefault();

        if (!inputValue) return alert('write something');
        addTodo(inputValue);
        setInputValue('');
    };

    return (
        <>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    onChange={e => setInputValue(e.target.value)}
                    value={inputValue}
                />
                <input type="submit" value="Add Todo" />
            </form>
        </>
    );
};

/*
|--------------------------------------------------------------------------
| TODO
|--------------------------------------------------------------------------
*/

const Todo = ({ todo, deleteTodo, index }) => (
    <li onClick={() => deleteTodo(index)}>{todo}</li>
);

export default App;
