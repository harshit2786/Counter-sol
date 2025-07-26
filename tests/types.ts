import * as borsh from "borsh";

export class Counter {
    count: number;

    constructor(fields: { count: number }) {
        this.count = fields.count;
    }
}

export const schema : borsh.Schema = {
    struct : {
        count: 'u32',
    }
}

export const COUNTER_SIZE = borsh.serialize(schema, new Counter({ count: 0 })).length;