import { Unit } from "./unit.model";

export interface Property {
    id: number;
    name: string;
    location: string;
    type: string;
    documentId: string;
    units: Unit[];
}