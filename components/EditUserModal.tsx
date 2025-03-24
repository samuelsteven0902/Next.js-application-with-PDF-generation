"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {  User } from "../utils/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

const userFormSchema = z.object({
  id: z.number(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is too short"),
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

type UserFormData = z.infer<typeof userFormSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (data: UserFormData) => void;
}

export function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    mode: "onChange",
    defaultValues: user || {},
  });

  // Reset form ketika user berubah
  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      await onSave(data); // Simpan perubahan
      alert("User updated successfully!");
      onClose();
    } catch (error) {
      alert("Failed to update user!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit User</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="w-full gap-4 flex">
        
        {/* Section 1: Personal Info */}
        <div className="w-1/3 space-y-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <Input id="name" {...register("name")} placeholder="Name" className="w-full" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <Input id="username" {...register("username")} placeholder="Username" className="w-full" />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <Input id="email" {...register("email")} placeholder="Email" className="w-full" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
            <Input id="phone" {...register("phone")} placeholder="Phone" className="w-full" />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium">Website</label>
            <Input id="website" {...register("website")} placeholder="Website" className="w-full" />
            {errors.website && <p className="text-red-500">{errors.website.message}</p>}
          </div>
        </div>

        {/* Section 2: Address Info */}
        <div className="w-1/3 space-y-2">
          <label htmlFor="address" className="block text-sm font-medium">Address</label>
          <hr className="border-b" />

          <div>
            <label htmlFor="street" className="block text-sm font-medium">Street</label>
            <Input id="street" {...register("address.street")} placeholder="Street" className="w-full" />
            {errors.address?.street && <p className="text-red-500">{errors.address.street.message}</p>}
          </div>

          <div>
            <label htmlFor="suite" className="block text-sm font-medium">Suite</label>
            <Input id="suite" {...register("address.suite")} placeholder="Suite" className="w-full" />
            {errors.address?.suite && <p className="text-red-500">{errors.address.suite.message}</p>}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium">City</label>
            <Input id="city" {...register("address.city")} placeholder="City" className="w-full" />
            {errors.address?.city && <p className="text-red-500">{errors.address.city.message}</p>}
          </div>

          <div>
            <label htmlFor="zipcode" className="block text-sm font-medium">Zipcode</label>
            <Input id="zipcode" {...register("address.zipcode")} placeholder="Zipcode" className="w-full" />
            {errors.address?.zipcode && <p className="text-red-500">{errors.address.zipcode.message}</p>}
          </div>
        </div>

        {/* Section 3: Company Info */}
        <div className="w-1/3 space-y-2">
          <label htmlFor="company" className="block text-sm font-medium">Company</label>
          <hr className="border-b" />

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium">Company Name</label>
            <Input id="companyName" {...register("company.name")} placeholder="Company Name" className="w-full" />
            {errors.company?.name && <p className="text-red-500">{errors.company.name.message}</p>}
          </div>

          <div>
            <label htmlFor="catchPhrase" className="block text-sm font-medium">Catch Phrase</label>
            <textarea
              id="catchPhrase"
              {...register("company.catchPhrase")}
              placeholder="Catch Phrase"
              className="w-full border rounded"
            />
            {errors.company?.catchPhrase && <p className="text-red-500">{errors.company.catchPhrase.message}</p>}
          </div>

          <div>
            <label htmlFor="bs" className="block text-sm font-medium">BS</label>
            <textarea
              id="bs"
              {...register("company.bs")}
              placeholder="BS"
              className="w-full border rounded"
            />
            {errors.company?.bs && <p className="text-red-500">{errors.company.bs.message}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  </DialogContent>
</Dialog>

  );
}
