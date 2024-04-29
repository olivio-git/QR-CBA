export const formatHours = (time) => {
    const [hours, minutes] = time.split(':');
    let ampm = hours >= 12 ? 'PM' : 'AM';
    let hh = parseInt(hours, 10);
    hh = hh % 12;
    hh = hh ? hh : 12; // Convertir "0" a "12"
    return `${hh}:${minutes} ${ampm}`;
};
