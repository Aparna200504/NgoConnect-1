import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../Components/Navbar";

const AddVolunteer = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulated fetch call for volunteer data
    const fetchedVolunteers = [
      { name: "Alice", availability: { start: "2024-10-01", end: "2024-10-10" } },
      { name: "Bob", availability: { start: "2024-10-05", end: "2024-10-15" } },
      { name: "Charlie", availability: { start: "2024-10-08", end: "2024-10-20" } },
    ];
    setVolunteers(fetchedVolunteers);
  }, []);

  const handleSelectVolunteer = (volunteerName) => {
    setSelectedVolunteers((prevSelected) =>
      prevSelected.includes(volunteerName)
        ? prevSelected.filter(name => name !== volunteerName)
        : [...prevSelected, volunteerName]
    );
  };

  const handleVolunteerRequest = () => {
    selectedVolunteers.forEach(volunteer => {
      console.log(`Request sent to ${volunteer}`);
    });
    toast.success("Requests sent to selected volunteers!");
  };

  // Filter volunteers based on search term
  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-8 bg-green-100 rounded-lg shadow-md mt-8 mb-8">
        <h1 className="text-4xl font-semibold text-green-600 mb-4">Add Volunteers</h1>
        <input
          type="text"
          placeholder="Search Volunteers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <div className="mt-4">
          {filteredVolunteers.map((volunteer) => (
            <div key={volunteer.name} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={volunteer.name}
                checked={selectedVolunteers.includes(volunteer.name)}
                onChange={() => handleSelectVolunteer(volunteer.name)}
                className="mr-2"
              />
              <label htmlFor={volunteer.name}>{volunteer.name}</label>
            </div>
          ))}
        </div>
        <button
          onClick={handleVolunteerRequest}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Send Requests
        </button>
      </div>
    </>
  );
};

export default AddVolunteer;
