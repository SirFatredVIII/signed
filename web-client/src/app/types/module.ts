export type Sign = {
    id: number;
    name: string;
}

export type Module = {
    id: number;
    name: string;
    skillLevel: string;
    prereq: number[];
    signs: number[];
}