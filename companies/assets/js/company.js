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

/* Offer */
const offerForm = document.getElementById("offer-form");
offerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = window.localStorage.getItem("Email");
  getDocument("Companies", email);

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
// getCollection("Companies");

var offer = new Swiper(".offer-slide", {
  spaceBetween: 32,
  centeredSlides: true,
  slidesPerView: "auto",

  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
});

var intern = new Swiper(".intern-slide", {
  spaceBetween: 32,
  centeredSlides: true,
  slidesPerView: "auto",

  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
});

// è
// é
// L'etudiant sera charger de l'administration du réseau de l'entreprise sur la supervision du chef de departement réseau.
