export const CREATE_PET_REQUEST_SCHEMA = {
    type: {isString: true},
    properties: {isObject: true}
}

export const QUERY_PET_REQUEST_SCHEMA = {
    filters: {isArray: true},
    "filters.*.key": {isString: true},
    "filters.*.operation": {
        isString: true,
        isIn: {
            options: [['EQ', 'NEQ', 'GT', 'LT']],
        },
    },
    "filters.*.value": {
        custom: {
            options: (value: any) => typeof value === 'string' || typeof value === 'number',
        }
    }
}