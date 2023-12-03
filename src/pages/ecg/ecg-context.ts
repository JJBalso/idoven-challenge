import { createContext } from "react";
import { EcgData } from "./interfaces/ecg.interface";

export const EcgContext = createContext<EcgData[][]>([]);
