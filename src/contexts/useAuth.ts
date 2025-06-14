
import { useContext } from "react";
import { AuthContextType } from "./auth-types";
import { AuthContext } from "./AuthProvider"; // Import from new file

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export AuthContext for provider wiring if needed
export { AuthContext };
