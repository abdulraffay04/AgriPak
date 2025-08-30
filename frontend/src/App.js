// // App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import DashboardUser from './pages/DashboardUser';
// import DashboardAdmin from './pages/DashboardAdmin';
// import BlogPage from './pages/BlogPage';
// import YieldCalculator from './pages/YieldCalculator';
// import CropsRate from './pages/CropsRate';
// import Chatting from './pages/Chatting';
// import UserList from './pages/UserList';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* User Dashboard */}
//         <Route path="/user/dashboard" element={<ProtectedRoute role="user"><DashboardUser /></ProtectedRoute>} />
//         <Route path="/user/calculator" element={<ProtectedRoute role="user"><YieldCalculator /></ProtectedRoute>} />
//         <Route path="/user/rate" element={<ProtectedRoute role="user"><CropsRate /></ProtectedRoute>} />
//         <Route path="/user/chat" element={<ProtectedRoute role="user"><Chatting /></ProtectedRoute>} />
//         <Route path="/user/blogs" element={<ProtectedRoute role="user"><BlogPage /></ProtectedRoute>} />

//         {/* Admin Dashboard */}
//         <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><DashboardAdmin /></ProtectedRoute>} />
//         <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserList /></ProtectedRoute>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;









// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardUser from './pages/DashboardUser';
import DashboardAdmin from './pages/DashboardAdmin';
import BlogPage from './pages/BlogPage';
import YieldCalculator from './pages/YieldCalculator';
import CropsRate from './pages/CropsRate';
import Chatting from './pages/Chatting';
import UserList from './pages/UserList';
import ProtectedRoute from './components/ProtectedRoute';

import UserLayout from './pages/UserLayout';
import AdminLayout from './pages/AdminLayout';
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Layout with Protected Routes */}
        <Route path="/user" element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<DashboardUser />} />
          <Route path="calculator" element={<YieldCalculator />} />
          <Route path="rate" element={<CropsRate />} />
          <Route path="chat" element={<Chatting />} />
          <Route path="blogs" element={<BlogPage />} />
        </Route>

        {/* Admin Dashboard */}
         <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route path="Dashboard" element={<DashboardAdmin />} />
          <Route path="users" element={<UserList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
