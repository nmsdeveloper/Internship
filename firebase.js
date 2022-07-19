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
  getDoc,
  getDocs,
  query,
  doc,
  collection,
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
  addDoc(collection(db, reference), data).then(() => {});
};

export const updateDocument = (reference, document, data) => {
  updateDoc(doc(db, reference, document), data).then(() => {
    window.location.reload();
  });
};

export const deleteDocument = (reference, document, data) => {
  deleteDoc(doc(db, reference, document), data).then(() => {});
};

export const getDocument = (reference, document) => {
  getDoc(doc(db, reference, document)).then((docSnap) => {});
};

export const getCollection = (reference) => {
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
    if (reference == "Teachers")
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
    if (reference == "Juries")
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
  });
};

export const getQueryWhere = (reference, field, value) => {
  getDocs(query(collection(db, reference), where(field, "==", value))).forEach(
    (doc) => {
      console.log(doc.id, " => ", doc.data());
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
