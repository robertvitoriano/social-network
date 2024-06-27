export default interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  id?: string;
  avatar?: string;
}
