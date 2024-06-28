export default interface ICreateUserDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  id?: string;
  avatar?: string;
}
