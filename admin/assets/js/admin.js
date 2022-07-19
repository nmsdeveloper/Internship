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

const removeActive = (genderId) => {
  const genderItem = document.querySelectorAll(genderId);
  genderItem.forEach((item) => {
    item.classList.remove("active");
  });
};
const addActive = (genderId) => {
  const genderItem = document.querySelectorAll(genderId);

  genderItem.forEach((item) => {
    item.addEventListener("click", () => {
      removeActive(genderId);
      item.classList.add("active");
    });
  });
};

const attributeBtn = document.querySelectorAll(".internship-attribute");
attributeBtn.forEach((attr) => {
  attr.addEventListener("click", () => {
    showPopup("internship-popup");
  });
});
const showPopup = (popId) => {
  const popup = document.getElementById(popId);
  popup.style.display = "flex";
};
const hiddenPopup = (closeId) => {
  const popup = document.getElementById(closeId);
  popup.style.display = "none";
};
const closePopup = document.getElementById("close-popup");
closePopup.addEventListener("click", () => {
  hiddenPopup("internship-popup");
});

addActive(".student-gender");
addActive(".teacher-gender");
addActive(".jury-gender");
addActive(".student-level");

const takeFile = document.getElementById("uploading");
document.getElementById("upload").addEventListener("click", () => {
  takeFile.click();
});

takeFile.onchange = () => {
  document.querySelector(".filename").innerHTML = takeFile.files[0].name;
};

var internship = new Swiper(".internship-slide", {
  spaceBetween: 32,
  centeredSlides: true,
  slidesPerView: "auto",

  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
});

/* dashboard */

/* student */
const studentForm = document.getElementById("student-form"),
  genderStudent = document.querySelector(".student-gender.active i").classList,
  levelStudent = document.querySelector(".student-level.active").classList,
  dataStudent = {};
studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = studentForm.elements["name"].value;
  const surname = studentForm.elements["surname"].value;
  const date = studentForm.elements["date"].value;
  const gender = genderStudent == "ri-men-line" ? "Masculin" : "Féminin";
  const level = levelStudent;
  const address = studentForm.elements["address"].value;
  const email = studentForm.elements["email"].value;
  const password = studentForm.elements["password"].value;

  dataStudent = {
    name: name,
    surname: surname,
    date: date,
    gender: gender,
    level: level,
    address: address,
    email: email,
    password: password,
  };

  setDocument("Students", email, dataStudent);
});

/* teacher */
const teacherForm = document.getElementById("student-form"),
  genderTeacher = document.querySelector(".student-gender.active i").classList,
  dataTeacher = {};

teacherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = teacherForm.elements["name"].value;
  const surname = teacherForm.elements["surname"].value;
  const date = teacherForm.elements["date"].value;
  const gender = genderTeacher == "ri-men-line" ? "Masculin" : "Féminin";
  const dept = teacherForm.elements["department"].value;
  const address = teacherForm.elements["address"].value;
  const email = teacherForm.elements["email"].value;
  const password = teacherForm.elements["password"].value;

  dataTeacher = {
    name: name,
    surname: surname,
    date: date,
    gender: gender,
    department: dept,
    address: address,
    email: email,
    password: password,
  };

  setDocument("Teachers", email, dataTeacher);
});

/* jury */
const jurytForm = document.getElementById("student-form"),
  genderJury = document.querySelector(".student-gender.active i").classList,
  dataJury = {};

jurytForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = jurytForm.elements["name"].value;
  const surname = jurytForm.elements["surname"].value;
  const date = jurytForm.elements["date"].value;
  const gender = genderJury == "ri-men-line" ? "Masculin" : "Féminin";
  const address = jurytForm.elements["address"].value;
  const email = jurytForm.elements["email"].value;
  const password = jurytForm.elements["password"].value;

  dataJury = {
    name: name,
    surname: surname,
    date: date,
    gender: gender,
    address: address,
    email: email,
    password: password,
  };

  setDocument("Juries", email, dataJury);
});

/* company */
const companyForm = document.getElementById("student-form"),
  dataCompany = {};

companyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const image = companyForm.elements["uploading"].value;
  const name = companyForm.elements["name"].value;
  const address = companyForm.elements["address"].value;
  const email = companyForm.elements["email"].value;
  const password = companyForm.elements["password"].value;

  const imageUrl = setFile("CompanyLogo", takeFile.files[0].name, image);

  dataCompany = {
    image: imageUrl,
    name: name,
    address: address,
    email: email,
    password: password,
  };

  setDocument("Juries", email, dataCompany);
});

/* internship */
