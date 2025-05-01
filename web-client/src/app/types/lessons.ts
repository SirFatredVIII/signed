export type Stage = {
    id: number;
    title: string;
    description: string;
    sign: number[];
    type: string;
    src: string;
}

export type Lesson = {
    id: number;
    stages: number[];
}