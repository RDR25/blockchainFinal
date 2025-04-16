import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { theme } from "./theme";

import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import Dashboard from "./pages/UserDashboard";
import UserRegistration from "./pages/UserRegistration";
import OfficialRegistration from "./pages/OfficialRegistration";
import UserForgotPassword from "./pages/UserForgotPassword";
import OfficialForgotPassword from "./pages/OfficialForgotPassword";
import RegistrationSuccess from "./pages/RegistrationSuccessful";
import ClerkDashboard from "./pages/ClerkDashboard";
import ClerkHome from "./pages/ClerkHome";
import SuperintendentDashboard from "./pages/SuperintendentDashboard";
import SuperintendentHome from "./pages/SuperintendentHome";
import ProjectOfficierDashboard from "./pages/ProjectOfficerDashboard";
import ProjectOfficerHome from "./pages/ProjectOfficerHome";
import MroDashboard from "./pages/MroDashboard";
import MroHome from "./pages/MroHome";
import SurveyorDashboard from "./pages/SurveyorDashboard";
import SurveyorHome from "./pages/SurveyorHome";
import RevenueInspectorDashboard from "./pages/RevenueInspectorDashboard";
import RevenueInspectorHome from "./pages/RevenueInspectorHome";
import VroDashboard from "./pages/VroDashboard";
import VroHome from "./pages/VroHome";
import RdoDashboard from "./pages/RdoDashboard";
import RdoHome from "./pages/RdoHome";
import JointCollectorDashboard from "./pages/JointCollectorDashboard";
import JointCollectorHome from "./pages/JointCollectorHome";
import DistrictCollectorHome from "./pages/DistrictCollectorHome";
import DistrictCollectorDashboard from "./pages/DistrictCollectorDashboard";
import MinistryWelfareHome from "./pages/MinistryWelfareHome";
import MinistryWelfareDashboard from "./pages/MinistryWelfareDashboard";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', overflowY: 'auto' }}>
        <Router>
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/userhome" element={<UserHome />} />
            <Route path="/userdashboard" element={<Dashboard />} />
            <Route path="/userregister" element={<UserRegistration />} />
            <Route path="/officialregister" element={<OfficialRegistration />} />
            <Route path="/user-forgot-password" element={<UserForgotPassword />} />
            <Route path="/officia-forgot-password" element={<OfficialForgotPassword />} />
            <Route path="/registrationsuccess" element={<RegistrationSuccess />} />
            <Route path="/clerkdashboard" element={<ClerkDashboard />} />
            <Route path="/superintendentdashboard" element={<SuperintendentDashboard />} />
            <Route path="/podashboard" element={<ProjectOfficierDashboard />} />
            <Route path="/mrodashboard" element={<MroDashboard />} />
            <Route path="/surveyordashboard" element={<SurveyorDashboard />} />
            <Route path="/revenueinspectordashboard" element={<RevenueInspectorDashboard />} />
            <Route path="/vrodashboard" element={<VroDashboard />} />
            <Route path="/rdodashboard" element={<RdoDashboard />} />
            <Route path="/jointcollectordashboard" element={<JointCollectorDashboard />} />
            <Route path="/jointcollectorhome" element={<JointCollectorHome />} />
            <Route path="/ministryofwelfaredashboard" element={<MinistryWelfareDashboard />} />
            <Route path="/ministrywelfarehome" element={<MinistryWelfareHome />} />
            <Route path="/clerkhome" element={<ClerkHome />} />
            <Route path="/superintendenthome" element={<SuperintendentHome />} />
            <Route path="/pohome" element={<ProjectOfficerHome />} />
            <Route path="/mrohome" element={<MroHome />} />
            <Route path="/surveyorhome" element={<SurveyorHome />} />
            <Route path="/revenueinspectorhome" element={<RevenueInspectorHome />} />
            <Route path="/vrohome" element={<VroHome />} />
            <Route path="/rdohome" element={<RdoHome />} />
            <Route path="/districtcollectordashboard" element={<DistrictCollectorDashboard />} />
            <Route path="/districtcollectorhome" element={<DistrictCollectorHome />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
