import data from "./olympics.mock.json"
import type { Country } from "../types"
export function getOlympics() : Country[] {
    return data
}
