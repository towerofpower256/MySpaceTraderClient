export default function padZero(a, zeroes) {
    return (""+a).padStart(zeroes, '0');
}