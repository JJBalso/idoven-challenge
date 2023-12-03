export interface EcgData {
    time: number,
    value: number,
};

export interface EcgControl {
    start: number,
    limit: number,
    step: number,
};
