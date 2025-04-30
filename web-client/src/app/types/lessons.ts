export type Stage = {
    id: number;
    title: string;
    description: string;
    sign: number[];
    type: string;
}

export type Lesson = {
    id: number;
    stages: number[];
}