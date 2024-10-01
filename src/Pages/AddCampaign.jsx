import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCampaign = () => {
  const [step, setStep] = useState(1);
  const [campaignDetails, setCampaignDetails] = useState({
    title: "",
    description: "",
    targetAmount: "",
    images: [],
    startDate: "",
    endDate: "",
  });
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    if (campaignDetails.startDate && campaignDetails.endDate) {
      fetchActiveProjects();
    }
  }, [campaignDetails.startDate, campaignDetails.endDate]);

  const fetchActiveProjects = async () => {
    try {
        //accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZhNmNkNTI0MjhhNTg4MDgyOWY4M2YiLCJyZWdpc3RyYXRpb25OdW1iZXIiOiJOR08xMjM0NTY3ODkiLCJpYXQiOjE3Mjc3NTU5MjgsImV4cCI6MTcyNzg0MjMyOH0.h0g_qjCKUVgZOtgzQWcOKZqR3hJe3ZK5KQpnwZ4w-Ko";
        const response = await fetch(`https://team23-ngo-backend.onrender.com/api/v1/campaign/getActiveProjects`, {
            method: 'POST', // Make sure to specify GET method if needed
            headers: {
                "Content-Type": "application/json", 
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZhNmNkNTI0MjhhNTg4MDgyOWY4M2YiLCJyZWdpc3RyYXRpb25OdW1iZXIiOiJOR08xMjM0NTY3ODkiLCJpYXQiOjE3Mjc3MTkxNzAsImV4cCI6MTcyNzgwNTU3MH0.23RxbymNJWU7sT8enPvb71qDmc0x7oJATCycjq9zkMQ` // Include your JWT if necessary
                
            },
            body: JSON.stringify({
                startDate: campaignDetails.startDate, 
                endDate: campaignDetails.endDate
            })
            
        });console.log(response)

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data.data || []); // Adjust based on your API response structure
    } catch (error) {
        console.error('Error fetching active projects:', error);
        toast.error(`Failed to fetch active projects: ${error.message}`);
    }
};

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.error("You can only upload up to 10 images.");
    } else {
      setCampaignDetails((prevDetails) => ({
        ...prevDetails,
        images: files,
      }));
    }
  };

  const handleNext = () => {
    const { title, targetAmount, startDate, endDate } = campaignDetails;
    if (!title || !targetAmount || !startDate || !endDate) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after the start date.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleCheckboxChange = (projectId) => {
    setSelectedProjects((prevSelected) =>
      prevSelected.includes(projectId)
        ? prevSelected.filter(id => id !== projectId)
        : [...prevSelected, projectId]
    );
  };

  const handleSubmit = async () => {
    if (selectedProjects.length === 0) {
      toast.error("Please select at least one project.");
      return;
    }
  
    const formData = new FormData();
    formData.append('title', campaignDetails.title);
    formData.append('description', campaignDetails.description);
    formData.append('targetAmount', campaignDetails.targetAmount);
    formData.append('startDate', campaignDetails.startDate);
    formData.append('endDate', campaignDetails.endDate);
  
    // Append images to formData
    campaignDetails.images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });
  
    // Append selected projects
    selectedProjects.forEach((projectId) => {
        formData.append('projects[]', projectId); 
    });
  
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    try {
      const response = await fetch('https://team23-ngo-backend.onrender.com/api/v1/campaign/addCampaign', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZhNmNkNTI0MjhhNTg4MDgyOWY4M2YiLCJyZWdpc3RyYXRpb25OdW1iZXIiOiJOR08xMjM0NTY3ODkiLCJpYXQiOjE3Mjc3MTkxNzAsImV4cCI6MTcyNzgwNTU3MH0.23RxbymNJWU7sT8enPvb71qDmc0x7oJATCycjq9zkMQ` 
        },
        body: formData,
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error creating campaign.");
      }
  
      toast.success("Campaign created successfully!");
      
      // Reset form fields
      setCampaignDetails({
        title: "",
        description: "",
        targetAmount: "",
        images: [],
        startDate: "",
        endDate: "",
      });
      setSelectedProjects([]);
      setStep(1); // Reset to step 1 if needed
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error("Error creating campaign.");
    }
  };
  
  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-8 bg-green-100 rounded-lg shadow-md mt-8 mb-8">
        <h1 className="text-4xl font-semibold text-green-600 mb-4">Add Campaign</h1>
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Step 1: Campaign Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-gray-700">Campaign Title <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter campaign title"
                  value={campaignDetails.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Campaign Description <span className="text-red-500">*</span></span>
                <textarea
                  name="description"
                  placeholder="Enter campaign description"
                  value={campaignDetails.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Target Amount <span className="text-red-500">*</span></span>
                <input
                  type="number"
                  name="targetAmount"
                  placeholder="Enter target amount"
                  value={campaignDetails.targetAmount}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-700">Start Date <span className="text-red-500">*</span></span>
                  <input
                    type="date"
                    name="startDate"
                    value={campaignDetails.startDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700">End Date <span className="text-red-500">*</span></span>
                  <input
                    type="date"
                    name="endDate"
                    value={campaignDetails.endDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </label>
              </div>
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Step 2: Select Projects</h2>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.projectId} // Ensure this uses the correct identifier
                    className="border border-gray-300 rounded-md p-4 flex items-start hover:shadow-lg transition duration-200"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-16 h-16 mr-4 rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <label className="inline-flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.projectId)}
                          onChange={() => handleCheckboxChange(project.projectId)}
                          className="form-checkbox h-4 w-4 text-green-600"
                        />
                        <span className="ml-2 text-gray-700">Include in Campaign</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No active projects found for the selected date range.</p>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Submit Campaign
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddCampaign;
