import LocationTraits from "../Data/LocationTraits";

export default function getLocationTrait(a) {
    return (LocationTraits[a] || a);
}