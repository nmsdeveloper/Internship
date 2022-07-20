import {
  logout,
  updateDocument,
  deleteDocument,
  getDocument,
  getQueryWhere,
  setFile,
} from "../../../firebase.js";

const email = window.localStorage.getItem("EmailStudent");
getDocument("Students", email);
getDocument("Requests", email);

const currnetImage = window.localStorage.getItem("ImageStudent");
const currnetName = window.localStorage.getItem("NameStudent");
const currnetSurname = window.localStorage.getItem("SurnameStudent");
const currentFaculty = window.localStorage.getItem("FacultyStudent");
const currentAddress = window.localStorage.getItem("AddressStudent");
const currentlevel = window.localStorage.getItem("LevelStudent");
const currentGender = window.localStorage.getItem("GenderStudent");

const imageInput = document.getElementById("image-input");
const nameInput = document.getElementById("name-input");
const surnameInput = document.getElementById("surname-input");
const facultyInput = document.getElementById("faculty-input");
const addressInput = document.getElementById("address-input");
const levelInput = document.getElementById("level-input");
const genderInput = document.getElementById("gender-input");
const emailInput = document.getElementById("email-input");
imageInput.src = currnetImage;
nameInput.value = currnetName;
surnameInput.value = currnetSurname;
facultyInput.value = currentFaculty;
addressInput.value = currentAddress;
levelInput.value = currentlevel;
genderInput.value = currentGender;
emailInput.value = email;

const profileForm = document.getElementById("profile-form");
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = profileForm.elements["name"].value;
  const surname = profileForm.elements["surname"].value;
  const faculty = profileForm.elements["faculty"].value;
  const address = profileForm.elements["address"].value;
  const level = profileForm.elements["level"].value;
  const gender = profileForm.elements["gender"].value;

  const dataProfile = {
    name: name,
    surname: surname,
    address: address,
    faculty: faculty,
    level: level,
    gender: gender,
  };

  updateDocument("Students", email, dataProfile);
});

/* Request */
getQueryWhere("Offers", "faculty", currentFaculty, "Student");

const uploadFile = (type, formId, fileinputId, progressId, uploadedId) => {
  const form = document.getElementById(formId),
    fileInput = document.getElementById(fileinputId);

  form.addEventListener("click", () => {
    fileInput.click();
  });
  fileInput.onchange = ({ target }) => {
    let file = target.files[0];
    if (file) {
      let fileName = file.name;
      if (fileName.length >= 12) {
        let splitName = fileName.split(".");
        fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
      }

      const date = new Date();
      let currMonth = date.getUTCMonth() + 1;
      let currYear = date.getUTCFullYear();
      let currDay = date.getUTCDate();

      const data = {
        folder: type,
        filename: fileName,
        file: file,
        date: `${currDay}.${currMonth}.${currYear}`,
        name: currnetName,
        surname: currnetSurname,
        progress: progressId,
        uploaded: uploadedId,
      };
      setFile(data, email);
    }
  };
};
uploadFile("Rapport", "rForm", "rFile-input", "rprogress", "ruploaded");
uploadFile("Resume", "reForm", "reFile-input", "reprogress", "reuploaded");
uploadFile("Fichier", "fForm", "fFile-input", "fprogress", "fuploaded");

document.getElementById("remove-intern").addEventListener("click", () => {
  if (window.confirm("Avez-vous terminer votre stage?")) {
    deleteDocument("Requests", email);
  }
});

document.getElementById("signout").addEventListener("click", () => {
  window.localStorage.setItem("EmailStudent", "");
  window.localStorage.setItem("ImageStudent", "");
  window.localStorage.setItem("NameStudent", "");
  window.localStorage.setItem("SurnameStudent", "");
  window.localStorage.setItem("FacultyStudent", "");
  window.localStorage.setItem("AddressStudent", "");
  window.localStorage.setItem("LevelStudent", "");
  window.localStorage.setItem("GenderStudent", "");

  logout();
});