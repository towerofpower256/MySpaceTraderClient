export default function calcTimeDelta(a, b) {
    if (!b) b = new Date(); // Use now

    let aDate = new Date(a);
    let bDate = new Date(b);

    let diff = aDate - bDate;
    return diff;
}