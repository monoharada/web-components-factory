const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function isValidLocalDateParts(year, month, day) {
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day))
        return false;
    if (year < 1 || year > 9999)
        return false;
    if (month < 1 || month > 12)
        return false;
    if (day < 1 || day > 31)
        return false;
    const dt = new Date(year, month - 1, day);
    if (Number.isNaN(dt.getTime()))
        return false;
    if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day)
        return false;
    return true;
}
export function parseIsoDate(value) {
    if (!ISO_DATE_RE.test(value))
        return null;
    const [y, m, d] = value.split('-');
    const year = Number.parseInt(y, 10);
    const month = Number.parseInt(m, 10);
    const day = Number.parseInt(d, 10);
    if (!isValidLocalDateParts(year, month, day))
        return null;
    return { year, month, day };
}
export function toIsoDateOrEmpty(year, month, day) {
    if (!isValidLocalDateParts(year, month, day))
        return '';
    const yyyy = String(year).padStart(4, '0');
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
