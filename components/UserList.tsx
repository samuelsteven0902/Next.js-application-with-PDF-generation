"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteUser, fetchUsers, updateUser, User } from "@/app/utils/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import { EditUserModal } from "./EditUserModal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { DeleteUserModal } from "./DeleteUserModal";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<"table" | "card">("table");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["id", "name", "username", "email", "address", "phone", "website", "company"]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoadingData, setLoadingData] = useState<boolean>(true);



  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
    { key: "website", label: "Website" },
    { key: "company", label: "Company" }
  ];


  // Ngambil Data User
  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
      setLoadingData(false)
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTemplate(event.target.value as "table" | "card");
  };
  
  const handleEdit = (user: User) => {
    setSelectedUser(user);
  };

  const handlePrint = useReactToPrint({
    contentRef:pdfRef,
    documentTitle: "User Profiles",
  });

  const generatePDF = async () => {
    const input = pdfRef.current;
    if (!input) return;
  
    const actionColumns = input.querySelectorAll(".action-column");
    actionColumns.forEach((col) => col.classList.add("hidden"));
  
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  
    const watermarkText = "INI WATERMARK";
    pdf.setFontSize(30);
    pdf.setTextColor(150, 150, 150); 
    pdf.setGState(new pdf.GState({ opacity: 0.3 })) 
    pdf.text(watermarkText, pdfWidth - 10, pdfHeight - 10, {
      align: "right",
      baseline: "bottom",
    });
  
    pdf.save(`user_profiles_${template}.pdf`);
  
    actionColumns.forEach((col) => col.classList.remove("hidden"));
  };
  


  const handleColumnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedColumns([...selectedColumns, value]);
    } else {
      setSelectedColumns(selectedColumns.filter(col => col !== value));
    }
  };
  
  const handleResetColumns = () => {
  setSelectedColumns(columns.map(col => col.key));
};

const handleDelete = async (user: User) => {
  setUserToDelete(user);
  setIsDeleteModalOpen(true);
};

const confirmDelete = async () => {
  if (!userToDelete) return;
  try {
    await deleteUser(userToDelete.id);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);

  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

  return (
    <div className="p-4 space-y-4">
   <div className="space-y-6 bg-gray-200 p-6 rounded">
  
  <div className="w-full space-y-2 text-">
    <h1 className="text-3xl font-semibold">Export Data</h1>
    <hr className="border border-gray-400" />
  </div>

  <div className="flex justify-between items-end gap-6  ">
    <div className="w-1/3 space-y-4">

    <div className="flex items-center gap-2 ">
      <label htmlFor="template" className="text-lg font-semibold">Pilih Template:</label>
      <select
        id="template"
        value={template}
        onChange={handleTemplateChange}
        className="text-lg font-bold bg-gray-100 p-2 rounded-lg"
      >
        <option value="table">Table List</option>
        <option value="card">Card List</option>
      </select>
    </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-bold bg-gray-100 p-2 rounded-lg">
            Filter Data
          </AccordionTrigger>
          <AccordionContent className="p-4 bg-gray-50 rounded-b-lg">
            <h3 className="text-lg font-bold mb-2">Select Columns:</h3>
            <div className="grid grid-cols-2 gap-2">
              {columns.map(col => (
                <label key={col.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={col.key}
                    checked={selectedColumns.includes(col.key)}
                    onChange={handleColumnChange}
                    className="mr-1"
                  />
                  {col.label}
                </label>
              ))}
            </div>
            <Button onClick={handleResetColumns} className="mt-4 bg-red-500 text-white">
              Reset
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2 justify-end bottom-0  h-full">
      <Button onClick={generatePDF} className="bg-blue-500 text-white">
        Download PDF
      </Button>
      <Button onClick={()=>handlePrint()} className="bg-green-500 text-white">
        Preview
      </Button>
    </div>
  </div>
</div>

  
    {/* Preview Section */}
    <div ref={pdfRef} className="p-4  bg-white rounded mb-4">
      {/* <h3 className="text-3xl font-semibold mb-2">User Profiles</h3> */}
    
      {template === "table" && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              {columns.filter(col => selectedColumns.includes(col.key)).map(col => (
                <th key={col.key} className="border p-2">{col.label}</th>
              ))}
              <th className="border p-2 action-column no-print ">Action</th>
            </tr>
          </thead>
          <tbody>
            
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                {selectedColumns.includes("id") && <td className="border p-2">{user.id}</td>}
                {selectedColumns.includes("name") && <td className="border p-2">{user.name}</td>}
                {selectedColumns.includes("username") && <td className="border p-2">{user.username}</td>}
                {selectedColumns.includes("email") && <td className="border p-2">{user.email}</td>}
                {selectedColumns.includes("address") && <td className="border p-2">{user.address.street}, {user.address.city}</td>}
                {selectedColumns.includes("phone") && <td className="border p-2">{user.phone}</td>}
                {selectedColumns.includes("website") && <td className="border p-2">{user.website}</td>}
                {selectedColumns.includes("company") && <td className="border p-2">{user.company.name}</td>}
                <td className="border p-2 action-column no-print">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(user)} className="ml-2">
                      Delete
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      
  
      {template === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg shadow bg-white">
              {selectedColumns.includes("name") && <h3 className="text-xl font-bold mb-2">{user.name} ({user.username})</h3>}
              {selectedColumns.includes("email") && <p><strong>Email:</strong> {user.email}</p>}
              {selectedColumns.includes("phone") && <p><strong>Phone:</strong> {user.phone}</p>}
              {selectedColumns.includes("website") && <p><strong>Website:</strong> {user.website}</p>}
              {selectedColumns.includes("address") && <p><strong>Address:</strong> {user.address.street}, {user.address.suite}, {user.address.city}</p>}
              {selectedColumns.includes("company") && <p><strong>Company:</strong> {user.company.name}</p>}
              <td className=" p-2 action-column no-print">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(user)} className="ml-2">
                      Delete
                    </Button>
                </td>
            </div>
          ))}
        </div>
      )}

{isLoadingData && 
<div className="w-full "> Loading...</div>
}
    </div>
  
   
  
    <EditUserModal
      isOpen={!!selectedUser}
      user={selectedUser}
      onClose={() => setSelectedUser(null)}
      onSave={(data) => updateUser(data, () => setSelectedUser(null))}
    />

    <DeleteUserModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={confirmDelete}
      user={userToDelete}
    />
  </div>

  
  
  );
}
