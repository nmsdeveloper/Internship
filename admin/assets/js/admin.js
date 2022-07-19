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
  levelStudent = document.querySelector(".student-level.active").textContent,
  studentTable = document.getElementById("student-table");

studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = studentForm.elements["name"].value;
  const surname = studentForm.elements["surname"].value;
  const faculty = studentForm.elements["faculty"].value;
  const date = studentForm.elements["date"].value;
  const gender = genderStudent == "ri-men-line" ? "Masculin" : "Féminin";
  const level = levelStudent;
  const address = studentForm.elements["address"].value;
  const email = studentForm.elements["email"].value;
  const password = studentForm.elements["password"].value;

  const dataStudent = {
    image:
      "https://firebasestorage.googleapis.com/v0/b/nms-projet.appspot.com/o/students%2Fimages%2Fuser-icon-2098873_1280.png?alt=media&token=42389965-3167-4f87-8244-62d41c226b7b",
    name: name,
    surname: surname,
    faculty: faculty,
    date: date,
    gender: gender,
    level: level,
    address: address,
    email: email,
  };

  createUser(email, password, "Students", email, dataStudent);
});

getCollection("Students");

/* teacher */
const teacherForm = document.getElementById("teacher-form"),
  genderTeacher = document.querySelector(".teacher-gender.active i").classList;
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

  const dataTeacher = {
    image:
      "https://firebasestorage.googleapis.com/v0/b/nms-projet.appspot.com/o/students%2Fimages%2Fuser-icon-2098873_1280.png?alt=media&token=42389965-3167-4f87-8244-62d41c226b7b",
    name: name,
    surname: surname,
    date: date,
    gender: gender,
    department: dept,
    address: address,
    email: email,
  };

  createUser(email, password, "Teachers", email, dataTeacher);
});
getCollection("Teachers");

/* jury */
const jurytForm = document.getElementById("jury-form"),
  genderJury = document.querySelector(".jury-gender.active i").classList;

jurytForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = jurytForm.elements["name"].value;
  const surname = jurytForm.elements["surname"].value;
  const date = jurytForm.elements["date"].value;
  const gender = genderJury == "ri-men-line" ? "Masculin" : "Féminin";
  const email = jurytForm.elements["email"].value;
  const password = jurytForm.elements["password"].value;

  const dataJury = {
    image:
      "https://firebasestorage.googleapis.com/v0/b/nms-projet.appspot.com/o/students%2Fimages%2Fuser-icon-2098873_1280.png?alt=media&token=42389965-3167-4f87-8244-62d41c226b7b",
    name: name,
    surname: surname,
    date: date,
    gender: gender,
    email: email,
  };

  createUser(email, password, "Juries", email, dataJury);
});
getCollection("Juries");

/* company */
const companyForm = document.getElementById("company-form");

companyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = companyForm.elements["name"].value;
  const address = companyForm.elements["address"].value;
  const email = companyForm.elements["email"].value;
  const password = companyForm.elements["password"].value;

  const updateCompany = {
    folder: "CompanyLogo",
    filename: takeFile.files[0].name,
    file: takeFile.files[0],
  };
  const dataCompany = {
    image: "",
    name: name,
    address: address,
    email: email,
  };

  createUser(email, password, "Companies", email, dataCompany, updateCompany);
});
getCollection("Companies");

/* internship */

document.getElementById("signout").addEventListener("click", () => {
  logout();
});
