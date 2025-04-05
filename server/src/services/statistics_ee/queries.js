// Statistics Estonia API queries for datasets
export const PA001_QUERY = [
    {
        "code": "Näitaja",
        "selection": {
            "filter": "item",
            "values": [
                "D11_EMPL"
            ]
        }
    },
    {
        "code": "Tegevusala",
        "selection": {
            "filter": "item",
            "values": [
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                "K", "L", "M", "N", "O", "P", "Q", "R", "S"
            ]
        }
    },
    {
        "code": "Vaatlusperiood",
        "selection": {
            "filter": "item",
            "values": [
                "2020"
            ]
        }
    }
];

export const PA101_QUERY = [
    {
        "code": "Näitaja",
        "selection": {
            "filter": "item",
            "values": [
                "GR_W_AVG"
            ]
        }
    },
    {
        "code": "Tegevusala",
        "selection": {
            "filter": "item",
            "values": [
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                "K", "L", "M", "N", "O", "P", "Q", "R", "S"
            ]
        }
    }
];

export const PA633_QUERY = [
    {
        "code": "Näitaja",
        "selection": {
            "filter": "item",
            "values": [
                "GR_H"
            ]
        }
    },
    {
        "code": "Sugu",
        "selection": {
            "filter": "item",
            "values": [
                "M_F"
            ]
        }
    }
];