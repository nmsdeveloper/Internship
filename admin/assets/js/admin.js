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
