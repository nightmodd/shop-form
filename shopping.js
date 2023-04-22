const shoppingForm = document.querySelector(".shopping");
const list = document.querySelector(".list");

//Array to hold our state (Items)
let items = [];

function handleSubmit(e) {
  e.preventDefault();
  //get the value from the input
  const name = e.currentTarget.item.value;

  //if it's empty, then don't submit it
  if (!name) {
    window.alert("Please enter an item");
    return;
  }

  const item = {
    name,
    id: Date.now(),
    complete: false,
  };
  items.push(item);
  e.target.reset(); // Clear the form

  // fire off a custom event that will tell anyone else who cares that the items have been updated!
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function displayItems() {
  const html = items
    .map(
      (item) => `<li class="shopping-item">
      <input
        value="${item.id}"
        type="checkbox"
        ${item.complete && "checked"}
      >
      <span class="itemName">${item.name}</span>
      <button
        aria-label="Remove ${item.name}"
        value="${item.id}"
      >&times;</buttonaria-label="Remove>
  </li>`
    )
    .join("");
  list.innerHTML = html;
}

function mirrorToLocalStorage() {
  localStorage.setItem("items", JSON.stringify(items));
}

function restoreFromLocalStorage() {
  // pull the items from LS
  const storedItems = JSON.parse(localStorage.getItem("items"));
  if (storedItems.length) {
    items.push(...storedItems);
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
  }
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function markAsComplete(id) {
  const itemRef = items.find((item) => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

shoppingForm.addEventListener("submit", handleSubmit);
list.addEventListener("itemsUpdated", displayItems);
list.addEventListener("itemsUpdated", mirrorToLocalStorage);

// Event Delegation: We listen or the click on the list <ul> but then delegate the click over to the button if that is what was clicked
list.addEventListener("click", function (e) {
  const id = parseInt(e.target.value);
  if (e.target.matches("button")) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(id);
  }
});

restoreFromLocalStorage();
