export interface Olympic {
id : number,
name : string,
participations : Participation[]
}

export type Participation = {
    id : number,
    year: number,
    city: string,
    medalsCount: number,
    athleteCount: number
}