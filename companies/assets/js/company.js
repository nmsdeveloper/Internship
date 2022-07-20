import {
  logout,
  setCollection,
  updateDocument,
  getDocument,
  getQueryWhere,
} from "../../../firebase.js";
const email = window.localStorage.getItem("EmailCompany");
getDocument("Companies", email);
getQueryWhere("Requests", "companyEmail", email);

const currentCompany = window.localStorage.getItem("CompanyCompany");
const currentAddress = window.localStorage.getItem("AddressCompany");
const currnetImage = window.localStorage.getItem("ImageCompany");

const imageInput = document.getElementById("image-input");
const companyInput = document.getElementById("company-input");
const addressInput = document.getElementById("address-input");
imageInput.src = currnetImage;
companyInput.value = currentCompany;
addressInput.value = currentAddress;

/* Offer */
const offerForm = document.getElementById("offer-form");
offerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const poste = offerForm.elements["poste"].value;
  const start = offerForm.elements["internship-start"].value;
  const end = offerForm.elements["internship-end"].value;
  const description = offerForm.elements["description"].value;
  const name = window.localStorage.getItem("Name");
  const address = window.localStorage.getItem("Address");
  const image = window.localStorage.getItem("Image");

  const dataOffer = {
    attribute: false,
    name: name,
    image: image,
    email: email,
    poste: poste,
    address: address,
    start: start,
    end: end,
    description: description,
    faculty: "",
  };

  setCollection("Offers", dataOffer);
});
getQueryWhere("Offers", "email", email);

/* Company */
const companyForm = document.getElementById("company-form");
companyForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = companyForm.elements["company"].value;
  const address = companyForm.elements["address"].value;

  const dataCompany = {
    name: name,
    address: address,
  };

  updateDocument("Companies", email, dataCompany);
});

getQueryWhere("Requests", "company", currentCompany, "Request");

var intern = new Swiper(".intern-slide", {
  spaceBetween: 32,
  centeredSlides: true,
  slidesPerView: "auto",

  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
});

document.getElementById("signout").addEventListener("click", () => {
  window.localStorage.setItem("EmailCompany", "");
  window.localStorage.setItem("ImageCompany", "");
  window.localStorage.setItem("AddressCompany", "");
  window.localStorage.setItem("CompanyCompany", "");

  logout();
});
