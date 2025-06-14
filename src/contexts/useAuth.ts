
import { useContext } from "react";
import { AuthContextType } from "./auth-types";
import { AuthContext } from "./AuthProvider";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
