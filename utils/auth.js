import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "./firebase";

export const auth = getAuth(app);

export const logIn = async (email, password, router) => {
  try {
    const creds = await signInWithEmailAndPassword(auth, email, password);
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
