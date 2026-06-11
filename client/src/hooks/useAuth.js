import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * useAuth hook:
 * Context theke user info ebong auth functions access korar jonno.
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  // Jodi AuthProvider-er baire hook-ti bebohar kora hoy, tobe error throw korbe
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default useAuth;
