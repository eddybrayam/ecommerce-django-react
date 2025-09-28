export function formatDRFError(err) {
  if (err?.response) {
    const data = err.response.data;
    if (typeof data === "string") return data;
    try {
      return JSON.stringify(data);
    } catch {
      return "Error inesperado";
    }
  } else if (err?.request) {
    return "Sin respuesta del servidor. ¿Backend encendido / CORS?";
  } else {
    return err?.message || "Error";
  }
}
