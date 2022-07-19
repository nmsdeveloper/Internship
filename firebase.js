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

export const connectUser = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "./accueil.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert(`${errorCode}: ${errorMessage}`);
    });
};

export const statusUser = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
    } else {
      window.location.href = "./authentification.html";
    }
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

export const resetPassword = (email) => {
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
export const setDocument = (reference, document, data, updateCompany = {}) => {
  setDoc(doc(db, reference, document), data).then(() => {
    if (reference == "Companies")
      setFile(
        updateCompany.folder,
        updateCompany.filename,
        updateCompany.file,
        data.email
      );
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

export const getDocument = (reference, document) => {
  getDoc(doc(db, reference, document)).then((docSnap) => {
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
    }
  });
};

export const getCollection = (reference, slide = "") => {
  getDocs(collection(db, reference)).then((querySnap) => {
    if (reference == "Students")
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
    else if (reference == "Teachers")
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
    else if (reference == "Juries")
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
    else if (reference == "Companies")
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
    else if (reference == "Faculty")
      querySnap.forEach((doc) => {
        document.getElementById("admin-popup").innerHTML += `
        <div class="internship-option">${doc.data().faculty}</div>
        `;
      });
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
                    missions: [""],
                    remarks: [""],
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
                      >
                      
                      </textarea>
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
          let currDay = new Date().getDay();
          let currMonth = new Date().getMonth();
          let currYear = new Date().getFullYear();
          var date = `${currDay}.${currMonth}.${currYear}`;
          rF.addEventListener("submit", (e) => {
            e.preventDefault();
            const remark = rF.elements["remark"].value;
            updateDocument("Requests", emailIntern[index].id, {
              remarks: arrayUnion({
                date: date,
                text: remark,
              }),
            });
          });
        });

        missionForm.forEach((mF, index) => {
          let currDay = new Date().getDay();
          let currMonth = new Date().getMonth();
          let currYear = new Date().getFullYear();
          var date = `${currDay}.${currMonth}.${currYear}`;
          mF.addEventListener("submit", (e) => {
            e.preventDefault();
            const mission = mF.elements["mission"].value;
            updateDocument("Requests", emailIntern[index].id, {
              missions: [
                {
                  date: date,
                  text: mission,
                },
              ],
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
            let currDay = new Date().getDay();
            let currMonth = new Date().getMonth();
            let currYear = new Date().getFullYear();
            var date = `${currDay}.${currMonth}.${currYear}`;
            updateDocument("Requests", ac.id, {
              date: date,
              status: true,
              companyEmail: deleteField(),
              company: window.localStorage.getItem("CompanyCompany"),
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
export const setFile = (folder, filename, file, email = "") => {
  const uploadTask = uploadBytesResumable(
    ref(storage, `${folder}/${filename}`),
    file
  );

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert(`${errorCode}: ${errorMessage}`);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const data = {
          image: downloadURL,
        };
        if (folder == "CompanyLogo") updateDocument("Companies", email, data);
      });
    }
  );
};

export const getFile = (folder, filename) => {
  getDownloadURL(ref(storage, `${folder}/${filename}`))
    .then((url) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open("GET", url);
      xhr.send();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert(`${errorCode}: ${errorMessage}`);
    });
};
