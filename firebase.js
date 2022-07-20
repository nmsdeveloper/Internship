import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-analytics.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";

import {
  getFirestore,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  getDoc,
  getDocs,
  query,
  doc,
  collection,
  arrayUnion,
  where,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD52eu8wZByW51ytoGLevu3f4cY1-39Qr0",
  authDomain: "nms-projet.firebaseapp.com",
  projectId: "nms-projet",
  storageBucket: "nms-projet.appspot.com",
  messagingSenderId: "250532322646",
  appId: "1:250532322646:web:a7463fd92f113f1576caf7",
  measurementId: "G-J99L24SQJT",
};

/* Initialize Firebase */
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* Auth */
export const createUser = (
  email,
  password,
  reference,
  document,
  data,
  updateCompany = {}
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      setDocument(reference, document, data, updateCompany);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert(`${errorCode}: ${errorMessage}`);
    });
};

export const connectUser = (reference = "Admin", email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (reference != "Admin")
        getDoc(doc(db, reference, email)).then((docSnap) => {
          if (docSnap.exists()) {
            window.location.href = "./accueil.html";
          } else {
            window.alert("Email ne correspond pas...");
            logout();
          }
        });
      else window.location.href = "./accueil.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert(`${errorCode}: ${errorMessage}`);
    });
};

export const logout = () => {
  signOut(auth)
    .then(() => {
      window.location.href = "../../index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert(`${errorCode}: ${errorMessage}`);
    });
};

const resetPassword = (email) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      window.alert(
        `L'e-mail de réinitialisation du mot de passe est envoyé à l'adresse ${email}`
      );
      window.location.reload();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert(`${errorCode}: ${errorMessage}`);
    });
};

/* Firestore */
const setDocument = (reference, document, data, update = {}) => {
  setDoc(doc(db, reference, document), data).then(() => {
    if (reference == "Companies") setFile(update, data.email);
    else if (reference == "Files") setFile(update, data.email);
    else window.location.reload();
  });
};

export const setCollection = (reference, data) => {
  addDoc(collection(db, reference), data).then(() => {
    window.location.reload();
  });
};

export const updateDocument = (reference, document, data) => {
  updateDoc(doc(db, reference, document), data).then(() => {
    window.location.reload();
  });
};

export const deleteDocument = (reference, document) => {
  deleteDoc(doc(db, reference, document)).then(() => {
    window.location.reload();
  });
};

export const getDocument = (reference, documents) => {
  getDoc(doc(db, reference, documents)).then((docSnap) => {
    if (reference == "Companies") {
      window.localStorage.setItem("ImageCompany", docSnap.data().image);
      window.localStorage.setItem("CompanyCompany", docSnap.data().name);
      window.localStorage.setItem("AddressCompany", docSnap.data().address);
    } else if (reference == "Students") {
      window.localStorage.setItem("NameStudent", docSnap.data().name);
      window.localStorage.setItem("SurnameStudent", docSnap.data().surname);
      window.localStorage.setItem("FacultyStudent", docSnap.data().faculty);
      window.localStorage.setItem("AddressStudent", docSnap.data().address);
      window.localStorage.setItem("ImageStudent", docSnap.data().image);
      window.localStorage.setItem("LevelStudent", docSnap.data().level);
      window.localStorage.setItem("GenderStudent", docSnap.data().gender);
    } else if (reference == "Teachers") {
      window.localStorage.setItem("NameTeacher", docSnap.data().name);
      window.localStorage.setItem("SurnameTeacher", docSnap.data().surname);
      window.localStorage.setItem("DeptTeacher", docSnap.data().department);
      window.localStorage.setItem("AddressTeacher", docSnap.data().address);
      window.localStorage.setItem("ImageTeacher", docSnap.data().image);
      window.localStorage.setItem("DateTeacher", docSnap.data().date);
      window.localStorage.setItem("EmailTeacher", docSnap.data().email);
    } else if (reference == "Juries") {
      window.localStorage.setItem("NameJury", docSnap.data().name);
      window.localStorage.setItem("SurnameJury", docSnap.data().surname);
      window.localStorage.setItem("ImageJury", docSnap.data().image);
      window.localStorage.setItem("DateJury", docSnap.data().date);
      window.localStorage.setItem("EmailJury", docSnap.data().email);
    } else if (reference == "Requests") {
      docSnap.data().missions.forEach((miss) => {
        document.getElementById("profile-mission").innerHTML += `
            <article class="mission-card">
              <h6 class="mission-title">Mission</h6>
              <span class="mission-name">${miss.name}</span>
              <span class="mission-date">${miss.date}</span>
              <p class="mission-text">
                ${miss.text}
              </p>
            </article>
          `;
      });
      docSnap.data().remarks.forEach((rms) => {
        document.getElementById("profile-remark").innerHTML += `
            <article class="mission-card">
              <h6 class="mission-title">Remarque</h6>
              <span class="mission-name">${rms.name}</span>
              <span class="mission-date">${rms.date}</span>
              <p class="mission-text">
                ${rms.text}
              </p>
            </article>
          `;
      });
    }
  });
};

export const getCollection = (reference, slide = "") => {
  getDocs(collection(db, reference)).then((querySnap) => {
    if (reference == "Students") {
      querySnap.forEach((doc) => {
        var genre =
          doc.data().gender == "Masculin"
            ? `<i class="ri-men-line"></i>`
            : `<i class="ri-women-line"></i>`;
        document.getElementById("student-table").innerHTML += `
        <tr>
        <td><img src="${doc.data().image}" alt="" /></td>
        <td>${doc.data().name} ${doc.data().surname}</td>
        <td>${doc.data().date}</td>
        <td>${genre}</td>
        <td>${doc.data().address}</td>
        <td>${doc.data().level}</td>
        <td>${doc.data().email}</td>
        </tr>
        `;
      });
    } else if (reference == "Teachers") {
      querySnap.forEach((doc) => {
        var genre =
          doc.data().gender == "Masculin"
            ? `<i class="ri-men-line"></i>`
            : `<i class="ri-women-line"></i>`;
        document.getElementById("teacher-table").innerHTML += `
          <tr>
            <td><img src="${doc.data().image}" alt="" /></td>
            <td>${doc.data().name} ${doc.data().surname}</td>
            <td>${doc.data().date}</td>
            <td>${genre}</td>
            <td>${doc.data().address}</td>
            <td>${doc.data().department}</td>
            <td>${doc.data().email}</td>
          </tr>
        `;
      });
    } else if (reference == "Juries") {
      querySnap.forEach((doc) => {
        var genre =
          doc.data().gender == "Masculin"
            ? `<i class="ri-men-line"></i>`
            : `<i class="ri-women-line"></i>`;
        document.getElementById("jury-table").innerHTML += `
          <tr>
            <td><img src="${doc.data().image}" alt="" /></td>
            <td>${doc.data().name} ${doc.data().surname}</td>
            <td>${doc.data().date}</td>
            <td>${genre}</td>
            <td>${doc.data().email}</td>
          </tr>
        `;
      });
    } else if (reference == "Companies") {
      querySnap.forEach((doc) => {
        document.getElementById("company-table").innerHTML += `
            <tr>
              <td><img src="${doc.data().image}" alt="" /></td>
              <td>${doc.data().name}</td>
              <td>${doc.data().address}</td>
              <td>${doc.data().email}</td>
            </tr>
          `;
      });
    } else if (reference == "Faculty") {
      querySnap.forEach((doc) => {
        document.getElementById("admin-popup").innerHTML += `
        <div class="internship-option">${doc.data().faculty}</div>
        `;
      });
    } else if (reference == "Offers") {
      querySnap.forEach((doc) => {
        document.getElementById("internship-cnt").innerHTML += `
            <article class="internship-card grid">
              <div class="internship-group">
                <img
                  class="internship-logo"
                  src="${doc.data().image}"
                  alt=""
                />

                <div class="internship-location">
                  <i class="ri-map-pin-line"></i>
                  <p class="internship-address">
                  ${doc.data().address}.
                  </p>
                </div>
              </div>

              <div class="internship-data">
                <h2 class="internship-title">${doc.data().poste}</h2>
                <h6 class="internship-company">${doc.data().name}</h6>
                <p class="internship-description">
                ${doc.data().description}
                </p>
              </div>
            </article>
          `;
      });
    } else if (reference == "Requests") {
      querySnap.forEach((doc, index) => {
        let remarks = "",
          missions = "";
        doc.data().remarks.forEach((rms) => {
          remarks += `
            <span class="remark-content">
              <label for="remark-${index}">Remarque: ${
            rms.date == undefined ? "" : rms.date
          }</label>
              <p id="remark-${index}" class="remark-text">
              ${rms.text == undefined ? "" : rms.text}
              </p>
            </span>
          `;
        });
        doc.data().missions.forEach((miss) => {
          missions += `
            <span class="intern-mission">
              <label for="mission">Mission: ${
                miss.date == undefined ? "" : miss.date
              }</label>
              <div class="mission-list grid">
                <span class="mission-name">
                ${miss.text == undefined ? "" : miss.text}
                </span>
              </div>
            </span>
          `;
        });

        document.getElementById("intern-wrapper").innerHTML += `
          <div class="swiper-slide">
            <article class="intern-card grid">
              <div class="intern-info grid">
                <img
                  class="intern-image"
                  src="${doc.data().image}"
                  alt=""
                />

                <span class="intern-name">${doc.data().name} ${
          doc.data().surname
        }</span>
                <span class="intern-poste">
                ${doc.data().poste}
                </span>
                <span class="intern-date">A commencer: ${doc.data().date}</span>
                ${missions}
                ${remarks}
              </div>
              <div class="intern-mission grid">
              <form class="intern-form remark-form">
                <div class="input-desc">
                  <label for="internship-remark${index}">Remarque</label>
                    <textarea
                      id="internship-remark${index}"
                      class="internship-remark"
                      name="remark"
                    ></textarea>
                    <span id="${doc.data().email}"></span>
                  </div>

                  <div class="input-submit intern-btn">
                    <input type="submit" value="Ajouter" />
                  </div>
                </form>
              </div>
            </article>
          </div>
        `;
      });

      const remarkForm = document.querySelectorAll(".remark-form"),
        emailIntern = document.querySelectorAll(".input-desc span");

      remarkForm.forEach((rF, index) => {
        rF.addEventListener("submit", (e) => {
          e.preventDefault();
          const remark = rF.elements["remark"].value;

          const date = new Date();
          let currMonth = date.getUTCMonth() + 1;
          let currYear = date.getUTCFullYear();
          let currDay = date.getUTCDate();
          let name =
            slide == "Teacher"
              ? `${window.localStorage.getItem(
                  "NameTeacher"
                )} ${window.localStorage.getItem("SurnameTeacher")}`
              : `${window.localStorage.getItem(
                  "NameJury"
                )} ${window.localStorage.getItem("SurnameJury")}`;

          updateDocument("Requests", emailIntern[index].id, {
            remarks: arrayUnion({
              name: name,
              date: `${currDay}.${currMonth}.${currYear}`,
              text: remark,
            }),
          });
        });
      });
    } else if (reference == "Files") {
      querySnap.forEach((doc) => {
        doc.data().rapport.forEach((fr) => {
          document.getElementById("archive-container").innerHTML += `
            <div id="${fr.fileUrl}" class="archive-box">
                <i class="ri-download-line"></i>
                <div>
                  <span class="archive-name">${fr.name} ${fr.surname}</span>
                  <span class="archive-file">${fr.filename}</span>
                  <span class="archive-date">${fr.date}</span>
                  <span class="archive-email">${fr.email}</span>
                </div>
              </div>
            `;
        });
        doc.data().resume.forEach((fr) => {
          document.getElementById("archive-container").innerHTML += `
            <div id="${fr.fileUrl}" class="archive-box">
                <i class="ri-download-line"></i>
                <div>
                  <span class="archive-name">${fr.name} ${fr.surname}</span>
                  <span class="archive-file">${fr.filename}</span>
                  <span class="archive-date">${fr.date}</span>
                  <span class="archive-email">${fr.email}</span>
                </div>
              </div>
            `;
        });
        doc.data().file.forEach((fr) => {
          document.getElementById("archive-container").innerHTML += `
            <div id="${fr.fileUrl}" class="archive-box">
                <i class="ri-download-line"></i>
                <div>
                  <span class="archive-name">${fr.name} ${fr.surname}</span>
                  <span class="archive-file">${fr.filename}</span>
                  <span class="archive-date">${fr.date}</span>
                  <span class="archive-email">${fr.email}</span>
                </div>
              </div>
            `;
        });
      });

      document.querySelectorAll(".archive-box").forEach((ar, index) => {
        ar.addEventListener("click", () => {
          const archiveBox = document.querySelectorAll(".archive-box");
          archiveBox.forEach((ar) => {
            ar.addEventListener("click", () => {
              getFile(ar.id);
            });
          });
        });
      });
    }
  });
};

export const getQueryWhere = (reference, field, value, slide = "") => {
  getDocs(query(collection(db, reference), where(field, "==", value))).then(
    (querySnap) => {
      if (reference == "Offers" && slide == "Admin") {
        querySnap.forEach((doc) => {
          document.getElementById("internship-wrapper").innerHTML += `
            <div class="swiper-slide">
              <article class="internship-card grid">
                <div class="internship-group">
                  <img
                    class="internship-logo"
                    src="${doc.data().image}"
                    alt=""
                  />
        
                  <div class="internship-location">
                    <i class="ri-map-pin-line"></i>
                    <p class="internship-address">
                    ${doc.data().address}.
                    </p>
                  </div>
                </div>
        
                <div class="internship-data">
                  <h2 class="internship-title">
                  ${doc.data().poste}
                  </h2>
                  <h6 class="internship-company">Orange</h6>
                  <p class="internship-description">
                    ${doc.data().description}
                  </p>
                  <button id="${
                    doc.id
                  }" class="internship-attribute">Attribuer</button>
                </div>
              </article>
            </div>
          `;
        });
        var internship = new Swiper(".internship-slide", {
          spaceBetween: 32,
          centeredSlides: true,
          slidesPerView: "auto",

          navigation: {
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          },
        });
        const attributeBtn = document.querySelectorAll(".internship-attribute");
        attributeBtn.forEach((attr) => {
          attr.addEventListener("click", () => {
            showPopup("internship-popup");
            const option = document.querySelectorAll(".internship-option");
            option.forEach((el) => {
              el.addEventListener("click", () => {
                updateDocument("Offers", attr.id, {
                  faculty: el.textContent.trim(),
                  attribute: true,
                });
              });
            });
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
      } else if (reference == "Offers" && slide == "Student") {
        querySnap.forEach((doc) => {
          document.getElementById("student-internship-cnt").innerHTML += `
            <article class="internship-card grid">
              <div class="internship-group">
                <img
                  class="internship-logo"
                  src="${doc.data().image}"
                  alt=""
                />

                <div class="internship-location">
                  <i class="ri-map-pin-line"></i>
                  <p class="internship-address">
                  ${doc.data().address}.
                  </p>
                </div>
              </div>

              <div class="internship-data">
                <h2 class="internship-title">${doc.data().poste}</h2>
                <h6 class="internship-company">${doc.data().name}</h6>
                <p class="internship-description">
                ${doc.data().description}
                </p>
                <button id="${
                  doc.id
                }" class="internship-apply">Postuler <span class="${
            doc.data().email
          }"></span></button>
              </div>
            </article>
          `;
        });

        const apply = document.querySelectorAll(".internship-apply");
        const applySpan = document.querySelectorAll(".internship-apply span");
        const internshipTitle = document.querySelectorAll(".internship-title");

        apply.forEach((ap, index) => {
          ap.addEventListener("click", () => {
            getDoc(
              doc(db, "Requests", window.localStorage.getItem("EmailStudent"))
            ).then((docSnap) => {
              if (docSnap.exists() && docSnap.data().status) {
                window.alert("Vous avez deja un stage en cours");
              } else {
                setDocument(
                  "Requests",
                  window.localStorage.getItem("EmailStudent"),
                  {
                    status: false,
                    offer: ap.id,
                    image: window.localStorage.getItem("ImageStudent"),
                    email: window.localStorage.getItem("EmailStudent"),
                    name: window.localStorage.getItem("NameStudent"),
                    surname: window.localStorage.getItem("SurnameStudent"),
                    level: window.localStorage.getItem("LevelStudent"),
                    faculty: window.localStorage.getItem("FacultyStudent"),
                    poste: internshipTitle[index].textContent.trim(),
                    companyEmail: applySpan[index].classList.toString(),
                    missions: [
                      {
                        date: "",
                        name: "",
                        text: "",
                      },
                    ],
                    remarks: [
                      {
                        date: "",
                        name: "",
                        text: "",
                      },
                    ],
                  }
                );
              }
            });
          });
        });
      } else if (reference == "Offers") {
        querySnap.forEach((doc) => {
          document.getElementById("offer-wrapper").innerHTML += `
            <div class="swiper-slide">
                <article class="offer-card grid">
                  <h2 class="offer-title">${doc.data().poste}</h2>
                  <div class="offer-location">
                    <i class="ri-map-pin-line"></i>
                    <p class="offer-address">
                    ${doc.data().address}
                    </p>
                  </div>
                  <p class="offer-description">
                  ${doc.data().description}
                  </p>
                </article>
              </div>
            `;
        });
        var offer = new Swiper(".offer-slide", {
          spaceBetween: 32,
          centeredSlides: true,
          slidesPerView: "auto",

          navigation: {
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          },
        });
      } else if (reference == "Requests" && slide == "Request") {
        querySnap.forEach((doc, index) => {
          let remarks = "",
            missions = "";
          doc.data().remarks.forEach((rms) => {
            remarks += `
              <span class="remark-content">
                <label for="remark-${index}">Remarque: ${
              rms.date == undefined ? "" : rms.date
            }</label>
                <p id="remark-${index}" class="remark-text">
                ${rms.text == undefined ? "" : rms.text}
                </p>
              </span>
            `;
          });
          doc.data().missions.forEach((miss) => {
            missions += `
              <span class="intern-mission">
                <label for="mission">Mission: ${
                  miss.date == undefined ? "" : miss.date
                }</label>
                <div class="mission-list grid">
                  <span class="mission-name">
                  ${miss.text == undefined ? "" : miss.text}
                  </span>
                </div>
              </span>
            `;
          });

          document.getElementById("intern-wrapper").innerHTML += `
            <div class="swiper-slide">
              <article class="intern-card grid">
                <div class="intern-info grid">
                  <img
                    class="intern-image"
                    src="${doc.data().image}"
                    alt=""
                  />

                  <span class="intern-name">${doc.data().name} ${
            doc.data().surname
          }</span>
                  <span class="intern-poste">
                  ${doc.data().poste}
                  </span>
                  <span class="intern-date">A commencer: ${
                    doc.data().date
                  }</span>
                  ${missions}
                  ${remarks}
                </div>
                <div class="intern-mission grid">
                <form class="intern-form remark-form">
                  <div class="input-desc">
                    <label for="internship-remark${index}">Remarque</label>
                      <textarea
                      id="internship-remark${index}"
                      class="internship-remark"
                      name="remark"
                    ></textarea>
                      <span id="${doc.data().email}"></span>
                    </div>

                    <div class="input-submit intern-btn">
                      <input type="submit" value="Ajouter" />
                    </div>
                  </form>
                  <form class="intern-form mission-form">
                    <div class="input-box">
                      <div class="input-icon">
                        <i class="ri-user-line"></i>
                      </div>
                      <input
                        class="intern-input"
                        name="mission"
                        type="text"
                        placeholder="Mission"
                      />
                    </div>
                    <div class="input-submit intern-btn">
                      <input type="submit" value="Ajouter" />
                    </div>
                  </form>
                </div>
              </article>
            </div>
          `;
        });

        const remarkForm = document.querySelectorAll(".remark-form"),
          missionForm = document.querySelectorAll(".mission-form"),
          emailIntern = document.querySelectorAll(".input-desc span");

        remarkForm.forEach((rF, index) => {
          rF.addEventListener("submit", (e) => {
            e.preventDefault();
            const remark = rF.elements["remark"].value;

            const date = new Date();
            let currMonth = date.getUTCMonth() + 1;
            let currYear = date.getUTCFullYear();
            let currDay = date.getUTCDate();

            updateDocument("Requests", emailIntern[index].id, {
              remarks: arrayUnion({
                name: window.localStorage.getItem("CompanyCompany"),
                date: `${currDay}.${currMonth}.${currYear}`,
                text: remark,
              }),
            });
          });
        });

        missionForm.forEach((mF, index) => {
          const date = new Date();
          let currMonth = date.getUTCMonth() + 1;
          let currYear = date.getUTCFullYear();
          let currDay = date.getUTCDate();
          mF.addEventListener("submit", (e) => {
            e.preventDefault();
            const mission = mF.elements["mission"].value;
            updateDocument("Requests", emailIntern[index].id, {
              missions: arrayUnion({
                name: window.localStorage.getItem("CompanyCompany"),
                date: `${currDay}.${currMonth}.${currYear}`,
                text: mission,
              }),
            });
          });
        });
      } else if (reference == "Requests") {
        querySnap.forEach((doc) => {
          document.getElementById("request-container").innerHTML += `
            <article class="request-card">
              <img
                class="request-image"
                src="${doc.data().image}"
                alt=""
              />
              <div class="request-data grid">
                <h3 class="request-name">${doc.data().name} ${
            doc.data().surname
          }</h3>
                <div class="request-education">
                  <span class="request-faculty">
                  ${doc.data().faculty}
                  </span>
                  <span class="request-level">${doc.data().level}</span>
                </div>
                <p class="request-poste">
                  <span>Postule:</span> ${doc.data().poste}
                </p>
                <div class="request-button">
                  <button id="${
                    doc.data().email
                  }" class="request-accept">Accepter</button>
                  <button id="${
                    doc.data().email
                  }2" class="request-refuse">Refuser</button>
                </div>
              </div>
            </article>
          `;
        });
        const accept = document.querySelectorAll(".request-accept");
        const refuse = document.querySelectorAll(".request-refuse");

        accept.forEach((ac) => {
          ac.addEventListener("click", () => {
            const date = new Date();
            let currMonth = date.getUTCMonth() + 1;
            let currYear = date.getUTCFullYear();
            let currDay = date.getUTCDate();
            updateDocument("Requests", ac.id, {
              date: `${currDay}.${currMonth}.${currYear}`,
              status: true,
              companyEmail: deleteField(),
              company: window.localStorage.getItem("CompanyCompany"),
            });
            setDocument("Files", ac.id, {
              rapport: {
                filename: "",
                fileUrl: "",
                date: "",
                name: "",
                surname: "",
                email: "",
              },
              resume: {
                filename: "",
                fileUrl: "",
                date: "",
                name: "",
                surname: "",
                email: "",
              },
              file: {
                filename: "",
                fileUrl: "",
                date: "",
                name: "",
                surname: "",
                email: "",
              },
            });
          });
        });

        refuse.forEach((rf) => {
          rf.addEventListener("click", () => {
            deleteDocument("Requests", rf.id.slice(0, -1));
          });
        });
      }
    }
  );
};

/* Storage */
export const setFile = (dataFile, email = "") => {
  const uploadTask = uploadBytesResumable(
    ref(storage, `${dataFile.folder}/${dataFile.filename}`),
    dataFile.file
  );

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      if (dataFile.folder != "CompanyLogo") {
        const progressArea = document.getElementById(dataFile.progress),
          uploadedArea = document.getElementById(dataFile.uploaded);

        let fileLoaded = Math.floor(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        let fileTotal = Math.floor(snapshot.totalBytes / 1000);
        let fileSize;
        fileTotal < 1024
          ? (fileSize = fileTotal + " KB")
          : (fileSize =
              (snapshot.bytesTransferred / (1024 * 1024)).toFixed(2) + " MB");
        let progressHTML = `
          <li class="row">
            <i class="fas fa-file-alt"></i>
            <div class="content">
              <div class="details">
                <span class="name">${dataFile.filename} • Uploading</span>
                <span class="percent">${fileLoaded}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress" style="width: ${fileLoaded}%"></div>
              </div>
            </div>
          </li>
        `;
        uploadedArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;
        if (snapshot.bytesTransferred == snapshot.totalBytes) {
          progressArea.innerHTML = "";
          let uploadedHTML = `
            <li class="row">
              <div class="content upload">
                <i class="fas fa-file-alt"></i>
                <div class="details">
                  <span class="name">${dataFile.filename} • Uploaded</span>
                  <span class="size">${fileSize}</span>
                </div>
              </div>
              <i class="fas fa-check"></i>
            </li>
          `;
          uploadedArea.classList.remove("onprogress");
          uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
        }
      }
    },
    (error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert(`${errorCode}: ${errorMessage}`);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        if (dataFile.folder == "CompanyLogo") {
          const data = {
            image: downloadURL,
          };
          updateDocument("Companies", email, data);
        } else {
          if (dataFile.folder == "Rapport")
            updateDoc(doc(db, "Files", email), {
              rapport: arrayUnion({
                filename: `${dataFile.filename}-${dataFile.date}`,
                fileUrl: downloadURL,
                date: dataFile.date,
                name: dataFile.name,
                surname: dataFile.surname,
                email: email,
              }),
            }).then(() => {
              window.location.reload();
            });
          else if (dataFile.folder == "Resume")
            updateDoc(doc(db, "Files", email), {
              resume: arrayUnion({
                filename: `${dataFile.filename}-${dataFile.date}`,

                fileUrl: downloadURL,
                date: dataFile.date,
                name: dataFile.name,
                surname: dataFile.surname,
                email: email,
              }),
            }).then(() => {
              window.location.reload();
            });
          else if (dataFile.folder == "Fichier")
            updateDoc(doc(db, "Files", email), {
              file: arrayUnion({
                filename: `${dataFile.filename}-${dataFile.date}`,
                fileUrl: downloadURL,
                date: dataFile.date,
                name: dataFile.name,
                surname: dataFile.surname,
                email: email,
              }),
            }).then(() => {
              window.location.reload();
            });
        }
      });
    }
  );
};

const getFile = (fileUrl) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", fileUrl);
  xhr.send();
};

export const total = (reference) => {
  getDocs(collection(db, reference)).then((querySnap) => {
    if (reference == "Students") {
      let i = 0;
      querySnap.forEach(() => {
        i++;
      });
      document.getElementById("student-effective").innerHTML = `
        <i class="ri-user-3-line"></i>
        <div class="effective-data">
          <span class="effective-number">${i}</span>
          <h3 class="effective-title">Total Etudiant(s)</h3>
        </div>
      `;
    } else if (reference == "Teachers") {
      let i = 0;
      querySnap.forEach(() => {
        i++;
      });
      document.getElementById("teacher-effective").innerHTML = `
        <i class="ri-user-voice-line"></i>
        <div class="effective-data">
          <span class="effective-number">${i}</span>
          <h3 class="effective-title">Total Professeur(s)</h3>
        </div>
      `;
    } else if (reference == "Juries") {
      let i = 0;
      querySnap.forEach(() => {
        i++;
      });
      document.getElementById("jury-effective").innerHTML = `
        <i class="ri-file-user-line"></i>
        <div class="effective-data">
          <span class="effective-number">${i}</span>
          <h3 class="effective-title">Total Jury(s)</h3>
        </div>
      `;
    } else if (reference == "Companies") {
      let i = 0;
      querySnap.forEach(() => {
        i++;
      });
      document.getElementById("company-effective").innerHTML = `
        <i class="ri-building-4-line"></i>
        <div class="effective-data">
          <span class="effective-number">${i}</span>
          <h3 class="effective-title">Total Entreprise(s)</h3>
        </div>
      `;
    }
  });
};

export const newOffer = (reference) => {
  getDocs(
    query(collection(db, reference), where("attribute", "==", false))
  ).then((querySnap) => {
    let i = 0;
    querySnap.forEach(() => {
      i++;
    });
    document.getElementById("offer-effective").innerHTML = `
        <i class="ri-file-list-line"></i>
        <div class="effective-data">
          <span class="effective-number">${i}</span>
          <h3 class="effective-title">Nouvelles Offre(s)</h3>
        </div>
      `;
  });
};
