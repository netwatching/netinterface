export interface Module {
    type: string;
    config: {
        timeout: number;
    };
    signature: string;
    _cls: string;
}

