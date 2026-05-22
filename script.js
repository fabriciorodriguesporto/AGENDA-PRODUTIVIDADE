let users =
JSON.parse(localStorage.getItem("users")) || [];

let currentUser =
JSON.parse(localStorage.getItem("currentUser")) || null;

function saveUsers(){
  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );
}

function showLogin(){

  document.getElementById("loginForm")
  .style.display = "block";

  document.getElementById("registerForm")
  .style.display = "none";
}

function showRegister(){

  document.getElementById("loginForm")
  .style.display = "none";

  document.getElementById("registerForm")
  .style.display = "block";
}

function register(){

  const name =
  document.getElementById("registerName").value;

  const email =
  document.getElementById("registerEmail").value;

  const password =
  document.getElementById("registerPassword").value;

  if(!name || !email || !password){
    alert("Preencha todos os campos");
    return;
  }

  const exists =
  users.find(user => user.email === email);

  if(exists){
    alert("Usuário já existe");
    return;
  }

  const user = {
    name,
    email,
    password,
    items:[]
  };

  users.push(user);

  saveUsers();

  alert("Cadastro realizado!");

  showLogin();
}

function login(){

  const email =
  document.getElementById("loginEmail").value;

  const password =
  document.getElementById("loginPassword").value;

  const user = users.find(
    u =>
    u.email === email &&
    u.password === password
  );

  if(!user){
    alert("Login inválido");
    return;
  }

  currentUser = user;

  localStorage.setItem(
    "currentUser",
    JSON.stringify(currentUser)
  );

  loadDashboard();
}

function logout(){
  localStorage.removeItem("currentUser");
  location.reload();
}

function loadDashboard(){

  document.getElementById("authBox")
  .classList.add("hidden");

  document.getElementById("dashboard")
  .classList.remove("hidden");

  document.getElementById("welcome")
  .innerText =
  "Olá, " + currentUser.name;

  renderItems();
}

function addItem(){

  const name =
  document.getElementById("itemName").value;

  const price =
  parseFloat(
    document.getElementById("itemPrice").value
  );

  const priority =
  document.getElementById("itemPriority").value;

  if(!name || !price){
    alert("Preencha todos os campos");
    return;
  }

  currentUser.items.push({
    id: Date.now(),
    name,
    price,
    priority,
    checked:false
  });

  updateUser();

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";

  renderItems();
}

function updateUser(){

  users = users.map(user => {

    if(user.email === currentUser.email){
      return currentUser;
    }

    return user;
  });

  saveUsers();

  localStorage.setItem(
    "currentUser",
    JSON.stringify(currentUser)
  );
}

function renderItems(){

  const itemList =
  document.getElementById("itemList");

  itemList.innerHTML = "";

  let selectedTotal = 0;
  let generalTotal = 0;

  currentUser.items.forEach(item => {

    generalTotal += item.price;

    if(item.checked){
      selectedTotal += item.price;
    }

    let priorityClass = "";

    if(item.priority === "Alta"){
      priorityClass = "priority-high";
    }

    if(item.priority === "Média"){
      priorityClass = "priority-medium";
    }

    if(item.priority === "Baixa"){
      priorityClass = "priority-low";
    }

    itemList.innerHTML += `
      <tr>

        <td>
          <input
          type="checkbox"

          ${item.checked ? "checked" : ""}

          onchange="toggleItem(${item.id})">
        </td>

        <td>${item.name}</td>

        <td>
          R$ ${item.price.toFixed(2)}
        </td>

        <td class="${priorityClass}">
          ${item.priority}
        </td>

        <td>
          <button
          class="delete-btn"

          onclick="deleteItem(${item.id})">

          Excluir

          </button>
        </td>

      </tr>
    `;
  });

  document.getElementById("totalItems")
  .innerText = currentUser.items.length;

  document.getElementById("selectedTotal")
  .innerText =
  "R$ " + selectedTotal.toFixed(2);

  document.getElementById("generalTotal")
  .innerText =
  "R$ " + generalTotal.toFixed(2);
}

function toggleItem(id){

  currentUser.items =
  currentUser.items.map(item => {

    if(item.id === id){
      item.checked = !item.checked;
    }

    return item;
  });

  updateUser();

  renderItems();
}

function deleteItem(id){

  currentUser.items =
  currentUser.items.filter(
    item => item.id !== id
  );

  updateUser();

  renderItems();
}

if(currentUser){
  loadDashboard();
}