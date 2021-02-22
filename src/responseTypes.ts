interface ResponseType {
    success: boolean;
    error: string;
}

export interface DatasetsType extends ResponseType {
    data: string[];
}
