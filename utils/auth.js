import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "./firebase";
import { ErrorMessage } from "@/components/Notification";

export const auth = getAuth(app);

export const logIn = async (email, password) => {
  try {
    const creds = await signInWithEmailAndPassword(auth, email, password);
    return creds.user;
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

export const checkAuth = (res, setAuth) => {
  if (res.status === 401) {
    setAuth(null);
    ErrorMessage("Session Expired");
  }
  return res.json();
};
