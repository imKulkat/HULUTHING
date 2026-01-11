/* ---------------------------------------------------------
   DEFAULT PROFILES (used only on first run)
--------------------------------------------------------- */

const defaultProfiles = [
  { id: "kul", name: "Kul", avatar: "😎", color: "#4b8bff", isAdmin: true },
  { id: "guest", name: "Guest", avatar: "🙂", color: "#ff6b6b" },
  { id: "kids", name: "Kids", avatar: "🐸", color: "#00c9a7" },
  { id: "add", name: "Add Profile", avatar: "+", color: "#888", isAdd: true }
];

/* ---------------------------------------------------------
   LOAD / SAVE PROFILES (localStorage)
--------------------------------------------------------- */

function loadProfiles() {
  const saved = localStorage.getItem("mediaOS_profiles");
  if (saved) {
    const parsed = JSON.parse(saved);

    // SAFETY: ensure Add Profile tile exists
    const hasAdd = parsed.some(p => p.isAdd);
    if (!hasAdd) parsed.push({ id: "add", name: "Add Profile", avatar: "+", color: "#888", isAdd: true });

    // SAFETY: ensure Add Profile tile is last
    parsed.sort((a, b) => (a.isAdd ? 1 : b.isAdd ? -1 : 0));

    return parsed;
  }

  return defaultProfiles;
}

function saveProfiles() {
  localStorage.setItem("mediaOS_profiles", JSON.stringify(profiles));
}

/* ---------------------------------------------------------
   ACTIVE PROFILES ARRAY
--------------------------------------------------------- */

let profiles = loadProfiles();
let index = 0;
let editingIndex = null;

/* ---------------------------------------------------------
   RENDER PROFILES
--------------------------------------------------------- */

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
      if (!p.isAdd) openEdit(i);
    });

    container.appendChild(el);
  });

  focusProfile(0);
}

/* ---------------------------------------------------------
   FOCUS + KEYBOARD NAVIGATION
--------------------------------------------------------- */

function focusProfile(i) {
  index = i;
  const all = document.querySelectorAll(".profile");

  all.forEach((el, idx) => {
    el.classList.toggle("focused", idx === i);
    el.classList.toggle("dimmed", idx !== i);
  });

  all[i].focus();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") focusProfile((index + 1) % profiles.length);
  if (e.key === "ArrowLeft") focusProfile((index - 1 + profiles.length) % profiles.length);
  if (e.key === "Enter") selectProfile(index);
  if (e.key === "e" && !profiles[index].isAdd) openEdit(index);
});

/* ---------------------------------------------------------
   SELECT PROFILE
--------------------------------------------------------- */

function selectProfile(i) {
  const p = profiles[i];

  if (p.isAdd) {
    openCreate();
    return;
  }

  localStorage.setItem("mediaOS_activeProfile", p.id);
  window.location.href = "../home/index.html";
}

/* ---------------------------------------------------------
   EDIT EXISTING PROFILE
--------------------------------------------------------- */

function openEdit(i) {
  editingIndex = i;
  const p = profiles[i];

  document.getElementById("modal-title").textContent = "Edit Profile";
  document.getElementById("edit-name").value = p.name;
  document.getElementById("edit-avatar").value = p.avatar;
  document.getElementById("edit-color").value = p.color;

  document.getElementById("delete-profile").style.display = p.isAdmin ? "none" : "inline-block";
  document.getElementById("edit-modal").classList.remove("hidden");
}

/* ---------------------------------------------------------
   CREATE NEW PROFILE
--------------------------------------------------------- */

function openCreate() {
  editingIndex = null;

  document.getElementById("modal-title").textContent = "Create Profile";
  document.getElementById("edit-name").value = "";
  document.getElementById("edit-avatar").value = "";
  document.getElementById("edit-color").value = "#4b8bff";

  document.getElementById("delete-profile").style.display = "none";
  document.getElementById("edit-modal").classList.remove("hidden");
}

/* ---------------------------------------------------------
   CLOSE MODAL
--------------------------------------------------------- */

function closeEdit() {
  document.getElementById("edit-modal").classList.add("hidden");
}

/* ---------------------------------------------------------
   SAVE (CREATE OR EDIT)
--------------------------------------------------------- */

document.getElementById("save-edit").onclick = () => {
  const name = document.getElementById("edit-name").value.trim();
  const avatar = document.getElementById("edit-avatar").value.trim() || "🙂";
  const color = document.getElementById("edit-color").value;

  if (!name) return alert("Name required");

  if (editingIndex === null) {
    // CREATE NEW PROFILE
    profiles.splice(profiles.length - 1, 0, {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      avatar,
      color
    });
  } else {
    // EDIT EXISTING PROFILE
    const p = profiles[editingIndex];
    p.name = name;
    p.avatar = avatar;
    p.color = color;
  }

  saveProfiles();
  closeEdit();
  renderProfiles();
};

/* ---------------------------------------------------------
   DELETE PROFILE
--------------------------------------------------------- */

document.getElementById("delete-profile").onclick = () => {
  if (editingIndex === null) return;

  const p = profiles[editingIndex];
  if (p.isAdmin) return alert("Cannot delete admin profile");

  profiles.splice(editingIndex, 1);
  saveProfiles();
  closeEdit();
  renderProfiles();
};

/* ---------------------------------------------------------
   CANCEL BUTTON
--------------------------------------------------------- */

document.getElementById("cancel-edit").onclick = closeEdit;

/* ---------------------------------------------------------
   INIT
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", renderProfiles);
