import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

export default function generateShipName(seed) {

    return uniqueNamesGenerator({
        dictionaries: [colors, animals],
        separator: '-',
        seed: seed,
    });
}