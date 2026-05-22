const items = JSON.parse(localStorage.getItem("items")) || [];

function saveItems() {
  localStorage.setItem("items", JSON.stringify(items));
}

function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const priority = document.getElementById("itemPriority").value;

  if (!name || Number.isNaN(price) || price <= 0) {
    alert("Preencha o nome e o preço corretamente.");
    return;
  }

  items.push({
    id: Date.now(),
    name,
    price,
    priority,
    checked: false,
  });

  saveItems();

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemPriority").value = "Alta";

  renderItems();
}

function renderItems() {
  const itemList = document.getElementById("itemList");
  itemList.innerHTML = "";

  let selectedTotal = 0;
  let generalTotal = 0;

  items.forEach((item) => {
    generalTotal += item.price;
    if (item.checked) selectedTotal += item.price;

    let priorityClass = "priority-low";
    if (item.priority === "Alta") priorityClass = "priority-high";
    if (item.priority === "Média") priorityClass = "priority-medium";

    itemList.innerHTML += `
      <tr>
        <td>
          <input type="checkbox" ${item.checked ? "checked" : ""} onchange="toggleItem(${item.id})">
        </td>
        <td>${item.name}</td>
        <td>R$ ${item.price.toFixed(2)}</td>
        <td class="${priorityClass}">${item.priority}</td>
        <td>
          <button class="delete-btn" onclick="deleteItem(${item.id})">Excluir</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("totalItems").innerText = items.length;
  document.getElementById("selectedTotal").innerText = `R$ ${selectedTotal.toFixed(2)}`;
  document.getElementById("generalTotal").innerText = `R$ ${generalTotal.toFixed(2)}`;
}

function toggleItem(id) {
  const item = items.find((item) => item.id === id);
  if (!item) return;
  item.checked = !item.checked;
  saveItems();
  renderItems();
}

function deleteItem(id) {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return;
  items.splice(index, 1);
  saveItems();
  renderItems();
}

renderItems();