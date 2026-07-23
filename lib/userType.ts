export interface User {
   id: string;
   name: string;
   email: string;
   createdAt: Date;
   updatedAt: Date;
   image?: string | null | undefined;
   provider?: string | null | undefined;
}
