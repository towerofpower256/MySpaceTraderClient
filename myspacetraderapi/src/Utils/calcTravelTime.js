// Function to calculate the time it would take
// to travel from one location to another, in seconds.

// Original code that the game runs behind the scenes,
// shared by the developer artokunon 09/09/2022

// const SYSTEM_SCALE = 3
// public static calculateArrival = (distance: number, speed: number) => {
//     const seconds = (distance * SYSTEM_SCALE) / speed
//     return moment()
//       .add(seconds + 30, 'seconds')
//       .toDate()  
// }

const SYSTEM_SCALE = 3;
export default function calcTravelTime(distance, shipSpeed) {
    return Math.ceil(((distance * SYSTEM_SCALE) / shipSpeed) + 30);
}