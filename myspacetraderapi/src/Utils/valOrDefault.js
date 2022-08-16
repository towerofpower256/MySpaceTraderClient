export default function valOrDefault(val, def="(empty)") {
    if (!val || val === "") return def;
    return val;
}