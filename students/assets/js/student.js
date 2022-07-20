import {
  createUser,
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

// const form = document.querySelector("form"),
//   fileInput = document.querySelector(".file-input"),
//   progressArea = document.querySelector(".progress-area"),
//   uploadedArea = document.querySelector(".uploaded-area");
// form.addEventListener("click", () => {
//   fileInput.click();
// });
// fileInput.onchange = ({ target }) => {
//   let file = target.files[0];
//   if (file) {
//     let fileName = file.name;
//     if (fileName.length >= 12) {
//       let splitName = fileName.split(".");
//       fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
//     }
//     uploadFile(fileName);
//   }
// };
// function uploadFile(name) {
//   let xhr = new XMLHttpRequest();
//   xhr.open("POST", "php/upload.php");
//   xhr.upload.addEventListener("progress", ({ loaded, total }) => {
//     let fileLoaded = Math.floor((loaded / total) * 100);
//     let fileTotal = Math.floor(total / 1000);
//     let fileSize;
//     fileTotal < 1024
//       ? (fileSize = fileTotal + " KB")
//       : (fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB");
//     let progressHTML = `<li class="row">
//                           <i class="fas fa-file-alt"></i>
//                           <div class="content">
//                             <div class="details">
//                               <span class="name">${name} • Uploading</span>
//                               <span class="percent">${fileLoaded}%</span>
//                             </div>
//                             <div class="progress-bar">
//                               <div class="progress" style="width: ${fileLoaded}%"></div>
//                             </div>
//                           </div>
//                         </li>`;
//     uploadedArea.classList.add("onprogress");
//     progressArea.innerHTML = progressHTML;
//     if (loaded == total) {
//       progressArea.innerHTML = "";
//       let uploadedHTML = `<li class="row">
//                             <div class="content upload">
//                               <i class="fas fa-file-alt"></i>
//                               <div class="details">
//                                 <span class="name">${name} • Uploaded</span>
//                                 <span class="size">${fileSize}</span>
//                               </div>
//                             </div>
//                             <i class="fas fa-check"></i>
//                           </li>`;
//       uploadedArea.classList.remove("onprogress");
//       uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
//     }
//   });
//   let data = new FormData(form);
//   xhr.send(data);
// }

/* Request */
getQueryWhere("Offers", "faculty", currentFaculty, "Student");

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

// è
// é
// L'etudiant sera charger de l'administration du réseau de l'entreprise sur la supervision du chef de departement réseau.
