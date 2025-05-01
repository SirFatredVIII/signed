type UserType = "customer" | "admin"

type LessonHistory = {
    lessonid: number;
    stagesCompleted: number[];
}

export type UserHistory = {
    modules_started: number[];
    modules_finished: number[];
    modules_mastered: number[];
    lessons_progress: LessonHistory[];
    total_learn_time: number;
    total_practice_time: number;
}

type UserPermissions = {
    read_modules: boolean;
    write_modules: boolean;
    create_modules: boolean;
    delete_modules: boolean;
}

export type User = {
    id: number;
    username: string;
    email: string;
    pass: string;
    avatar: string;
    type: UserType;
    history: UserHistory;
    permissions: UserPermissions;
}