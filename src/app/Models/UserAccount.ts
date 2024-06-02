export interface UserAccount {
  Email: string
  Name: string
  LastName: string
  Password: string
}

export function CompleteFields(user: UserAccount): UserAccount {
  if (!user.Email) {
     user.Email = ""
  }
 
  if (!user.Name) {
     user.Name = ""
  }
 
  if (!user.LastName) {
     user.LastName = ""
  }
 
  if (!user.Password) {
     user.Password = ""
  }
 
  return user
 }

 export function CompletarCampos(email: string, name: string, lastName: string, password: string): UserAccount {
   const user: UserAccount = {
      Email: email ? email : "",
      Name: name ? name : "",
      LastName: lastName ? lastName : "",
      Password: password ? password : ""
   };
  
   return user
  }