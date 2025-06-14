
export function formatApiError(error: any): string {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  if (error.description) return error.description;
  return "An error occurred. Please try again.";
}
