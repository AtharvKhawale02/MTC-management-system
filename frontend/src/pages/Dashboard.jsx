import { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import Icon from "../components/Icon";

// Reusable Dashboard Card Component
function DashboardCard({ title, value, icon, color }) {
  return (
    <div style={{
      ...styles.card,
      borderLeft: `4px solid ${color}`
    }}>
      <div style={styles.cardIcon}>
        <Icon name={icon} size={32} color={color} />
      </div>
      <div style={styles.cardContent}>
        <h3 style={styles.cardValue}>{value}</h3>
        <p style={styles.cardTitle}>{title}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalTcds: 0,
    pendingTcds: 0,
    totalMtc: 0,
    recentRecords: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/dashboard/stats");
      
      setStats({
        totalTcds: response.data.totalTcds || 0,
        pendingTcds: response.data.pendingTcds || 0,
        totalMtc: response.data.totalMtc || 0,
        recentRecords: response.data.recentActivity?.length || 0
      });
      
      setRecentActivity(response.data.recentActivity || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div style={styles.cardsGrid}>
        <DashboardCard
          title="Total TCDS"
          value={stats.totalTcds}
          icon="document"
          color="#3b82f6"
        />
        <DashboardCard
          title="Pending TCDS"
          value={stats.pendingTcds}
          icon="clock"
          color="#f59e0b"
        />
        <DashboardCard
          title="Total MTC Generated"
          value={stats.totalMtc}
          icon="check"
          color="#10b981"
        />
        <DashboardCard
          title="Total Recent Records"
          value={stats.recentRecords}
          icon="chart"
          color="#8b5cf6"
        />
      </div>

      {/* Recent Activity Section */}
      <div style={styles.activitySection}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        
        {recentActivity.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr key={activity.id} style={styles.tableRow}>
                    <td style={styles.td}>{activity.type}</td>
                    <td style={styles.td}>{activity.user}</td>
                    <td style={styles.td}>{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={styles.noData}>No recent activity</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "0",
    maxWidth: "1400px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "30px",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    fontSize: "16px",
    color: "#666",
  },
  cardsGrid: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  card: {
    flex: "1",
    minWidth: "240px",
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  cardIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: "1",
  },
  cardValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#333",
    margin: "0 0 8px 0",
  },
  cardTitle: {
    fontSize: "14px",
    color: "#666",
    margin: "0",
    fontWeight: "500",
  },
  activitySection: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    borderBottom: "2px solid #ddd",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "12px 16px",
    fontSize: "14px",
    color: "#666",
  },
  noData: {
    textAlign: "center",
    padding: "40px",
    color: "#999",
    fontSize: "14px",
  },
};

export default Dashboard;
