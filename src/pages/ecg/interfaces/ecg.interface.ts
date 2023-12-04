export interface EcgData {
    time: number,
    value: number,
};

export interface EcgControls {
    count: number,
    range: number,
    hasStarted: boolean,
};
