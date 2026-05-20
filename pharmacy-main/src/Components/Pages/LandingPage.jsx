import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  ScanLine,
  Package,
  ClipboardCheck,
  ReceiptIndianRupee,
  FileCheck2,
  Truck,
  CalendarClock,
  UserCog,
  Wallet,
  LockKeyhole,
  Building2,
  CheckCircle2,
  MessageSquareLock,
  BarChart3,
} from "lucide-react";
import { FaChartBar } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";



// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import "../../assets/css/landing.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { getApiData } from "../../Services/api";
import base_url from "../../baseUrl";


export default function NeoHealthPharmaLanding() {
  const modules = useMemo(
    () => [
      {
        icon: <ScanLine className="h-5 w-5" />,
        title: "Scan-to-Verify Dispensing",
        desc: "QR/DataMatrix scan at counter to validate batch, expiry, and dispensing eligibility.",
      },
      {
        icon: <ClipboardCheck className="h-5 w-5" />,
        title: "Doctor → Pharmacy e‑Prescription Sync",
        desc: "Verified prescriptions arrive from NeoHealthCard Doctor module with audit trails.",
      },
      {
        icon: <Wallet className="h-5 w-5" />,
        title: "Billing → Patient NeoHealthCard Wallet",
        desc: "GST invoice + receipt generated and delivered to patient wallet (lifetime pharmacy history).",
      },
      {
        icon: <Package className="h-5 w-5" />,
        title: "Batch & Expiry Inventory (FEFO)",
        desc: "Batch ledger, FEFO pick, expiry alerts, near-expiry handling, recall readiness.",
      },
      {
        icon: <Truck className="h-5 w-5" />,
        title: "Procurement (PO → GRN → Stock Ledger)",
        desc: "Purchase orders, GRN, supplier tracking, price history, reorder automation.",
      },
      {
        icon: <CalendarClock className="h-5 w-5" />,
        title: "Scheduled Medicines & Refill Reminders",
        desc: "Create refill schedules, reminders, and follow-up workflows (permissioned).",
      },
      {
        icon: <UserCog className="h-5 w-5" />,
        title: "Multi‑Employee Access (Role‑Based)",
        desc: "Owner/Admin, Pharmacist, Cashier, Inventory, Auditor. Granular permissions + approvals.",
      },
      {
        icon: <FileCheck2 className="h-5 w-5" />,
        title: "Compliance & Audit Logs",
        desc: "Immutable logs for dispensing, overrides, returns, edits, controlled medicine actions.",
      },
      {
        icon: <MessageSquareLock className="h-5 w-5" />,
        title: "Secure Communication",
        desc: "Encrypted clarification with clinic/patient where required; actions logged.",
      },
    ],
    []
  );

  const workflow = useMemo(
    () => [
      {
        n: "01",
        title: "Receive Prescription",
        desc: "Receive from Doctor module or add manually with patient NeoHealthCard ID.",
      },
      {
        n: "02",
        title: "Scan & Validate",
        desc: "Scan pack → verify batch/expiry + policy checks (controlled/high‑risk rules).",
      },
      {
        n: "03",
        title: "Dispense & Invoice",
        desc: "Dispense logged; GST invoice/receipt generated and delivered to patient wallet.",
      },
      {
        n: "04",
        title: "Schedule & Refill",
        desc: "Create refill schedule; send reminders; track follow‑ups (permissioned).",
      },
    ],
    []
  );

  const roles = useMemo(
    () => [
      {
        role: "Owner / Admin",
        perms: [
          "All permissions",
          "User/role management",
          "Pricing & supplier policy",
          "Approvals & overrides",
        ],
      },
      {
        role: "Pharmacist",
        perms: [
          "Dispense (scan-to-verify)",
          "Substitution guidance (policy)",
          "Controlled medicine workflow (as allowed)",
          "Secure clarifications",
        ],
      },
      {
        role: "Cashier",
        perms: ["Billing & payments", "Invoice/receipt issue", "Returns (as allowed)", "Day-end summary"],
      },
      {
        role: "Inventory",
        perms: ["Stock inward/outward", "Expiry checks", "PO/GRN", "Reorder suggestions"],
      },
      {
        role: "Auditor",
        perms: ["Read-only logs", "Compliance reports", "Export audit trails"],
      },
      {
        role: "Auditor",
        perms: ["Read-only logs", "Compliance reports", "Export audit trails"],
      },
    ],
    []
  );

  const security = useMemo(
    () => [
      {
        icon: <LockKeyhole className="h-5 w-5" />,
        title: "Zero‑Trust Access",
        desc: "Least privilege, policy gates, approval flows for sensitive actions.",
      },
      {
        icon: <ShieldCheck className="h-5 w-5" />,
        title: "Encryption",
        desc: "Encrypted in transit and at rest (implementation dependent).",
      },
      {
        icon: <FileCheck2 className="h-5 w-5" />,
        title: "Auditability",
        desc: "Full traceability of actions with immutable logs.",
      },
    ],
    []
  );



  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      AOS.refreshHard();
    }, 100);
  }, [roles]);


  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };



  useEffect(() => {
    const onScroll = () => {
      document
        .querySelector(".navbar")
        ?.classList.toggle("fixed", window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [firstSection, setFirstSection] = useState()
  const [secondSection, setSecondSection] = useState()
  const [thirdSection, setThirdSection] = useState()
  const [fourthSection, setFourthSection] = useState()
  const [fivethSection, setFivethSection] = useState()
  const fetchData = async () => {
    try {
      const res = await getApiData("api/admin/landing/pharmacy");
      if(res.success){
        setFirstSection(res?.data?.firstSection);
        setSecondSection(res?.data?.secondSection)
        setThirdSection(res?.data?.thirdSection)
        setFourthSection(res?.data?.fourthSection)
        setFivethSection(res?.data?.fivethSection)
      }


    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="neo-page-wrapper">

      {/* <section className="px-6 pt-16 pb-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
              NeoHealthCard <span className="text-blue-600">Pharma</span>
            </h1>
            <p className="mt-5 text-gray-600 leading-relaxed max-w-xl">
              Pharmacy operations inside NeoHealthCard: verified dispensing, PO/GRN procurement, batch/expiry inventory,
              scheduled refills, multi-employee access, compliance-grade audit trails, and patient wallet billing.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-7 py-6">
                Start onboarding
              </Button>
              <Button variant="outline" className="rounded-xl border-gray-300 px-7 py-6">
                Download overview
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
              <MiniStat icon={<Wallet className="h-4 w-4" />} label="Patient bill" value="Auto delivered" />
              <MiniStat icon={<Truck className="h-4 w-4" />} label="Procurement" value="PO → GRN" />
              <MiniStat icon={<CalendarClock className="h-4 w-4" />} label="Scheduling" value="Refill plans" />
              <MiniStat icon={<FileCheck2 className="h-4 w-4" />} label="Audit" value="Immutable logs" />
            </div>
          </div>

     
          <Card className="rounded-[28px] border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Ops snapshot</div>
                  <div className="text-xl font-semibold">Today</div>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-700">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <KpiRow label="Prescriptions" value="12" hint="Queue" />
                <KpiRow label="Dispensed" value="32" hint="Logged" />
                <KpiRow label="Bills delivered" value="32" hint="Patient wallet" />
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Invoice delivery</div>
                  <span className="text-xs text-gray-500">GST</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  After dispensing, invoice/receipt is delivered to the patient’s NeoHealthCard wallet.
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-gray-700 border border-gray-200">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  Delivered
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section> */}

      <section className="neo-hero-section">
        <div className="container">
          <div className="row align-items-center">

            {/* Left Content */}
            <div className="col-lg-6">
              <h1 className="neo-hero-title heading-grad" data-aos="fade-up" data-aos-delay="50" >
                {firstSection?.firstTitle || 'NeoHealthCard'} <span className="neo-pharma d-lg-block d-sm-inline">{firstSection?.secondTitle || 'Pharma'}</span>
              </h1>

              <p className="neo-hero-desc" data-aos="fade-up">
                {firstSection?.description || `Pharmacy operations inside NeoHealthCard: verified dispensing,
                PO/GRN procurement, batch/expiry inventory, scheduled refills,
                multi-employee access, compliance-grade audit trails, and
                patient wallet billing.`}
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 mt-4 mb-4 ">
                <a href={firstSection?.btnLink?.btnFirst} target="_blank" className="ph-thm-btn">
                  Start onboarding
                </a>

                <a href={firstSection?.btnLink?.btnSecond} target="_blank" className="ph-thm-btn outline">
                  Download overview
                </a>
              </div>

              {/* Stats */}
              <div className="row mt-3 neo-mini-stats">
                {firstSection?.model?.map((item, key) =>
                  <div className="col-lg-6 mb-3" data-aos="fade-up" data-aos-delay="50" key={key} >
                    <div className="neo-mini-box">

                      <div className="neo-mini-label">
                        <span className="ph-icon-box">
                          <img src={`${base_url}/${item?.image}`} alt="" style={{maxWidth:24,maxHeight:24}}/> </span>
                        {item?.name}</div>
                      <div className="neo-mini-value">{item?.description}</div>
                    </div>
                  </div>)}

             
              </div>
            </div>

            {/* Right Card */}
            <div className="col-lg-6">
              <div className="neo-preview-card" data-aos="fade-up" data-aos-delay="50">

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="neo-small-text">Ops snapshot</div>
                    <div className="neo-card-title">Today</div>
                  </div>

                  <div >
                    <span className="ph-icon-box"><FaChartBar className="fz-18" />
                    </span>
                  </div>
                </div>

                <div className="neo-kpi-list mt-2">
                  <div className="neo-kpi-row">
                    <div>
                      <h5 className="neo-kp-title" >Prescriptions</h5>
                      <h6>Queue</h6>
                    </div>
                    <h4 className="neo-kp-title" >{firstSection?.opsSnapshot?.prescriptions || 12}</h4>
                  </div>

                  <div className="neo-kpi-row">
                    <div>
                      <h5 className="neo-kp-title" >Dispensed</h5>
                      <h6>Logged</h6>
                    </div>

                    <h4>{firstSection?.opsSnapshot?.dispensed || 12}</h4>
                  </div>

                  <div className="neo-kpi-row">
                    <div>
                      <h5 className="neo-kp-title" >Bills delivered</h5>
                      <h6>Patient wallet</h6>
                    </div>

                    <h4>{firstSection?.opsSnapshot?.billDelivery || 12}</h4>
                  </div>
                </div>

                <div className="neo-invoice-box">
                  <div className="d-flex justify-content-between invoice-content">
                    <div className="">
                      <h6>Invoice delivery</h6>
                    </div>
                    <h5 className="">{firstSection?.opsSnapshot?.invoiceDelivery || 'GST'}</h5>
                  </div>

                  <p className="neo-invoice-text">
                    After dispensing, invoice/receipt is delivered to the
                    patient’s NeoHealthCard wallet.
                  </p>

                  <div className="ph-neo-badge">
                    <h6> <FaCheck />  Delivered</h6>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
      {/* <section id="modules" className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold">Core modules</h2>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Keep implementation focused. These are the required capabilities for NeoHealthCard Pharma.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {modules.map((m) => (
              <Card key={m.title} className="rounded-2xl border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-3">{m.icon}</div>
                  <div className="font-semibold">{m.title}</div>
                  <div className="mt-2 text-sm text-gray-600 leading-relaxed">{m.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      <section id="modules" className="neo-modules-section">
        <div className="container">

          <h2 className="neo-modules-title">{secondSection?.title || 'Core modules'}</h2>
          <p className="neo-modules-desc">
           {secondSection?.description ||` Keep implementation focused. These are the required capabilities for NeoHealthCard Pharma.`}
          </p>

          <div className="row">
            {/* {modules.map((m, index) => (
              <div className="col-lg-4 col-md-6 mb-3" key={index} >
                <div className="neo-module-card" >

                  <div className="neo-module-icon">
                    <span className="ph-icon-box">{m.icon}</span>
                  </div>

                  <div className="neo-module-title">
                    <h5>{m.title}</h5>
                  </div>

                  <div className="neo-module-desc">
                    <p> {m.desc}</p>
                  </div>

                </div>
              </div>
            ))} */}
             {secondSection?.model?.map((m, index) => (
              <div className="col-lg-4 col-md-6 mb-3" key={index} >
                <div className="neo-module-card" >

                  <div className="neo-module-icon">
                    <span className="ph-icon-box">
                      <img src={`${base_url}/${m?.image}`} alt="" srcset="" />
                    </span>
                  </div>

                  <div className="neo-module-title">
                    <h5>{m?.name}</h5>
                  </div>

                  <div className="neo-module-desc">
                    <p> {m?.description}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* <section id="workflow" className="py-14 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold">Workflow</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {workflow.map((w) => (
              <Card key={w.n} className="rounded-2xl border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-blue-600 font-semibold">{w.n}</div>
                  <div className="mt-2 font-semibold">{w.title}</div>
                  <div className="mt-1 text-sm text-gray-600 leading-relaxed">{w.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      <section id="workflow" className="neo-workflow-section">
        <div className="container">

          <h2 className="neo-workflow-title">{thirdSection?.title || 'Workflow'}</h2>

          <div className="row mt-2">
            {thirdSection?.model?.map((w, index) => (
              <div className="col-md-6 mb-3 " key={index}>
                <div className="neo-workflow-card ">

                  <div className="neo-workflow-step">
                    <span className="standardize-title">{w.number}</span>
                  </div>

                  <div className="neo-workflow-heading">
                    <h4>{w?.name}</h4>
                  </div>

                  <div className="neo-workflow-desc">
                    <p>{w?.description}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* <section id="roles" className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold">Roles & access</h2>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Multiple employees access the same pharmacy account based on role rules. Sensitive actions require approvals.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {roles.map((r) => (
              <Card key={r.role} className="rounded-2xl border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="font-semibold">{r.role}</div>
                  <div className="mt-3 space-y-2">
                    {r.perms.map((p) => (
                      <div key={p} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                        <span className="leading-relaxed">{p}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      <section id="roles" className="neo-roles-section">
        <div className="container">
          <h2 className="neo-roles-title">{fourthSection?.title ||'Roles & access'}</h2>
          <p className="neo-roles-desc">
            {fourthSection?.description || `Multiple employees access the same pharmacy account based on role rules.
            Sensitive actions require approvals.`}
          </p>

          <div className="row mt-2">
            {fourthSection?.model?.map((r, index) => (
              <div className="col-md-6 mb-3" key={index}  >
                <div className="neo-role-card" >

                  <div className="neo-role-title">
                    <h5> {r?.name}</h5>
                  </div>

                  <div className="neo-role-perms">
                    {r.description?.split(',').map((p, i) => (
                      <div className="neo-perm-item" key={i}>
                        <span className="neo-dot"></span>
                        <h4>{p}</h4>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* <section id="security" className="py-14 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold">Security</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {security.map((s) => (
              <Card key={s.title} className="rounded-2xl border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-3">{s.icon}</div>
                  <div className="font-semibold">{s.title}</div>
                  <div className="mt-1 text-sm text-gray-600 leading-relaxed">{s.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="font-semibold">NeoAI usage rule</div>
            <div className="mt-2 text-sm text-gray-600 leading-relaxed">
              NeoAI provides operational assistance and safety prompts. It does not replace clinical judgement.
              Pharmacist and clinician oversight remains required.
            </div>
          </div>
        </div>
      </section> */}

      <section id="security" className="neo-security-section">
        <div className="container">

          <h2 className="neo-security-title">{fivethSection?.title  || 'Security'}</h2>

          <div className="row mt-4">
            {fivethSection?.model?.map((s, index) => (
              <div className="col-md-4 mt-0 mb-3" key={index}>
                <div className="neo-security-card">

                  <div className="neo-security-icon">
                    <span className="ph-icon-box">
                      <img src={`${base_url}/${s?.image}`} alt="" />
                    </span>
                  </div>

                  <div className="neo-security-heading">
                    <h4>{s.name}</h4>
                  </div>

                  <div className="neo-security-desc">
                    <p> {s.description}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* NeoAI Rule Box */}
          <div className="neo-ai-box mt-4">
            <div className="neo-ai-title">
              <h5>NeoAI usage rule</h5>
            </div>

            <div className="neo-ai-desc">
              <p> {fivethSection?.usageRule ||`NeoAI provides operational assistance and safety prompts. It does not replace clinical judgement.
                Pharmacist and clinician oversight remains required.`}</p>
            </div>
          </div>

        </div>
      </section>


      {/* <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid gap-8 md:grid-cols-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900">NeoHealthCard Pharma</div>
              <div className="mt-2 text-gray-600">
                Billing to patient wallet • PO/GRN • Inventory FEFO • Scheduling • Roles • Audit
              </div>
            </div>
            <div className="text-gray-600 space-y-2">
              <div className="font-semibold text-gray-900">Product</div>
              <a className="block hover:text-black" href="#modules">Modules</a>
              <a className="block hover:text-black" href="#workflow">Workflow</a>
              <a className="block hover:text-black" href="#roles">Roles</a>
            </div>
            <div className="text-gray-600 space-y-2">
              <div className="font-semibold text-gray-900">Security</div>
              <a className="block hover:text-black" href="#security">Security overview</a>
              <a className="block hover:text-black" href="#">Audit logs</a>
              <a className="block hover:text-black" href="#">Access control</a>
            </div>
            <div className="text-gray-600 space-y-2">
              <div className="font-semibold text-gray-900">Legal</div>
              <a className="block hover:text-black" href="#">Privacy Policy</a>
              <a className="block hover:text-black" href="#">Terms of Service</a>
              <a className="block hover:text-black" href="#">Medical Disclaimer</a>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-t border-gray-200 pt-6">
            <div className="text-xs text-gray-500">© {new Date().getFullYear()} NeoHealthCard Private Limited</div>
            <div className="text-xs text-gray-500 inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Bills delivered to patient NeoHealthCard wallet after dispensing.
            </div>
          </div>
        </div>
      </footer> */}



    </div>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="text-blue-600">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function KpiRow({ label, value, hint }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
      <div>
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{hint}</div>
      </div>
      <div className="text-lg font-semibold text-blue-600">{value}</div>
    </div>
  );
}
