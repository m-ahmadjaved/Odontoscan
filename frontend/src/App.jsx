import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import "./app.css";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/Admin/Dashboard";
import UploadData from "./components/Admin/UploadData";
import ViewRecords from "./components/Admin/ViewRecords";
import DeleteAllRecords from "./components/Admin/DeleteAllRecords";
import MatchRadiographs from "./components/Admin/MatchRadiographs";
import AddForensic from "./components/Admin/AddForensic";
import EditRecordPage from "./components/Admin/editRecord";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // For icons

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Default route that goes to the LoginPage */}
        <Route path="/" element={<LoginPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/upload" element={<UploadData />} />
        <Route path="/admin/view-records" element={<ViewRecords />} />
        <Route
          path="/admin/delete-all-records"
          element={<DeleteAllRecords />}
        />
        <Route path="/admin/edit-record/:id" element={<EditRecordPage />} />
        <Route path="/match-radiographs" element={<MatchRadiographs />} />
        <Route path="/admin/add-forensic" element={<AddForensic />} />
      </Routes>
    </Router>
  );
};

export default App;
