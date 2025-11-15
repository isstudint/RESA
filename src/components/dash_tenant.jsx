import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/dash.css';

function Dash_Tenant() {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any stored user data (like tokens, localStorage, etc.)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login/landing page
        navigate('/');
    };

    // Sample booking data
    const bookings = [
        { unitNo: '1239', status: 'ACTIVE', statusColor: 'green' },
        { unitNo: '1239', status: 'INACTIVE', statusColor: 'red' },
        { unitNo: '1239', status: 'PENDING', statusColor: 'yellow' },
    ];

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="user-profile">
                    <div className="profile-image">
                        <div className="avatar-placeholder"></div>
                    </div>
                    <h3>HELLO USERNAME!</h3>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <p className="nav-label">GENERAL</p>
                        <button 
                            className={activeMenu === 'Dashboard' ? 'nav-item active' : 'nav-item'}
                            onClick={() => setActiveMenu('Dashboard')}
                        >
                             Dashboard
                        </button>
                        <button 
                            className={activeMenu === 'Transactions' ? 'nav-item active' : 'nav-item'}
                            onClick={() => setActiveMenu('Transactions')}
                        >
                             Transactions
                        </button>
                    </div>

                    <div className="nav-section">
                        <p className="nav-label">Management</p>
                        <button 
                            className={activeMenu === 'Receipt' ? 'nav-item active' : 'nav-item'}
                            onClick={() => setActiveMenu('Receipt')}
                        >
                             Receipt
                        </button>
                        <button 
                            className={activeMenu === 'Unit Viewer' ? 'nav-item active' : 'nav-item'}
                            onClick={() => setActiveMenu('Unit Viewer')}
                        >
                             Unit Viewer
                        </button>
                        <button 
                            className={activeMenu === 'Support Center' ? 'nav-item active' : 'nav-item'}
                            onClick={() => setActiveMenu('Support Center')}
                        >
                             Support Center
                        </button>
                    </div>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                     Logout(mema palang)
                </button>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="dashboard-header">
                    <h2>Dashboard User</h2>
                    <div className="header-logo">STRUCTIV</div>
                </header>

                <div className="content-grid">
                    {/* Pending Payment Card */}
                    <div className="card pending-payment">
                        <h3>Pending Payment</h3>
                        <p className="empty-state">No pending payment</p>
                    </div>

                    {/* Empty Card (for future use) */}
                    <div className="card empty-card">
                        {/* You can add content here later */}
                    </div>

                    {/* Bookings Card */}
                    <div className="card bookings">
                        <h3>Bookings</h3>
                        <div className="bookings-list">
                            {bookings.map((booking, index) => (
                                <div key={index} className="booking-item">
                                    <span className="unit-label">Unit No. {booking.unitNo}</span>
                                    <div className="status-container">
                                        <span className="status-label">Status:</span>
                                        <span className={`status-badge ${booking.statusColor}`}>
                                            {booking.status}
                                        </span>
                                        <span className={`status-dot ${booking.statusColor}`}></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Empty Cards */}
                    <div className="card empty-card"></div>
                    <div className="card empty-card"></div>
                </div>
            </main>
        </div>
    );
}

export default Dash_Tenant;

