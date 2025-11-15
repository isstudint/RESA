# 📋 REACT SYNTAX CHEATSHEET - Quick Reference

## 🎯 COMPONENT BASICS

### Create a Component
```jsx
function MyComponent() {
  return <div>Hello!</div>;
}

export default MyComponent;
```

### Use a Component
```jsx
import MyComponent from './MyComponent';

function App() {
  return <MyComponent />;
}
```

---

## 📦 STATE (useState)

### Basic Usage
```jsx
import { useState } from 'react';

const [value, setValue] = useState(initialValue);
```

### Examples
```jsx
// String
const [name, setName] = useState('');
setName('John');

// Number
const [count, setCount] = useState(0);
setCount(count + 1);

// Boolean
const [isOpen, setIsOpen] = useState(false);
setIsOpen(true);
setIsOpen(!isOpen); // Toggle

// Array
const [items, setItems] = useState([]);
setItems([...items, newItem]);        // Add
setItems(items.filter(i => i.id !== 1)); // Remove

// Object
const [user, setUser] = useState({ name: '', age: 0 });
setUser({ ...user, name: 'John' });  // Update one property
```

---

## 🎪 RENDERING

### Show Variable
```jsx
const name = "John";
return <p>{name}</p>;
```

### Conditional (if)
```jsx
// Show if true
{isLoggedIn && <p>Welcome!</p>}

// Show one or the other
{isLoggedIn ? <Dashboard /> : <Login />}

// Multiple conditions
{status === 'loading' && <Spinner />}
{status === 'error' && <Error />}
{status === 'success' && <Data />}
```

### Lists (Loop)
```jsx
const users = ['John', 'Jane', 'Bob'];

return (
  <ul>
    {users.map((user, index) => (
      <li key={index}>{user}</li>
    ))}
  </ul>
);
```

---

## 🎯 EVENTS

### Click
```jsx
<button onClick={handleClick}>Click</button>
<button onClick={() => console.log('Clicked')}>Click</button>
```

### Form Submit
```jsx
<form onSubmit={handleSubmit}>
  <button type="submit">Submit</button>
</form>

const handleSubmit = (e) => {
  e.preventDefault(); // Important!
  // Your code
};
```

### Input Change
```jsx
<input 
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

### Other Events
```jsx
onMouseEnter={handler}   // Hover
onMouseLeave={handler}   // Leave
onFocus={handler}        // Focus input
onBlur={handler}         // Unfocus input
onKeyPress={handler}     // Key press
onKeyDown={handler}      // Key down
```

---

## 📝 FORMS

### Controlled Input
```jsx
const [email, setEmail] = useState('');

<input 
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Multiple Inputs
```jsx
const [form, setForm] = useState({
  email: '',
  password: ''
});

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};

<input name="email" onChange={handleChange} />
<input name="password" onChange={handleChange} />
```

### Form with FormData (Your way!)
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  console.log(data); // { email: '...', password: '...' }
};

<form onSubmit={handleSubmit}>
  <input name="email" />
  <input name="password" />
  <button type="submit">Submit</button>
</form>
```

---

## 🌐 API CALLS (fetch)

### Basic GET
```jsx
const [data, setData] = useState(null);

const fetchData = async () => {
  const response = await fetch('/api/data');
  const result = await response.json();
  setData(result);
};
```

### POST Request
```jsx
const sendData = async (data) => {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  return result;
};
```

### With Error Handling
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const fetchData = async () => {
  setLoading(true);
  setError('');
  
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    const result = await response.json();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🎨 STYLING

###ClassName
```jsx
<div className="my-class">Content</div>
```

### Dynamic Class
```jsx
<div className={isActive ? 'active' : 'inactive'}>

<div className={`card ${isOpen ? 'open' : 'closed'}`}>
```

### Inline Styles
```jsx
<div style={{ color: 'red', fontSize: '20px' }}>

const styles = { color: 'red', fontSize: '20px' };
<div style={styles}>
```

---

## 🔄 NAVIGATION (React Router)

### Setup (Already done in your App.jsx)
```jsx
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
</Routes>
```

### Navigate to Another Page
```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const goToLogin = () => {
    navigate('/login');
  };
  
  return <button onClick={goToLogin}>Go to Login</button>;
}
```

### Link (Like <a> tag)
```jsx
import { Link } from 'react-router-dom';

<Link to="/login">Go to Login</Link>
```

---

## 💾 LOCAL STORAGE

### Save Data
```jsx
localStorage.setItem('key', 'value');
localStorage.setItem('user', JSON.stringify(userObject));
```

### Get Data
```jsx
const value = localStorage.getItem('key');
const user = JSON.parse(localStorage.getItem('user'));
```

### Remove Data
```jsx
localStorage.removeItem('key');
localStorage.clear(); // Clear all
```

---

## 🔧 COMMON PATTERNS

### Toggle Boolean
```jsx
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(!isOpen);
```

### Increment Counter
```jsx
const [count, setCount] = useState(0);
const increment = () => setCount(count + 1);
const decrement = () => setCount(count - 1);
```

### Show/Hide Element
```jsx
const [isVisible, setIsVisible] = useState(false);

<button onClick={() => setIsVisible(!isVisible)}>
  Toggle
</button>

{isVisible && <div>I'm visible!</div>}
```

### Loading State
```jsx
const [loading, setLoading] = useState(false);

{loading ? <p>Loading...</p> : <p>Content</p>}
```

### Disabled Button While Loading
```jsx
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

---

## 🎭 JSX RULES

### Must Have One Parent
```jsx
// ❌ Wrong
return (
  <div>First</div>
  <div>Second</div>
);

// ✅ Correct
return (
  <div>
    <div>First</div>
    <div>Second</div>
  </div>
);

// ✅ Or use Fragment
return (
  <>
    <div>First</div>
    <div>Second</div>
  </>
);
```

### JavaScript in JSX Uses { }
```jsx
const name = "John";
const age = 25;

<p>Name: {name}</p>
<p>Age: {age}</p>
<p>Next year: {age + 1}</p>
```

### className not class
```jsx
// ❌ Wrong
<div class="my-class">

// ✅ Correct
<div className="my-class">
```

### htmlFor not for
```jsx
// ❌ Wrong
<label for="email">

// ✅ Correct
<label htmlFor="email">
```

### Self-Closing Tags
```jsx
<img src="..." />
<input type="text" />
<br />
```

---

## 🆚 COMPARISON TABLE

| Task | Regular JS | React |
|------|-----------|-------|
| Variable that updates UI | `let x = 5` | `const [x, setX] = useState(5)` |
| Change it | `x = 10` | `setX(10)` |
| Get input value | `input.value` | `<input value={val} onChange={(e) => setVal(e.target.value)} />` |
| Show if condition | `if (x) { show }` | `{x && <div>show</div>}` |
| Loop array | `arr.forEach()` | `{arr.map(item => <div>{item}</div>)}` |
| Add event listener | `.addEventListener('click')` | `onClick={handler}` |
| Change page | `window.location.href` | `navigate('/page')` |

---

## 🐛 COMMON MISTAKES

### Mistake 1: Forgetting e.preventDefault()
```jsx
// ❌ Form refreshes page
const handleSubmit = (e) => {
  console.log('submit');
};

// ✅ Correct
const handleSubmit = (e) => {
  e.preventDefault();
  console.log('submit');
};
```

### Mistake 2: Directly Modifying State
```jsx
// ❌ Wrong
count = count + 1;

// ✅ Correct
setCount(count + 1);
```

### Mistake 3: Not Using key in Lists
```jsx
// ❌ Missing key
{items.map(item => <div>{item}</div>)}

// ✅ Correct
{items.map((item, index) => <div key={index}>{item}</div>)}
```

### Mistake 4: Using async in useEffect Wrong
```jsx
// ❌ Wrong
useEffect(async () => {
  await fetch();
}, []);

// ✅ Correct
useEffect(() => {
  const fetchData = async () => {
    await fetch();
  };
  fetchData();
}, []);
```

---

## 🎓 YOUR REGISTER.JSX DECODED

```jsx
// State variables (remember values)
const [isSignUp, setIsSignUp] = useState(false);  // Toggle between login/signup
const [error, setError] = useState('');            // Error message
const [success, setSuccess] = useState('');        // Success message
const [loading, setLoading] = useState(false);     // Loading state

// Functions to switch forms
const switchToSignUp = (e) => { 
  e.preventDefault(); 
  setIsSignUp(true);    // Show signup form
};

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();                              // Don't refresh page
  
  const formData = new FormData(e.target);         // Get all form fields
  const data = Object.fromEntries(formData);       // Convert to object
  
  const url = isSignUp ? '/api/register' : '/api/login';  // Choose endpoint
  
  const response = await fetch(`http://localhost:5000${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)                     // Send as JSON
  });
  
  const result = await response.json();            // Get response
  
  if (response.ok) {
    setSuccess(result.message);                    // Show success
  } else {
    setError(result.error);                        // Show error
  }
};

// Conditional rendering
{error && <div className="error-message">{error}</div>}
// Translation: If error has a value, show this div

{isSignUp ? 'Sign Up' : 'Sign In'}
// Translation: If isSignUp is true, show "Sign Up", otherwise "Sign In"
```

---

## 🚀 PRACTICE EXERCISES

### Exercise 1: Simple Counter
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

### Exercise 2: Show/Hide Text
```jsx
function Toggle() {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        Toggle
      </button>
      {isVisible && <p>Hello World!</p>}
    </div>
  );
}
```

### Exercise 3: Simple Form
```jsx
function SimpleForm() {
  const [name, setName] = useState('');
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      alert(`Hello ${name}!`);
    }}>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button type="submit">Greet</button>
    </form>
  );
}
```

---

## 💡 TIPS

1. **Always use const** for state variables
2. **Always call hooks at the top** of component
3. **Use meaningful names** for state variables
4. **Console.log often** to see what's happening
5. **Read error messages** - they usually tell you exactly what's wrong

---

## 📚 REMEMBER

- React components are just functions that return HTML
- State (useState) makes values "remember" and update the UI
- JSX is HTML with JavaScript superpowers ({ })
- Everything in { } is JavaScript
- React is just a library - it's still JavaScript!

**Keep this cheatsheet handy while coding!** 🎉
