/\*
let isBobo = (a) => {
return a};
isBobo(a = false)
let mess;
let age = 25;
if (isBobo(a) && age >= 25){
mess = "hello";
console.log(mess)
}
else{
mess = "No"
console.log(mess)
}

\*/

let isBobo = (a) => {
return a};
isBobo(a = false)
let age = 25;
let message = isBobo(a) && age >= 25 ? "hello" : "No";
console.log(message);

<!DOCTYPE html>
<html>

<body>
    <h1 class="title">Hello World!</h1>
    <button class="butt">AHHH</button>
</body>

</html>
<script>
    let num = 0;
    const button = document.querySelector(".butt");
    const adder = () => {
        num += 1;
        console.log(num);
        return num; // Add this line
    };
    button.addEventListener('click', (event) => { adder(),
        console.log("button clicked" , event) })
    const bod = document.body
    bod.append("***** yall", " heat this ***** up")
</script>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <p >FUCK COUNTER: <span class="display" >1</span></p>
    <button class="inc">ADD</button>
    <button class="dec">DECREASE</button>
    <button class="res">RESET</button>
</body>
</html>
<script>
let n = 0;
const counter = document.querySelector(".display");
counter.style.color = "red";

const add = document.querySelector(".inc");
add.style.backgroundColor = "green";
add.addEventListener("click", () => {
n += 1
counter.textContent = n;
})

const sub = document.querySelector(".dec");
sub.style.fontWeight = "bold"
sub.addEventListener("click" , () => {
n -= 1
counter.textContent = n;
})

const reset = document.querySelector(".res");
reset.style.backgroundColor = "Blue"
reset.addEventListener('click', () => {
n = 0
counter.textContent = n;
})

</script>

/////////////////////////////

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form id="loginForm">
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
        <div id="error" style="color: red;"></div>
    </form>
</body>
</html>
<script>
    const form = document.querySelector("#loginForm");
    const error = document.querySelector("#error")

    form.addEventListener("submit" , (e) => {
        e.preventDefault;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value

        if(!email || !password){
            error.textContent = "Please FILL"
            return;
        }

        if(password.length < 8){
            error.textContent = "Password must"
            return;
        }

        console.log("Log" , (email,password))
        error.textContent = '';
    })

</script>

///////////////////////////

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form id="loginForm">
        <input type="number" id="num1" placeholder="Number 1" required>
        <label for="add">+</label>
        <input type="radio" id="add" name="operator" value="+">
        <label for="sub">-</label>
        <input type="radio" id="sub" name="operator" value="-">
        <label for="mult">*</label>
        <input type="radio" id="mult" name="operator" value="*">
        <label for="divd">/</label>
        <input type="radio" id="divd" name="operator" value="/">
        <input type="number" id="num2" placeholder="Number 2" required>
        <button type="submit">Calculate</button>
        <div><p>Answer:<span class="answer"></span></p></div>
    </form>
</body>
</html>
<script>

const form = document.querySelector("#loginForm");

form.addEventListener("submit" , (e) => {
let answer;
e.preventDefault();
let display = document.querySelector(".answer")
const num1 = +document.querySelector("#num1").value;
const num2 = +document.querySelector("#num2").value;
const operator = document.querySelector('input[name="operator"]:checked').value;

    if(operator == '+'){
        answer = num1 + num2
        display.textContent = answer;
    }
    if(operator == '-'){
        answer = num1 - num2
        display.textContent = answer;
    }
    if(operator == '*'){
        answer = num1 * num2
        display.textContent = answer;
    }
    if(operator == '/'){
        answer = num1 / num2
        display.textContent = answer;
    }

    console.log({num1 , operator , num2})

})

</script>
