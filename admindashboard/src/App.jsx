import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Common Page Imports
import RoleGuard from "./routes/RoleGuard";
import Login from "./pages/Login";
import PublicRoutes from "./routes/PublicRoutes";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";
import ForgotPasswordEmail from "./pages/ForgotPassword";

//Founder Pages Imports
import FounderLayout from "./pages/founder/layout/FounderLayout";
import FounderDashboard from "./pages/founder/Dashboard";
import FounderClientsTable from "./pages/founder/clients/ClientsTable";
import FounderClientProfile from "./pages/founder/clients/ClientProfile";
import FounderHeadsList from "./pages/founder/heads/HeadTable";
import FounderHeadsProfile from "./pages/founder/heads/HeadProfile";
import FounderHeadForm from "./pages/founder/heads/HeadForm";
import FounderHeadEditForm from "./pages/founder/heads/HeadEditForm";
import FounderHeadDelete from "./pages/founder/heads/HeadDeletePopUp";
import FounderCategoryList from "./pages/founder/category/CategoryTable";
import FounderCategoryForm from "./pages/founder/category/CategoryForm";
import FounderCategoryEditForm from "./pages/founder/category/CategoryEditForm";
import FounderCategoryDelete from "./pages/founder/category/CategoryDeletePopUp";
import FounderExpertList from "./pages/founder/experts/ExpertTable";
import FounderExpertProfile from "./pages/founder/experts/ExpertProfile";
import FounderAdminList from "./pages/founder/admin/AdminsList";
import FounderAdminProfile from "./pages/founder/admin/AdminProfile";
import FounderProgramsList from "./pages/founder/programsList/ProgramTable";
import FounderProgramsForm from "./pages/founder/programsList/ProgramForm";
import FounderProgramsEditForm from "./pages/founder/programsList/ProgramEditForm";
import FounderProgramsDelete from "./pages/founder/programsList/ProgramDeletePopUp";
import FounderTherapyList from "./pages/founder/therapy/TherapyTable";
import FounderTherapyForm from "./pages/founder/therapy/TherapyForm";
import FounderFinanceList from "./pages/founder/finance/FinanceTable";
import FounderTherapyPlanView from "./pages/founder/therapy/TherapyViewPlan"
import FounderBroadcastTemplates from "./pages/founder/broadcast/Templates";
import FounderTemplateSummary from "./pages/founder/broadcast/TemplateSummary";
import FounderBroadcastCreate from "./pages/founder/broadcast/CreateBroadcast";
import FounderBroadcastAutoReminder from "./pages/founder/broadcast/AutoReminders";
import FounderBroadcastDelete from "./pages/founder/broadcast/broadcastDeletePopUp";
import FounderBroadcastEdit from "./pages/founder/broadcast/broadcastEdit";

//Head Pages Imports
import HeadLayout from "./pages/head/layout/HeadLayout";
import HeadDashboard from "./pages/head/Dashboard";
import HeadClientsTable from "./pages/head/clients/ClientsTable";
import HeadExperList from "./pages/head/experts/ExpertTable";
import HeadAdminsList from "./pages/head/admin/AdminsList";
import HeadFinanceTable from "./pages/head/finance/FinanceTable";
import HeadExpertTable from "./pages/head/experts/ExpertTable";
import HeadAddAdmin from "./pages/head/admin/AdminForm";
import HeadExpertProfile from "./pages/head/experts/ExpertProfile";
import HeadAdminProfile from "./pages/head/admin/AdminProfile";
import HeadClientProfile from "./pages/head/clients/ClientProfile";
import HeadProgramTable from "./pages/head/programsList/ProgramTable";
import HeadTherapyList from "./pages/head/therapy/TherapyTable";
import HeadTherapyPlan from "./pages/head/therapy/TherapyViewPlan";

//Admin Pages Imports
import AppLayout from "./pages/admin/layout/AppLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminChats from "./pages/admin/chats/Chats";
import AdminClientsTable from "./pages/admin/clients/ClientsTable";
import AdminExpertTable from "./pages/admin/experts/ExpertTable";
import AdminFinance from "./pages/admin/finance/FinanceTable";
import AdminAddExpert from "./pages/admin/experts/ExpertForm";
import AdminExpertEdit from "./pages/admin/experts/ExpertEditForm";
import AdminExpertDelete from "./pages/admin/experts/ExpertDeletePopUp";
import AdminExpertProfile from "./pages/admin/experts/ExpertProfile";
import AdminClientProfile from "./pages/admin/clients/ClientProfile";
import AdminAddClient from "./pages/admin/clients/ClientForm";
import AdminClientEdit from "./pages/admin/clients/ClientEditForm";
import AdminClientDelete from "./pages/admin/clients/ClientDeletePopUp";
import AdminProgramTable from "./pages/admin/programsList/ProgramTable";
import PlanForm from "./pages/admin/programsList/PlanForm";
import AdminPlanView from "./pages/admin/programsList/PlanDetailsView";
import AdminTherapyList from"./pages/admin/therapy/TherapyTable";
import AdminTherapyPlanDetails from"./pages/admin/therapy/TherapyViewPlan";

//Expert Pages Imports
import ExpertLayout from "./pages/expert/layout/ExpertLayout";
import ExpertDashboard from "./pages/expert/Dashboard";
import ExpertClientsTable from "./pages/expert/clients/ClientsTable";
import ExpertChats from "./pages/expert/chats/Chats";
import ExpertPrograms from "./pages/expert/programsList/ProgramTable";
import ExpertPlanDetails from "./pages/expert/programsList/PlanDetailsView";
import ExpertFinance from "./pages/expert/finance/FinanceTable";
import ExpertClientProfile from "./pages/expert/clients/ClientProfile";
import ExpertTherapyList from "./pages/expert/therapy/TherapyTable";
import ExpertTherapyPlanDetails from "./pages/expert/therapy/TherapyViewPlan";

// Client Pages Import
import ClientLayout from "./pages/client/layout/ClientLayout";
import ClientDashboard from "./pages/client/Dashboard";
import ClientFeedback from "./pages/client/feedback/Feedback";
import ClientProgress from "./pages/client/progress/Progress";
import DailyPlan from "./pages/client/dailyPlan/DailyPlan";
import ClientChat from "./pages/client/chats/Chats";
import Habit from "./pages/expert/habit/Habit";
import HabitTracker from "./pages/client/habit/HabitTracker";
import HabitDisplay from "./pages/expert/habit/HabitDisplay";
import WeeklyHabit from "./pages/expert/habit/WeeklyHabit";


function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoutes>
              <ForgotPasswordEmail />
            </PublicRoutes>
          }
        />

        {/* FOUNDER */}
        <Route
          path="/founder"
          element={
            <RoleGuard allowedRoles={["founder"]}>
              <FounderLayout />
            </RoleGuard>
          }
        >
          <Route index element={<FounderDashboard />} />
          <Route path="heads" element={<FounderHeadsList />} />
          <Route path="heads/profile/:id" element={<FounderHeadsProfile />} />
          <Route path="heads/edit/:id" element={<FounderHeadEditForm />} />
          <Route path="heads/delete/:id" element={<FounderHeadDelete />} />
          <Route path="heads/add-head" element={<FounderHeadForm />} />
          <Route path="admins" element={<FounderAdminList />} />
          <Route path="admins/profile/:id" element={<FounderAdminProfile />} />
          <Route path="experts" element={<FounderExpertList />} />
          <Route
            path="experts/profile/:id"
            element={<FounderExpertProfile />}
          />
          <Route path="clients" element={<FounderClientsTable />} />
          <Route
            path="clients/profile/:id"
            element={<FounderClientProfile />}
          />
          <Route path="programs" element={<FounderProgramsList />} />
          <Route
            path="programs/edit/:id"
            element={<FounderProgramsEditForm />}
          />
          <Route
            path="programs/delete/:id"
            element={<FounderProgramsDelete />}
          />
          <Route
            path="programs/add-program"
            element={<FounderProgramsForm />}
          />
          <Route path="categories" element={<FounderCategoryList />} />
          <Route
            path="categories/add-category"
            element={<FounderCategoryForm />}
          />
          <Route
            path="categories/edit/:id"
            element={<FounderCategoryEditForm />}
          />
          <Route
            path="categories/delete/:id"
            element={<FounderCategoryDelete />}
          />
          <Route path="finance" element={<FounderFinanceList />} />
          <Route path="therapy" element={<FounderTherapyList />} />
          <Route path="therapy/create" element={<FounderTherapyForm />} />
          <Route path="therapy/edit/:id" element={<FounderTherapyForm />} />
          <Route path="therapy/plan/:id" element={<FounderTherapyPlanView />} />
          <Route path="broadcasts" element={<FounderBroadcastTemplates />} />
          <Route
            path="broadcasts/delete/:id"
            element={<FounderBroadcastDelete />}
          />
          <Route
            path="broadcasts/edit/:id"
            element={<FounderBroadcastEdit />}
          />
          <Route
            path="broadcasts/summary/:id"
            element={<FounderTemplateSummary />}
          />
          <Route
            path="broadcast/add-Template"
            element={<FounderBroadcastCreate />}
          />
          <Route
            path="auto-remainder"
            element={<FounderBroadcastAutoReminder />}
          />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* HEAD */}
        <Route
          path="/head"
          element={
            <RoleGuard allowedRoles={["head"]}>
              <HeadLayout />
            </RoleGuard>
          }
        >
          <Route index element={<HeadDashboard />} />
          <Route path="admins" element={<HeadAdminsList />} />
          <Route path="expert" element={<HeadExperList />} />
          <Route path="clients" element={<HeadClientsTable />} />
          <Route path="experts" element={<HeadExpertTable />} />
          <Route path="finance" element={<HeadFinanceTable />} />
          <Route path="admins/add-admin" element={<HeadAddAdmin />} />
          <Route
            path="experts/profile/:expertId"
            element={<HeadExpertProfile />}
          />
          <Route path="admins/profile/:id" element={<HeadAdminProfile />} />
          <Route path="clients/profile/:Id" element={<HeadClientProfile />} />
          <Route path="programs" element={<HeadProgramTable />} />
          <Route path="profile" element={<Profile />} />
          <Route path="therapy" element={<HeadTherapyList />} />
          <Route path="therapy/plan/:id" element={<HeadTherapyPlan />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <AppLayout />
            </RoleGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<AdminClientsTable />} />
          <Route path="experts" element={<AdminExpertTable />} />
          <Route path="chats" element={<AdminChats />} />
         
          <Route path="experts/edit/:id" element={<AdminExpertEdit />} />
          <Route path="experts/delete/:id" element={<AdminExpertDelete />} />
          <Route path="experts/addexpert" element={<AdminAddExpert />} />
          <Route
            path="experts/profile/:expertId"
            element={<AdminExpertProfile />}
          />
          <Route path="clients/profile/:id" element={<AdminClientProfile />} />
          <Route path="clients/addclient" element={<AdminAddClient />} />
          <Route path="clients/edit/:id" element={<AdminClientEdit />} />
          <Route path="clients/delete/:id" element={<AdminClientDelete />} />
          <Route path="programs" element={<AdminProgramTable />} />
          <Route path="programs/plan/edit/:programId" element={<PlanForm />} />
          <Route path="programs/create" element={<PlanForm />} />
          <Route path="programs/plans" element={<AdminPlanView />} />
          <Route path="profile" element={<Profile />} />
          <Route path="therapy" element={<AdminTherapyList />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route
            path="therapy/plan/:id"
            element={<AdminTherapyPlanDetails />}
          />
        </Route>

        {/* EXPERT */}
        <Route
          path="/expert"
          element={
            <RoleGuard allowedRoles={["expert"]}>
              <ExpertLayout />
            </RoleGuard>
          }
        >
          <Route index element={<ExpertDashboard />} />
          <Route path="clients" element={<ExpertClientsTable />} />
          <Route path="clients/profile/:id" element={<ExpertClientProfile />} />
          <Route path="weekly-habit" element={<WeeklyHabit />} />
          <Route path="chats" element={<ExpertChats />} />
          <Route path="programs" element={<ExpertPrograms />} />
          <Route path="programs/viewPlan" element={<ExpertPlanDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="finance" element={<ExpertFinance />} />

          <Route path="therapy" element={<ExpertTherapyList />} />
          <Route
            path="therapy/plan/:id"
            element={<ExpertTherapyPlanDetails />}
          />
          {/* <Route path="habit" element={<Habit/>}/> */}
          <Route path="clients/add-habit/:id" element={<Habit />} />
          <Route path="clients/habit/:habitId" element={<HabitDisplay />} />
        </Route>

        {/* CLIENT */}

        <Route
          path="/client"
          element={
            <RoleGuard allowedRoles={["user"]}>
              <ClientLayout />
            </RoleGuard>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="feedback" element={<ClientFeedback />} />
          <Route path="progress" element={<ClientProgress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="daily-plan" element={<DailyPlan />} />
          <Route path="habit-tracker" element={<HabitTracker />} />
          <Route path="chats" element={<ClientChat />} />
        </Route>

        <Route path="/*" element={<Unauthorized />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
