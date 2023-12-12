export interface IFilesRepo{
    uploadFilesInDB(files: any[]): Promise<any> ;
    getFileFromDB(id: any): Promise<any>;
    deleteFileFromDB(id: string): Promise<any> 
}