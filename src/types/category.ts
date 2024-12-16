export interface Category {
    id: number;
    name_uz?: string;
    name_fa?: string;
    [key: string]: any; // index signature to allow dynamic access
}
