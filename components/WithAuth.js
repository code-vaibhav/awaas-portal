// WithAuthorization.js
import { useEffect, useState } from "react";
import { getCurrentUser, getRole } from "@/utils/auth";

const WithAuthorization = ({ Children, isRoot }) => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    console.log(user);

    if (!user) {
      // Redirect to login if the user is not authenticated
      window.location.href = `/admin`;
      return;
    }

    if (isRoot && getRole() !== "root") {
      console.error("You dont have access to this page");
    }

    setRole(getRole());
  }, []);

  return <Children role={role} />;
};

export default WithAuthorization;
