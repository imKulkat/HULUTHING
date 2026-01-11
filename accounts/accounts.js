let profiles = [
  { id: "kul", name: "Kul", avatar: "😎", color: "#4b8bff", isAdmin: true },
  { id: "guest", name: "Guest", avatar: "🙂", color: "#ff6b6b" },
  { id: "kids", name: "Kids", avatar: "🐸", color: "#00c9a7" },
  { id: "add", name: "Add Profile", avatar: "+", color: "#888", isAdd: true }
];

let index = 0;
let editingIndex = null;

function renderProfiles() {
  const container = document.getElementById("profiles");
  container.innerHTML = "";

  profiles.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "profile";
    el.dataset.index = i;
    el.style.setProperty("--accent", p.color);

    el.innerHTML = `
      <div class="profile-avatar">${p.avatar}</div>
      <div class="profile-name">${p.name}</div>
    `;

    el.addEventListener("click", () => selectProfile(i));
    el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      openEdit(i);
    });

    container.appendChild(el);
  });

  focusProfile(0);
}

function focusProfile(i) {
  index = i;
  const all = document.querySelectorAll(".profile");

  all.forEach((el, idx) => {
    el.classList.toggle("focused", idx === i);
    el.classList.toggle("dimmed", idx !== i);
  });

  all[i].focus();
}

function selectProfile(i) {
  const p = profiles[i];
  if (p.isAdd) {
    openEdit(i);
  } else {
    window.location.href = "index.html?profile=" + p.id;
  }
}

/* Editing */

function openEdit(i) {
  editingIndex = i;
  const p = profiles[i];

  document.getElementById("edit-name").value = p.name;
  document.getElementById("edit-avatar").value = p.avatar;
  document.getElementById("edit-color").value = p.color;

  document.getElementById("edit-modal").classList.remove("hidden");
}

function closeEdit() {
  document.getElementById("edit-modal").classList.add("hidden");
}

document.getElementById("save-edit").onclick = () => {
  const p = profiles[editingIndex];

  p.name = document.getElementById("edit-name").value;
  p.avatar = document.getElementById("edit-avatar").value;
  p.color = document.getElementById("edit-color").value;

  closeEdit();
  renderProfiles();
};

document.getElementById("delete-profile").onclick = () => {
  const p = profiles[editingIndex];
  if (p.isAdmin) return alert("Cannot delete admin profile");

  profiles.splice(editingIndex, 1);
  closeEdit();
  renderProfiles();
};

document.getElementById("cancel-edit").onclick = closeEdit;

/* Navigation */

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") focusProfile((index + 1) % profiles.length);
  if (e.key === "ArrowLeft") focusProfile((index - 1 + profiles.length) % profiles.length);
  if (e.key === "Enter") selectProfile(index);
  if (e.key === "e") openEdit(index);
});

document.addEventListener("DOMContentLoaded", renderProfiles);
