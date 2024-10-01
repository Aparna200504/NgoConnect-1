import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../Components/Navbar";
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [projectDetails, setProjectDetails] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    city: "",
    state: "",
    country: "",
    images: [],
  });
  const [resources, setResources] = useState([{ resource: "", quantity: 1 }]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.error("You can only upload up to 10 images.");
    } else {
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        images: files,
      }));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const { title, description, startDate, endDate, city, state, country } = projectDetails;
      if (!title || !description || !startDate || !endDate || !city || !state || !country) {
        toast.error("Please fill all required fields.");
        return;
      }
    } else if (step === 2 && resources.some(res => !res.resource || res.quantity <= 0)) {
      toast.error("Please fill all resource fields.");
      return;
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleResourceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedResources = [...resources];
    updatedResources[index][name] = value;
    setResources(updatedResources);
  };

  const addResource = () => {
    setResources([...resources, { resource: "", quantity: 1 }]);
  };

  const handleSubmit = async () => {
    const { title, description, startDate, endDate, city, state, country } = projectDetails;
    const resourcesNeeded = resources.map(res => ({
      resource: res.resource,
      quantity: res.quantity,
    }));
  
    const projectData = {
      title,
      description,
      startDate,
      endDate,
      city,
      state,
      country,
      resourcesNeeded,
    };
  
    try {
      console.log(projectDetails)
      const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZhNmNkNTI0MjhhNTg4MDgyOWY4M2YiLCJyZWdpc3RyYXRpb25OdW1iZXIiOiJOR08xMjM0NTY3ODkiLCJpYXQiOjE3Mjc3MTkxNzAsImV4cCI6MTcyNzgwNTU3MH0.23RxbymNJWU7sT8enPvb71qDmc0x7oJATCycjq9zkMQ"; 
      const response = await fetch("https://team23-ngo-backend.onrender.com/api/v1/project/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, 
        },
        body: JSON.stringify(projectDetails),
        
      });
  
        if (!response.ok) {
          const errorMessage = await response.text(); 
          throw new Error(errorMessage);
        }
  
      const result = await response.json();
      console.log(result);
      toast.success("Project added successfully!");
      navigate('/');
      
      // Reset fields or navigate as needed
    } catch (error) {
      console.error(error);
      toast.error("Error adding project. Please try again.");
    }
  };
  

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-8 bg-green-100 rounded-lg shadow-md mt-8 mb-8">
        <h1 className="text-4xl font-semibold text-green-600 mb-4">Add Project</h1>
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Step 1: Project Details</h2>
            <div className="grid grid-cols-1 gap-4">
              {["title", "description", "city", "state", "country"].map((field) => (
                <label key={field} className="block">
                  <span className="text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-red-500">*</span></span>
                  <input
                    type={field === "description" ? "textarea" : "text"}
                    name={field}
                    placeholder={`Enter ${field}`}
                    value={projectDetails[field]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-gray-700">Start Date <span className="text-red-500">*</span></span>
                <input
                  type="date"
                  name="startDate"
                  value={projectDetails.startDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">End Date <span className="text-red-500">*</span></span>
                <input
                  type="date"
                  name="endDate"
                  value={projectDetails.endDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Upload Images</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </label>
            </div>
            <button
              onClick={handleNext}
              className="w-44 mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Step 2: Resources</h2>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Resource</th>
                  <th className="border border-gray-300 p-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        name="resource"
                        value={resource.resource}
                        onChange={(e) => handleResourceChange(index, e)}
                        className="block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        name="quantity"
                        value={resource.quantity}
                        onChange={(e) => handleResourceChange(index, e)}
                        min="1"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={addResource}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Add Resource
            </button>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="w-44 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="w-44 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Project</h2>
            <p>Project Title: {projectDetails.title}</p>
            <p>Description: {projectDetails.description}</p>
            <p>Start Date: {projectDetails.startDate}</p>
            <p>End Date: {projectDetails.endDate}</p>
            <p>City: {projectDetails.city}</p>
            <p>State: {projectDetails.state}</p>
            <p>Country: {projectDetails.country}</p>
            <h3 className="mt-4">Resources:</h3>
            <ul>
              {resources.map((resource, index) => (
                <li key={index}>{resource.resource} - {resource.quantity}</li>
              ))}
            </ul>
            <button
              onClick={handleSubmit}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Confirm and Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AddProject;
