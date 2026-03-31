import data from "./olympics.mock.json"
import type { Olympic } from "../types"
export function getOlympics() : Olympic[] {
    return data
}
