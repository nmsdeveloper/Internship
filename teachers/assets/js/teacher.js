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

const email = window.localStorage.getItem("EmailTeacher");
getDocument("Teachers", email);
getCollection("Offers");
getCollection("Requests", "Teacher");

const currnetImage = window.localStorage.getItem("ImageTeacher");
const currnetName = window.localStorage.getItem("NameTeacher");
const currnetSurname = window.localStorage.getItem("SurnameTeacher");
const currentDept = window.localStorage.getItem("DeptTeacher");
const currentAddress = window.localStorage.getItem("AddressTeacher");
const currentDate = window.localStorage.getItem("DateTeacher");
const currentEmail = window.localStorage.getItem("EmailTeacher");

const imageInput = document.getElementById("image-input");
const nameInput = document.getElementById("name-input");
const surnameInput = document.getElementById("surname-input");
const deptInput = document.getElementById("dept-input");
const addressInput = document.getElementById("address-input");
const dateInput = document.getElementById("date-input");
const emailInput = document.getElementById("email-input");
imageInput.src = currnetImage;
nameInput.value = currnetName;
surnameInput.value = currnetSurname;
deptInput.value = currentDept;
addressInput.value = currentAddress;
dateInput.value = currentDate;
emailInput.value = currentEmail;

const profileForm = document.getElementById("profile-form");
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = profileForm.elements["name"].value;
  const surname = profileForm.elements["surname"].value;
  const department = profileForm.elements["department"].value;
  const address = profileForm.elements["address"].value;
  const date = profileForm.elements["date"].value;

  const dataProfile = {
    name: name,
    surname: surname,
    address: address,
    department: department,
    date: date,
  };

  updateDocument("Teachers", email, dataProfile);
});

document.getElementById("signout").addEventListener("click", () => {
  window.localStorage.setItem("EmailTeacher", "");
  window.localStorage.setItem("ImageTeacher", "");
  window.localStorage.setItem("NameTeacher", "");
  window.localStorage.setItem("SurnameTeacher", "");
  window.localStorage.setItem("DeptTeacher", "");
  window.localStorage.setItem("AddressTeacher", "");
  window.localStorage.setItem("DateTeacher", "");
  window.localStorage.setItem("EmailTeacher", "");

  logout();
});
