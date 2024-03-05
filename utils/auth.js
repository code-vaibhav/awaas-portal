import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);

export const logIn = async (email, password, router) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/admin/records/add");
  } catch (error) {
    console.error("Login failed:", error.message);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const getCurrentUser = () => auth.currentUser;

export const getRole = () => auth.currentUser?.customClaims?.role || "root";
