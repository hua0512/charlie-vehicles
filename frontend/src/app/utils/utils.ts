/**
 * Returns a formatted date.
 * @param isoDate The date in ISO 8601 format.
 */
export function getDate(isoDate: string | undefined) {
  if (!isoDate) {
    return '';
  }
  // createdAt is a string in format ISO 8601
  return new Date(isoDate).toLocaleString('es-ES', {hour12: false});
}
