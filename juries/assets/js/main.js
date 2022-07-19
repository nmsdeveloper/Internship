import {
  createUser,
  connectUser,
  statusUser,
  logout,
  resetPassword,
  setDocument,
  setCollection,
  updateDocument,
  deleteDocument,
  getDocument,
  getCollection,
  getQueryWhere,
  setFile,
  getFile,
} from "../../../firebase.js";

const authentification = document.getElementById("form");
authentification.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = elements["email"].value;
  const password = elements["password"].value;

  connectUser(email, password, "./accueil.html");
});
