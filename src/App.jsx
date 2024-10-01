import {Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import Homepage from "./Pages/Homepage";
import NGOLogin from "./Pages/N-Login";
import NGORegister from "./Pages/N-Register";
import NGOUpdate from "./Pages/N-Update";
import AddCampaign from "./Pages/AddCampaign";
import AddProject from "./Pages/AddProject";
import AddVolunteer from "./Pages/AddVolunteer";
import NgoProfile from "./Pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<Homepage />} />
      <Route path="/NgoLogin" element={<NGOLogin />} />
      <Route path="/NgoProfile" element={<NgoProfile />} />
      <Route path="/NgoRegister" element={<NGORegister />} />
      <Route path="/NgoUpdate" element={<NGOUpdate />} />
      <Route path="/AddCampaign" element={<AddCampaign />} />
      <Route path="/AddProject" element={<AddProject />} />
      <Route path="/AddVolunteer" element={<AddVolunteer />} />
      </Route>
    </Routes>
   
  )
}

export default App
