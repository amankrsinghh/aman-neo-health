import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import Loader from "../Common/Loader";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/dashboard");
        console.log(res)
        if (res.data.success) setData(res.data.data);
      } catch { /* error handled by interceptor */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader />;

  const months = data?.monthlyAppointments?.map(m => m.month) || [];
  const docAppts = data?.monthlyAppointments?.map(m => m.doctorAppointments) || [];
  const labAppts = data?.monthlyAppointments?.map(m => m.labAppointments) || [];

  const genderMap = { male: 0, female: 0, other: 0 };
  data?.genderStats?.forEach(g => { genderMap[g._id?.toLowerCase() || 'other'] = g.count; });

  const apptStatusMap = {};
  data?.apptStatus?.forEach(a => { apptStatusMap[a._id] = a.count; });

  const appointmentChart = {
    series: [
      { name: "Doctor Appointments", data: docAppts },
      { name: "Lab Appointments", data: labAppts },
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      colors: ["#FEB052", "#00B4B5"],
      plotOptions: { bar: { horizontal: false, columnWidth: "40%" } },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 3, colors: ["transparent"] },
      xaxis: { categories: months, labels: { style: { colors: "#7A7A7A", fontSize: "14px" } } },
      yaxis: { labels: { style: { colors: "#7A7A7A", fontSize: "14px" } } },
      legend: { position: "top", horizontalAlign: "left", fontSize: "14px", markers: { radius: 4 } },
      grid: { border: "1px dashed #D4D4D4" },
      tooltip: { theme: "light" },
    },
  };

  const doctorGenderChart = {
    series: [genderMap.male, genderMap.female, genderMap.other],
    options: {
      chart: { type: "donut" },
      labels: ["Male", "Female", "Other"],
      colors: ["#31398C", "#EB5299", "#2FF498"],
      legend: { position: "top", horizontalAlign: "left", fontSize: "14px", markers: { radius: 4 } },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: "75%",
            labels: {
              show: true,
              total: {
                show: true, label: "Total Doctors", fontSize: "16px", color: "#4D667E",
                formatter: () => data?.doctors?.total?.toLocaleString() || "0",
              },
            },
          },
        },
      },
    },
  };

  const apptStatusChart = {
    series: [apptStatusMap.completed || 0, apptStatusMap.pending || 0, apptStatusMap.cancelled || 0],
    options: {
      chart: { type: "donut" },
      labels: ["Completed", "Pending", "Cancelled"],
      colors: ["#00B4B5", "#FEB052", "#FF4560"],
      legend: { position: "top", horizontalAlign: "left" },
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: "75%" } } },
    },
  };

  const statCards = [
    { label: "Total Doctors", value: data?.doctors?.total, pending: data?.doctorRequests?.total, color: "#31398C", link: "/doctors" },
    { label: "Total Patients", value: data?.patients?.total, color: "#EB5299", link: "/patients" },
    { label: "Total Labs", value: data?.labs?.total, pending: data?.labRequests?.total, color: "#00B4B5", link: "/laboratory" },
    { label: "Total Pharmacies", value: data?.pharmacies?.total, pending: data?.pharmacyRequests?.total, color: "#FEB052", link: "/pharmacy" },
    { label: "Total Hospitals", value: data?.hospitals?.total, pending: data?.hospitalRequests?.total, color: "#2FF498", link: "/hospital" },
    { label: "Doctor Appointments", value: data?.doctorAppointments?.total, color: "#7C3AED", link: "/doctor-appointments" },
    { label: "Lab Appointments", value: data?.labAppointments?.total, color: "#EA580C", link: "/laboratory-appointments" },
  ];

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="innr-title mb-0">Dashboard</h3>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>Welcome back, Admin</p>
        </div>
        <div className="d-flex gap-2">
          {(data?.doctorRequests?.total > 0 || data?.labRequests?.total > 0 || data?.pharmacyRequests?.total > 0 || data?.hospitalRequests?.total > 0) && (
            <span className="badge bg-warning text-dark px-3 py-2">
              {(data?.doctorRequests?.total || 0) + (data?.labRequests?.total || 0) + (data?.pharmacyRequests?.total || 0) + (data?.hospitalRequests?.total || 0)} pending approvals
            </span>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((c, i) => (
          <div className="col-xl-3 col-lg-4 col-md-6" key={i}>
            <Link to={c.link} style={{ textDecoration: "none" }}>
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: `4px solid ${c.color}`, borderRadius: 12 }}>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <p className="text-muted mb-1" style={{ fontSize: 13 }}>{c.label}</p>
                    <h3 className="fw-bold mb-0" style={{ color: c.color }}>{c.value?.toLocaleString() ?? "—"}</h3>
                    {c.pending > 0 && (
                      <span className="badge bg-warning text-dark mt-1" style={{ fontSize: 11 }}>
                        {c.pending} pending
                      </span>
                    )}
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: c.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: c.color, fontSize: 22, fontWeight: 700 }}>
                      {c.label.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
        {/* This month */}
        <div className="col-xl-3 col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #10B981", borderRadius: 12 }}>
            <div className="card-body">
              <p className="text-muted mb-1" style={{ fontSize: 13 }}>This Month</p>
              <p className="mb-1" style={{ fontSize: 14 }}>
                <span className="fw-semibold">+{data?.doctors?.currentMonth}</span> new doctors
              </p>
              <p className="mb-0" style={{ fontSize: 14 }}>
                <span className="fw-semibold">+{data?.patients?.currentMonth}</span> new patients
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Monthly Appointments (Last 6 months)</h6>
              <Chart options={appointmentChart.options} series={appointmentChart.series} type="bar" height={280} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Doctor Gender</h6>
              <Chart options={doctorGenderChart.options} series={doctorGenderChart.series} type="donut" height={280} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Appointment Status</h6>
              <Chart options={apptStatusChart.options} series={apptStatusChart.series} type="donut" height={240} />
            </div>
          </div>
        </div>

        {/* Recent Doctors */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0">Recent Doctors</h6>
                <Link to="/doctors" style={{ fontSize: 13, color: "#31398C" }}>View all</Link>
              </div>
              {data?.recentDoctors?.map((d, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: i < 4 ? "1px solid #f0f0f0" : "none" }}>
                  <div>
                    <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>{d.name}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: 12 }}>{d.email}</p>
                  </div>
                  <span className={`badge ${d.status === "active" ? "bg-success" : d.status === "pending" ? "bg-warning text-dark" : "bg-danger"}`} style={{ fontSize: 11 }}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0">Recent Patients</h6>
                <Link to="/patients" style={{ fontSize: 13, color: "#31398C" }}>View all</Link>
              </div>
              {data?.recentPatients?.map((p, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: i < 4 ? "1px solid #f0f0f0" : "none" }}>
                  <div>
                    <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>{p.name}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: 12 }}>{p.contactNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
