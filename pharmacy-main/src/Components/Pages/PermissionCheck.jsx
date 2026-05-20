import { PiTagChevronFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateApiData } from "../../Services/api";
import { toast } from "react-toastify";

function PermissionCheck() {
    const userId = localStorage.getItem("userId");
    const storedPermission = JSON.parse(sessionStorage.getItem("permission")) || {};
    const { id: permissionId, name } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        permissionId,
        ownerId: userId,
        name,
        pharmacy: {
            listView: false,
            addInventory: false,
            editInventory: false,
            viewInventory: false,
            patientList: false,
            details: false,
            chat: false,
        }
    });

    /* ✅ checkbox toggle */
    const handleChange = (key) => {
        setFormData(prev => ({
            ...prev,
            pharmacy: {
                ...prev.pharmacy,
                [key]: !prev.pharmacy[key]
            }
        }));
    };

    /* ✅ load existing permission */
    useEffect(() => {
        if (storedPermission?.permissions) {
            setFormData(prev => ({
                ...prev,
                permissionId,
                ownerId: userId,
                name,
                pharmacy: {
                    ...prev.pharmacy,
                    ...storedPermission.permissions
                }
            }));
        }
    }, []);

    /* ✅ update */
    const updatePharPermission = async (e) => {
        e.preventDefault();
        try {
            const response = await updateApiData("api/comman/permission", formData);
            if (response.success) {
                sessionStorage.removeItem("permission");
                toast.success("Permission updated");
                navigate(-1);
            } else {
                toast.error(response.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const labels = {
        listInventory: "List View",
        addInventory: "Add Inventory",
        editInventory: "Edit Inventory",
        viewInventory: "View Inventory",
        deleteInventory: "Delete Inventory"
    }
    const supplierLabels = {
        listSupplier: "List View",
        addSupplier: "Add Supplier",
        editSupplier: "Edit Supplier",
        viewSupplier: "View Supplier",
        deleteSupplier: "Delete Supplier"
    }
    const returnLabels = {
        listReturn: "List View",
        addReturn: "Add Return",
        editReturn: "Edit Return",
        viewReturn: "View Return",
        deleteReturn: "Delete Return"
    }
    const sellLabels = {
        listSell: "List View",
        addSell: "Add Sell",
    }

    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">

                <div className="new-mega-card">
                    <form onSubmit={updatePharPermission}>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">

                                {/* Inventory */}
                                <div className="permission-check-main-bx my-4">
                                    <h4><PiTagChevronFill /> Inventory Management</h4>
                                    <ul className="permision-check-list">
                                        {[ "addInventory", "editInventory",  ].map(key => (
                                            <li key={key}>
                                                <div className="form-check custom-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={formData.pharmacy[key]}
                                                        onChange={() => handleChange(key)}
                                                    />
                                                    <label className="form-check-label text-capitalize">
                                                        {labels[key]}
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Sell */}
                                <div className="permission-check-main-bx my-4">
                                    <h4><PiTagChevronFill /> Sell Management</h4>
                                    <ul className="permision-check-list">
                                        {[ "addSell",   ].map(key => (
                                            <li key={key}>
                                                <div className="form-check custom-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={formData.pharmacy[key]}
                                                        onChange={() => handleChange(key)}
                                                    />
                                                    <label className="form-check-label text-capitalize">
                                                        {sellLabels[key]}
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Supplier */}
                                <div className="permission-check-main-bx my-4">
                                    <h4><PiTagChevronFill /> Supplier Management</h4>
                                    <ul className="permision-check-list">
                                        {[ "addSupplier", "editSupplier", ].map(key => (
                                            <li key={key}>
                                                <div className="form-check custom-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={formData.pharmacy[key]}
                                                        onChange={() => handleChange(key)}
                                                    />
                                                    <label className="form-check-label text-capitalize">
                                                        {supplierLabels[key]}
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Return Order */}
                                <div className="permission-check-main-bx my-4">
                                    <h4><PiTagChevronFill /> Return Management</h4>
                                    <ul className="permision-check-list">
                                        {[ "addReturn", "editReturn", ].map(key => (
                                            <li key={key}>
                                                <div className="form-check custom-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={formData.pharmacy[key]}
                                                        onChange={() => handleChange(key)}
                                                    />
                                                    <label className="form-check-label text-capitalize">
                                                        {returnLabels[key]}
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>



                                {/* Chat */}
                                <div className="permission-check-main-bx">
                                    <h4><PiTagChevronFill /> Chat Management</h4>
                                    <div className="form-check custom-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={formData.pharmacy.chat}
                                            onChange={() => handleChange("chat")}
                                        />
                                        <label className="form-check-label">Chat</label>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <Link to={-1} className="nw-thm-btn rounded-3 outline" >
                                        Go Back
                                    </Link>
                                    <button className="nw-filtr-thm-btn">Save</button>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PermissionCheck;
