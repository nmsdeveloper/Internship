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
export const createUser = ({ email, password, reference, data }) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert(`${errorCode}: ${errorMessage}`);
    });
};

export const connectUser = ({ email, password, data }) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
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
      window.location.href = "./authentification.html";
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
export const setDocument = (reference, document, data) => {
  setDoc(doc(db, reference, document), data).then(() => {});
};

export const setCollection = (reference, data) => {
  addDoc(collection(db, reference), data).then(() => {});
};

export const updateDocument = (reference, document, data) => {
  updateDoc(doc(db, reference, document), data).then(() => {});
};

export const deleteDocument = (reference, document, data) => {
  deleteDoc(doc(db, reference, document), data).then(() => {});
};

export const getDocument = (reference, document) => {
  getDoc(doc(db, reference, document)).then((docSnap) => {});
};

export const getCollection = (reference) => {
  getDocs(collection(db, reference)).forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
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
export const setFile = (folder, filename, file) => {
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
        return downloadURL;
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
