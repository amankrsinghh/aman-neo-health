import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";
import { getSecureApiData } from "../../Service/api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);


const PharHome = () => {
    const [stockMap, setStockMap] = useState({
        H1: 0,
        H: 0,
        X: 0,
        OTHER: 0
    });
    // ---------------- BAR CHART ----------------
    const labels = ["H1", "H", "X", "OTHER"];

    const stockFull = [];
    const stockRisk = [];
    const deadStock = [];

    labels.forEach(label => {
        const qty = stockMap[label] || 0;

        if (qty === 0) {
            deadStock.push(0);   // 🔴 visible bar (1 chhota lagta hai)
            stockFull.push(0);
            stockRisk.push(0);
        } else if (qty < 50) {
            stockRisk.push(qty);
            stockFull.push(0);
            deadStock.push(0);
        } else {
            stockFull.push(qty);
            stockRisk.push(0);
            deadStock.push(0);
        }
    });
    const barData = {
        labels,
        datasets: [
            {
                label: "Stock Full",
                data: stockFull,
                backgroundColor: "#00B4B5",
            },
            {
                label: "Stockout Risk",
                data: stockRisk,
                backgroundColor: "#EBA352",
            },
            {
                label: "Dead Stock",
                data: deadStock,
                backgroundColor: "#D91313",
            }
        ]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false, // HEIGHT ENABLE
        plugins: {
            legend: {
                position: "top",
                labels: { usePointStyle: true, boxWidth: 8 },
            },
        },
        scales: {
            y: {
                border: { dash: [4, 4] },
                ticks: { stepSize: 100 },
            },
            x: {
                grid: { display: false },
            },
        },
    };


    // ---------------- DOUGHNUT CHART ----------------
    const [doughnutData, setDoughnutData] = useState({
        labels: ["H1", "X", "H",],
        datasets: [
            {
                label: "Inventory %",
                data: [0, 0, 0],
                backgroundColor: [
                    "#68E256",
                    "#5668E2",
                    "#CF56E2",

                ],
                borderWidth: 2,
                cutout: "45%",
            },
        ],
    });

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false, // HEIGHT ENABLE
        plugins: {
            legend: {
                position: "right",
                labels: { usePointStyle: true, boxWidth: 10 },
            },
        },
    };
    const userId = localStorage.getItem('userId')
    const [inventoryValue, setInventoryValue] = useState(0)
    const [h1Compliance, setH1Compliance] = useState(0)
    const [hCompliance, setHCompliance] = useState(0)
    const [xCompliance, setXCompliance] = useState(0)
    const [expiryCount, setExpiryCount] = useState(0)
    const [totalSales, setTotalSales] = useState()
    const [marginData, setMarginData] = useState([])
    const [supplierData, setSupplierData] = useState([])
    const [inventory, setInventory] = useState([])

    const [loading, setLoading] = useState(false)
    const pharDashboard = async () => {
        setLoading(true)
        try {
            const response = await getSecureApiData(`pharmacy/dashboard/${userId}`);
            if (response.success) {
                setExpiryCount(response.expiringSoonCount)
                setInventoryValue(response.inventoryValue)
                setH1Compliance(response.h1Compliance)
                setHCompliance(response.totalHQuantity)
                setXCompliance(response.totalXQuantity)
                setMarginData(response.marginAnalysis)
                setTotalSales(response.totalSales)
                setSupplierData(response.supplierData)
                setInventory(response.inventory)
                setStockMap(response.stockMap);
                setDoughnutData({
                    labels: ["H1", "X", "H", "Other"],
                    datasets: [
                        {
                            label: "Inventory %",
                            data: [response.totalH1Quantity, response.totalXQuantity, response.totalHQuantity, response.totalOtherQuantity],
                            backgroundColor: [
                                "#68E256",
                                "#5668E2",
                                "#CF56E2",
                                "#210be6"
                            ],
                            borderWidth: 2,
                            cutout: "45%",
                        },
                    ],
                })
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        pharDashboard()
    }, [userId])

    return (
        <>
            {loading ?
                <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                            <div className="new-mega-card h-100 pharmacy-cards">
                                <div className="inventory-content">
                                    <div className="inventory-parent-bx">
                                        <div className="inventory-bx">
                                            <img src="/box.svg" alt="" />
                                        </div>
                                        <h4>{inventoryValue}</h4>
                                    </div>
                                    <p className="mt-2">Total Inventory Value</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
                            <div className="new-mega-card h-100 pharmacy-cards">
                                <div className="inventory-content">
                                    <div className="inventory-parent-bx">
                                        <div className="inventory-bx">
                                            <img src="/cash.svg" alt="" />
                                        </div>
                                        <h4>{totalSales}</h4>
                                    </div>
                                    <p className="mt-2">Monthly Sales</p>
                                </div>
                            </div>
                        </div>

                        {/* <div className="col-lg-3 col-md-4 col-sm-12 mb-3 ">
              <div className="new-mega-card h-100 pharmacy-cards">
                <div className="inventory-content">
                  <div className="inventory-parent-bx">
                    <div className="inventory-bx">
                      <img src="/chart.svg" alt="" />
                    </div>
                    <h4>59589</h4>
                  </div>
                  <p className="mt-2">Stock Turnover Ratio</p>
                </div>
              </div>
            </div> */}

                        {/* <div className="col-lg-3 col-md-4 col-sm-12 mb-3 ">
              <div className="new-mega-card h-100 pharmacy-cards">
                <div className="inventory-content">
                  <div className="inventory-parent-bx">
                    <div className="inventory-bx">
                      <img src="/margin.svg" alt="" />
                    </div>
                    <h4>59589</h4>
                  </div>
                  <p className="mt-2">Gross Margin</p>
                </div>
              </div>
            </div> */}

                        <div className="col-lg-3 col-md-4 col-sm-12 mb-3 ">
                            <div className="new-mega-card h-100 pharmacy-cards">
                                <div className="inventory-content">
                                    <div className="inventory-parent-bx ">
                                        <div className="inventory-bx alert-inventory-bx">
                                            <img src="/alert.svg" alt="" />
                                        </div>
                                        <h4>{expiryCount}</h4>
                                    </div>
                                    <p className="mt-2">Expiring Soon (30 days)</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-12 mb-3 ">
                            <div className="new-mega-card h-100 pharmacy-cards">
                                <div className="inventory-content">
                                    <div className="inventory-parent-bx">
                                        <div className="inventory-bx">
                                            <img src="/page.svg" alt="" />
                                        </div>
                                        <h4>{h1Compliance}</h4>
                                    </div>
                                    <p className="mt-2">Schedule H1 Compliance</p>
                                </div>
                            </div>
                        </div>

                        {/* <div className="col-lg-3 col-md-4 col-sm-12 mb-3 ">
              <div className="new-mega-card h-100 pharmacy-cards">
                <div className="inventory-content">
                  <div className="inventory-parent-bx">
                    <div className="inventory-bx ">
                      <img src="/percentage.svg" alt="" />
                    </div>
                    <h4>35</h4>
                  </div>
                  <p className="mt-2">GST Compliance</p>
                </div>
              </div>
            </div> */}
                    </div>

                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <div className="new-mega-card h-100">
                                <div>
                                    <h5 className="text-grad">Inventory Stock</h5>
                                </div>
                                <div style={{ height: "350px" }}>
                                    <Bar data={barData} options={barOptions} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-3">
                            <div className="new-mega-card h-100">
                                <div>
                                    <h5 className="text-grad">Inventory %</h5>
                                </div>
                                <div style={{ height: "350px" }}>
                                    <Doughnut data={doughnutData} options={doughnutOptions} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-8 col-md-6 col-sm-12 mb-3">
                            <div className="new-mega-card">
                                <div className="admn-title mb-4 d-flex align-items-center justify-content-between flex-wrap">
                                    <div>
                                        <h5 className="text-grad">Supplier</h5>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Link to="/supplier" className="nw-thm-btn rounded-3">Add Supplier</Link>
                                        <Link to="/generate-list" className="thm-btn rounded-3">View All </Link>
                                    </div>
                                </div>
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Supplier</th>
                                                    <th>Phone</th>
                                                    <th>Email</th>
                                                    <th>City</th>
                                                    <th>Quality</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {supplierData?.length > 0 ?
                                                    supplierData?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-bx">
                                                                        <div className="admin-table-sub-details">
                                                                            <h6>{item?.name}</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {item?.mobileNumber}
                                                            </td>
                                                            <td>{item?.email}</td>
                                                            <td>
                                                                {item?.city}
                                                            </td>
                                                            {/* <td><span className="score-title"> <img src="/score.svg" alt="" /> 774</span></td> */}

                                                            <td>{item?.totalQuantity}</td>
                                                        </tr>) : 'No supplier found'}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <div className="new-mega-card nw-pharmacy-card">
                                <div className="admn-title mb-4">
                                    <div>
                                        <h5 className="text-white">High Demand Medicine</h5>
                                    </div>
                                </div>

                                <div className="table-section pharmacy-nw-table">
                                    <div className="table table-responsive  mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Medicine Name</th>
                                                    <th>Total Quantity</th>
                                                    <th>Total Sell</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventory?.length > 0 ?
                                                    inventory?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-bx">
                                                                        <div className="admin-table-sub-details">
                                                                            <h6>{item?.medicineName?.length > 25 ? item?.medicineName?.slice(0, 25) + '...' : item?.medicineName}</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{item?.quantity}</td>
                                                            <td><span className="score-title"> <img src="/score.svg" alt="" /> {item?.sellCount}</span></td>
                                                        </tr>) : 'No Data found'}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="new-mega-card">
                                <div className="admn-title mb-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <h5 className="text-grad mb-0">Margin Analysis</h5>
                                    </div>
                                    <div>
                                        <NavLink to="/inventory" className="thm-btn rounded-3">View All </NavLink>
                                    </div>
                                </div>
                                <div className="table-section ">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Medicine Name</th>
                                                    <th>Purchase Price</th>
                                                    <th>Sale Price</th>
                                                    <th>Margin</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {marginData?.length > 0 ?
                                                    marginData?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{item?.medicineName}</td>

                                                            <td>{item?.purchasePrice}</td>
                                                            <td>{item?.salePrice}</td>

                                                            <td >{item?.margin}%</td>
                                                        </tr>) : 'No data is available to show'}

                                            </tbody>
                                        </table>
                                    </div>



                                </div>

                            </div>
                        </div>
                    </div>


                </div>}
        </>
    )
}

export default PharHome