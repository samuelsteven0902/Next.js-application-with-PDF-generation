import axios from "axios";
import { z } from "zod";

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  phone: z.string(),
  website: z.string(),
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
  }),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
  }),
});

export const usersSchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/users");
    const users = usersSchema.parse(response.data); // Validasi di sini
    return users;
  } catch (error) {
    console.error("Failed to fetch users or invalid data:", error);
    throw new Error("Invalid user data received");
  }
};

export const updateUser = async (user: User, onClose: () => void) => {
  try {
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/users/${user.id}`,
      user
    );
    console.log("User updated successfully:", response.data);
    alert("User updated successfully!");
    onClose();
  } catch (error) {
    console.error("Failed to update user:", error);
    alert("Failed to update user!");
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "DELETE",
  });
  alert("User Deleted successfully!");


  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};
