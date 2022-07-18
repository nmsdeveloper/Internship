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
