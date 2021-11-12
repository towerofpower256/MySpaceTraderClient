// https://api.spacetraders.io/types/structures
const StructureTypes = {
    "structures": [
        {
            "type": "FUEL_REFINERY",
            "name": "Fuel Refinery",
            "price": 210000,
            "allowedLocationTypes": [
                "GAS_GIANT",
                "NEBULA"
            ],
            "allowedPlanetTraits": [
                "HELIUM_3"
            ],
            "consumes": [
                "DRONES",
                "MACHINERY"
            ],
            "produces": [
                "FUEL"
            ]
        },
        {
            "type": "RESEARCH_OUTPOST",
            "name": "Research Outpost",
            "price": 645000,
            "allowedLocationTypes": [
                "PLANET",
                "MOON",
                "GAS_GIANT",
                "ASTEROID",
                "NEBULA",
                "ANOMALY"
            ],
            "allowedPlanetTraits": [],
            "consumes": [
                "ELECTRONICS",
                "MACHINERY",
                "DRONES"
            ],
            "produces": [
                "RESEARCH"
            ]
        },
        {
            "type": "FABRICATION_PLANT",
            "name": "Fabrication Plant",
            "price": 470000,
            "allowedLocationTypes": [
                "PLANET",
                "MOON"
            ],
            "allowedPlanetTraits": [],
            "consumes": [
                "METALS",
                "CHEMICALS",
                "DRONES"
            ],
            "produces": [
                "MACHINERY",
                "CONSTRUCTION_MATERIALS"
            ]
        },
        {
            "type": "DRONE_FACTORY",
            "name": "Drone Factory",
            "price": 210000,
            "allowedLocationTypes": [
                "PLANET",
                "MOON"
            ],
            "allowedPlanetTraits": [],
            "consumes": [
                "METALS",
                "ELECTRONICS"
            ],
            "produces": [
                "DRONES"
            ]
        },
        {
            "type": "RARE_EARTH_MINE",
            "name": "Rare Earth Mine",
            "price": 320000,
            "allowedLocationTypes": [
                "MOON",
                "ASTEROID",
                "PLANET"
            ],
            "allowedPlanetTraits": [
                "RARE_METAL_ORES"
            ],
            "consumes": [
                "MACHINERY",
                "EXPLOSIVES"
            ],
            "produces": [
                "RARE_METALS"
            ]
        },
        {
            "type": "FARM",
            "name": "Farm",
            "price": 140000,
            "allowedLocationTypes": [
                "PLANET"
            ],
            "allowedPlanetTraits": [
                "ARABLE_LAND"
            ],
            "consumes": [
                "MACHINERY"
            ],
            "produces": [
                "FOOD"
            ]
        },
        {
            "type": "EXPLOSIVES_FACILITY",
            "name": "Explosives Facility",
            "price": 345000,
            "allowedLocationTypes": [
                "PLANET",
                "MOON"
            ],
            "allowedPlanetTraits": [],
            "consumes": [
                "CHEMICALS"
            ],
            "produces": [
                "EXPLOSIVES"
            ]
        },
        {
            "type": "CHEMICAL_PLANT",
            "name": "Chemical Plant",
            "price": 220000,
            "allowedLocationTypes": [
                "PLANET",
                "MOON"
            ],
            "allowedPlanetTraits": [
                "NATURAL_CHEMICALS"
            ],
            "consumes": [
                "DRONES"
            ],
            "produces": [
                "CHEMICALS"
            ]
        },
        {
            "type": "MINE",
            "name": "Mine",
            "price": 120000,
            "allowedLocationTypes": [
                "MOON",
                "ASTEROID",
                "PLANET"
            ],
            "allowedPlanetTraits": [
                "METAL_ORES"
            ],
            "consumes": [
                "MACHINERY",
                "EXPLOSIVES"
            ],
            "produces": [
                "METALS"
            ]
        },
        {
            "type": "ELECTRONICS_FACTORY",
            "name": "Electronics Factory",
            "price": 270000,
            "allowedLocationTypes": [
                "PLANET",
                "MOON"
            ],
            "allowedPlanetTraits": [],
            "consumes": [
                "RARE_METALS",
                "CHEMICALS"
            ],
            "produces": [
                "ELECTRONICS"
            ]
        },
        {
            "type": "SHIPYARD",
            "name": "Shipyard",
            "price": 870000,
            "allowedLocationTypes": [
                "PLANET",
                "MOON"
            ],
            "allowedPlanetTraits": [],
            "consumes": [
                "METALS",
                "MACHINERY",
                "ELECTRONICS",
                "DRONES"
            ],
            "produces": [
                "SHIP_PARTS",
                "SHIP_PLATING"
            ]
        }
    ]
}

export default StructureTypes;