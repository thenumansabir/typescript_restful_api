export interface IUsersRepo {
  userRegistration(body: any): Promise<any>;
  userLogin(body: any): Promise<any>;
  getAllUsersFromDB(): Promise<any>;
  getUserFromDB(id: any): Promise<any>;
  updateUserInDB(id: any, body: any): Promise<any>;
  deleteUserFromDB(id: any): Promise<any>;
}
