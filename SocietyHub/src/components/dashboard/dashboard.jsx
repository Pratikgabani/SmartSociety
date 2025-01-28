import { useState } from 'react';
import { MdPayments, MdPeople, MdOutlineReportProblem, MdMenu } from 'react-icons/md';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data - replace with real data from your backend
  const paymentData = [
    { month: 'Jan', amount: 40000 },
    { month: 'Feb', amount: 30000 },
    { month: 'Mar', amount: 60000 },
    // ... more data
  ];

  const recentActivities = [
    { type: 'complaint', title: 'Water Leakage', date: '2023-08-15' },
    { type: 'visitor', name: 'John Doe', date: '2023-08-14' },
    // ... more activities
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo">Society Name</div>
        
        <nav>
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <MdMenu /> Dashboard
          </button>
          <button onClick={() => setActiveTab('visitors')}>
            <MdPeople /> <a href="/Visitor">Visitor</a>
          </button>
          <button onClick={() => setActiveTab('payments')}>
            <MdPayments /> Payments
          </button>
          <button onClick={() => setActiveTab('complaints')}>
            <MdOutlineReportProblem /> Complaints
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MdMenu />
          </button>
          <div className="profile-section">
            <span>Welcome, Admin</span>
            <div className="profile-pic"></div>
          </div>
        </header>

        {/* Quick Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <MdPeople className="card-icon" />
            <h3>Recent Visitors</h3>
            <p>15</p>
          </div>
          
          <div className="stat-card">
            <MdPayments className="card-icon" />
            <h3>Pending Payments</h3>
            <p>₹1,20,500</p>
          </div>
          
          <div className="stat-card">
            <MdOutlineReportProblem className="card-icon" />
            <h3>Unresolved Complaints</h3>
            <p>8</p>
          </div>
          
          <div className="stat-card">
            <MdPeople className="card-icon" />
            <h3>Total Residents</h3>
            <p>240</p>
          </div>
        </div>

        {/* Payment Chart */}
        <div className="chart-container">
          <h2>Payment Trends</h2>
          <LineChart width={800} height={300} data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className={`type-badge ${activity.type}`}>{activity.type}</span>
                <span>{activity.title || activity.name}</span>
                <span className="activity-date">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;