interface PartnerData {
    _id?: string | null;
    name?: string | null;
    as2_id?: string | null;
    email?: string | null;
    x509_alias?: string | null;
}

class Partner {
    _id: string | null;
    name: string | null;
    as2_id: string | null;
    email: string | null;
    x509_alias: string | null;

    constructor(data: PartnerData = {}) {
        this._id = data._id ?? null;
        this.name = data.name ?? null;
        this.as2_id = data.as2_id ?? null;
        this.email = data.email ?? null;
        this.x509_alias = data.x509_alias ?? null;
    }

    static fields = {
        _id: {
            type: String,
            required: true,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        as2_id: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        x509_alias: {
            type: String,
            default: null
        }
    };
}

export default Partner;
