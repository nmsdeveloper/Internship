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

const email = window.localStorage.getItem("EmailJury");
getDocument("Juries", email);
getCollection("Offers");
getCollection("Requests", "Jury");

const currnetImage = window.localStorage.getItem("ImageJury");
const currnetName = window.localStorage.getItem("NameJury");
const currnetSurname = window.localStorage.getItem("SurnameJury");
const currentDate = window.localStorage.getItem("DateJury");
const currentEmail = window.localStorage.getItem("EmailJury");

const imageInput = document.getElementById("image-input");
const nameInput = document.getElementById("name-input");
const surnameInput = document.getElementById("surname-input");
const dateInput = document.getElementById("date-input");
const emailInput = document.getElementById("email-input");
imageInput.src = currnetImage;
nameInput.value = currnetName;
surnameInput.value = currnetSurname;
dateInput.value = currentDate;
emailInput.value = currentEmail;

const profileForm = document.getElementById("profile-form");
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = profileForm.elements["name"].value;
  const surname = profileForm.elements["surname"].value;
  const address = profileForm.elements["address"].value;
  const date = profileForm.elements["date"].value;

  const dataProfile = {
    name: name,
    surname: surname,
    address: address,
    date: date,
  };

  updateDocument("Juries", email, dataProfile);
});

document.getElementById("signout").addEventListener("click", () => {
  window.localStorage.setItem("EmailJury", "");
  window.localStorage.setItem("ImageJury", "");
  window.localStorage.setItem("NameJury", "");
  window.localStorage.setItem("SurnameJury", "");
  window.localStorage.setItem("DeptJury", "");
  window.localStorage.setItem("AddressJury", "");
  window.localStorage.setItem("DateJury", "");
  window.localStorage.setItem("EmailJury", "");

  logout();
});
