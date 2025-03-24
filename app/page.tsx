'use client'

import UserList from "@/components/UserList";


export default function Home() {


  return (
    <div className="min-h-screen bg-gray-100 p-8 ">
      <div>
      <h1 className="text-3xl font-bold text-center mb-8">User Profiles</h1>
      </div>
      <UserList />

    </div>
  );
}
