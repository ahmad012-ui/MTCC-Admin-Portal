import { useParams, useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { FaArrowLeft, FaFilePdf, FaCode, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaMinusCircle } from "react-icons/fa"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import { transactionData } from "../data/transactions"

// TRANSACTION DATA
// export const transactionData = [
//   { id: "1",  template: "Business Diagnostic v1",       contact: "Sinead Waters",      email: "watersinead2@gmail.com",  status: "completed", invited: "5/7/2026",   expires: "6/6/2026",   ttl: 30 },
//   { id: "2",  template: "ISO 9001 Diagnostic (MASTER)", contact: "Sinead Waters",      email: "watersinead2@gmail.com",  status: "invited",   invited: "5/7/2026",   expires: "6/6/2026",   ttl: 30 },
//   { id: "3",  template: "Business Diagnostic v1",       contact: "Jessica Harrington", email: "jessica@mtcc.uk",         status: "invited",   invited: "4/27/2026",  expires: "5/27/2026",  ttl: 30 },
//   { id: "4",  template: "ISO 9001 Diagnostic (MASTER)", contact: "Jessica Harrington", email: "jessica@mtcc.uk",         status: "invited",   invited: "4/27/2026",  expires: "5/27/2026",  ttl: 30 },
//   { id: "5",  template: "ISO 9001 Diagnostic (MASTER)", contact: "Jessica Harrington", email: "jessica@mtcc.uk",         status: "completed", invited: "4/27/2026",  expires: "5/27/2026",  ttl: 30 },
//   { id: "6",  template: "ISO 9001 Diagnostic (MASTER)", contact: "andy brown",         email: "andy@great-circle.co.uk", status: "completed", invited: "4/14/2026",  expires: "5/14/2026",  ttl: 30 },
//   { id: "7",  template: "Business Diagnostic v1",       contact: "Harri Lloyd-Davies", email: "hld@bevanbuckland.co.uk", status: "invited",   invited: "3/10/2026",  expires: "4/9/2026",   ttl: 30 },
//   { id: "8",  template: "Business Diagnostic v1",       contact: "Kevin Bygate",       email: "kevinbygate@sky.com",     status: "completed", invited: "2/18/2026",  expires: "3/20/2026",  ttl: 30 },
//   { id: "9",  template: "Business Diagnostic v1",       contact: "Jessica Harrington", email: "jessica@mtcc.uk",         status: "completed", invited: "1/12/2026",  expires: "2/11/2026",  ttl: 30 },
//   { id: "10", template: "Business Diagnostic v1",       contact: "Jessica Harrington", email: "jessica@mtcc.uk",         status: "invited",   invited: "1/9/2026",   expires: "2/8/2026",   ttl: 30 },
//   { id: "11", template: "Business Diagnostic v1",       contact: "Jessica Harrington", email: "jessica@mtcc.uk",         status: "completed", invited: "11/12/2025", expires: "12/12/2025", ttl: 30 },
//   { id: "12", template: "ISO 9001 Diagnostic (MASTER)", contact: "Joel Test",          email: "joel@parfitt@zpee.app",   status: "invited",   invited: "10/19/2025", expires: "11/18/2025", ttl: 30 },
// ]

// RADAR CHART DATA
const radarData = [
  { domain: "Context",              score: 3.8 },
  { domain: "Leadership",           score: 4.2 },
  { domain: "Planning",             score: 3.2 },
  { domain: "Support",              score: 3.9 },
  { domain: "Operation",            score: 3.5 },
  { domain: "Performance Eval",     score: 4.0 },
  { domain: "Improvement",          score: 4.5 },
]

// STRENGTHS & RISKS DATA
const topStrengths = [
  { label: "10.3", level: 5.0 },
  { label: "7.4",  level: 5.0 },
  { label: "4.3",  level: 5.0 },
]

const keyRisks = [
  { label: "7.2", level: 1.5 },
  { label: "4.4", level: 2.0 },
  { label: "6.3", level: 2.0 },
]

// CLAUSE RESPONSES DATA─
const clauses = [
  {
    number: "4.1", section: "Context",
    title: "Understanding the Organization & Its Context",
    questions: [
      { text: "Has the organisation identified key internal factors relevant to its purpose?",            status: "NEUTRAL"          },
      { text: "Has the organisation identified key external factors relevant to its purpose?",            status: "DISAGREE"         },
      { text: "Are these internal and external issues monitored and reviewed regularly?",                 status: "STRONGLY AGREE"   },
    ]
  },
  {
    number: "4.2", section: "Context",
    title: "Understanding Needs & Expectations of Interested Parties",
    questions: [
      { text: "Has the organisation identified all relevant interested parties?",                         status: "NEUTRAL"          },
      { text: "Are the requirements of these interested parties documented and reviewed?",                status: "DISAGREE"         },
    ]
  },
  {
    number: "5.1", section: "Leadership",
    title: "Leadership & Commitment",
    questions: [
      { text: "Is the quality policy and strategic direction aligned with the organisation's context?",   status: "NEUTRAL"          },
      { text: "Does top management demonstrate active leadership and commitment to the QMS?",             status: "STRONGLY AGREE"   },
    ]
  },
  {
    number: "6.1", section: "Planning",
    title: "Actions to Address Risks & Opportunities",
    questions: [
      { text: "Has the organisation conducted a risk and opportunity assessment linked to the QMS context?", status: "STRONGLY AGREE" },
      { text: "Are actions planned to address significant risks and opportunities?",                      status: "AGREE"            },
      { text: "Are the effectiveness of these actions evaluated?",                                        status: "STRONGLY AGREE"   },
    ]
  },
  {
    number: "7.1", section: "Support",
    title: "Resources – General",
    questions: [
      { text: "Has the organisation determined and provided the resources needed for the QMS?",           status: "STRONGLY AGREE"   },
      { text: "Are sufficient competent people provided for effective QMS operation and control?",        status: "AGREE"            },
    ]
  },
  {
    number: "8.1", section: "Operation",
    title: "Operational Planning & Control",
    questions: [
      { text: "Are operational processes planned, implemented, and controlled to meet requirements?",     status: "STRONGLY AGREE"   },
      { text: "Are planned changes managed and unintended changes reviewed?",                             status: "NEUTRAL"          },
    ]
  },
  {
    number: "9.1", section: "Performance Evaluation",
    title: "Monitoring, Measurement, Analysis & Evaluation",
    questions: [
      { text: "Is customer satisfaction monitored and the data analysed and used for improvement?",       status: "STRONGLY AGREE"   },
      { text: "Is data from monitoring activities analysed to evaluate QMS performance?",                 status: "STRONGLY AGREE"   },
    ]
  },
  {
    number: "10.3", section: "Improvement",
    title: "Continual Improvement",
    questions: [
      { text: "Does the organisation continually improve the suitability and effectiveness of the QMS?",  status: "STRONGLY AGREE"   },
    ]
  },
]

// RESPONSES TABLE DATA 
const responsesTable = [
  { domain: "Performance Evaluation", category: "9.3", subCategory: "Management Review – Inputs" },
  { domain: "Context", category: "4.1", subCategory: "Understanding the Organization" },
  { domain: "Operation", category: "8.1", subCategory: "Operational Planning & Control" },
  { domain: "Operation", category: "8.6", subCategory: "Release of Products & Services" },
  { domain: "Support", category: "7.1", subCategory: "Resources – Monitoring & Measuring" },
  { domain: "Operation", category: "8.3", subCategory: "Design & Development – General" },
  { domain: "Leadership",category: "5.1", subCategory: "Leadership & Commitment" },
  { domain: "Planning", category: "6.3", subCategory: "Planning of Changes" },
]

// STATUS BADGE HELPER ?
function getStatusStyles(status) {
  switch (status) {
    case "STRONGLY AGREE": return { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: <FaCheckCircle className="text-emerald-500 w-3 h-3" /> }
    case "AGREE": return { bg: "bg-teal-50 text-teal-700 border-teal-100", icon: <FaCheckCircle className="text-teal-400 w-3 h-3" /> }
    case "NEUTRAL": return { bg: "bg-slate-100 text-slate-600 border-slate-200", icon: <FaMinusCircle className="text-slate-400 w-3 h-3" /> }
    case "DISAGREE": return { bg: "bg-amber-50 text-amber-700 border-amber-100", icon: <FaExclamationTriangle className="text-amber-500 w-3 h-3" /> }
    case "STRONGLY DISAGREE": return { bg: "bg-red-50 text-red-700 border-red-100", icon: <FaTimesCircle className="text-red-500 w-3 h-3" /> }
    default: return { bg: "bg-gray-50 text-gray-600 border-gray-100", icon: null }
  }
}

// SCORE BAR COMPONENT 
function ScoreBar({ label, level, max = 5, color = "bg-teal-500" }) {
  const pct = (level / max) * 100
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs font-semibold text-slate-700 w-8">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-12 text-right">Lvl {level}</span>
    </div>
  )
}

// MAIN REPORTS COMPONENT
export default function Reports() {
  const { id }   = useParams()
  const navigate = useNavigate()

  if (!id) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-400">
          Select a completed transaction to view its report.
        </p>
      </div>
    )
  }

  const record = useMemo(() =>
    transactionData.find(item => item.id === id)
  , [id])

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-sans">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Report Not Found</p>
        <h2 className="text-xl font-bold text-slate-800 mt-1">No record matches ID: {id}</h2>
        <button onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 transition-colors">
          Go Back
        </button>
      </div>
    )
  }

  const sections = [...new Set(clauses.map(c => c.section))]

  return (
    <div className="w-full font-sans flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-500 hover:bg-slate-50 transition-all mt-1">
            <FaArrowLeft className="text-xs" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{record.template}</h1>
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 uppercase tracking-wide">
                ISO 9001
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-xs text-slate-500">
              <div><span className="text-slate-400 uppercase tracking-wider text-[10px] block">Company</span><span className="font-semibold text-slate-700">Test</span></div>
              <div><span className="text-slate-400 uppercase tracking-wider text-[10px] block">Respondent</span><span className="font-semibold text-slate-700">{record.contact}</span><span className="block text-slate-400">Executive</span></div>
              <div><span className="text-slate-400 uppercase tracking-wider text-[10px] block">Completed</span><span className="font-semibold text-slate-700">{record.invited}</span></div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <FaFilePdf className="text-slate-400" /> Print / Save PDF
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl shadow-sm hover:bg-teal-700 transition-colors">
            <FaCode /> Export JSON (LLM)
          </button>
        </div>
      </div>

      {/* RADAR CHART */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 9, fill: "#94a3b8" }} tickCount={6} />
            <Radar name="Score" dataKey="score" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} strokeWidth={2} dot={{ r: 3, fill: "#14b8a6" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* OVERALL SCORE */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Overall average (1–5)</p>
        <p className="text-4xl font-bold text-slate-900 mb-4">Level 3.8</p>

        {/* Scale bar */}
        <div className="relative mb-2">
          <div className="w-full h-2 rounded-full bg-gradient-to-r from-red-300 via-amber-300 via-slate-200 via-teal-300 to-emerald-400" />
          <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${(3.8 / 5) * 100}%` }}>
            <div className="w-3 h-3 rounded-full bg-teal-600 border-2 border-white shadow-md -translate-x-1/2" />
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-6">
          <span>Strongly Disagree</span><span>Disagree</span><span>Neutral</span><span>Agree</span><span>Strongly Agree</span>
        </div>

        {/* Answer scale context */}
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-700 mb-3">Answer scale context</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { num: 1, label: "Strongly Disagree", desc: "Respondent strongly disagrees with the statement." },
              { num: 2, label: "Disagree", desc: "Respondent disagrees with the statement." },
              { num: 3, label: "Neutral", desc: "Respondent neither agrees nor disagrees." },
              { num: 4, label: "Agree", desc: "Respondent agrees with the statement." },
              { num: 5, label: "Strongly Agree", desc: "Respondent strongly agrees with the statement." },
            ].map(item => (
              <div key={item.num} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{item.num}</span>
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top strengths + Key risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-bold text-slate-700 mb-3">Top strengths</p>
            {topStrengths.map((s, i) => <ScoreBar key={i} label={s.label} level={s.level} color="bg-teal-500" />)}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 mb-3">Key risks</p>
            {keyRisks.map((r, i) => <ScoreBar key={i} label={r.label} level={r.level} color="bg-red-400" />)}
          </div>
        </div>
      </div>

      {/* ── DETAILED RESPONSES ── */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Detailed Responses</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {sections.map(section => (
            <div key={section}>
              {/* Section header */}
              <div className="px-6 py-2 bg-teal-50/60 border-b border-teal-100/60">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">{section}</span>
              </div>

              {/* Clauses in this section */}
              {clauses.filter(c => c.section === section).map((clause, ci) => (
                <div key={ci} className="p-6 hover:bg-slate-50/20 transition-colors">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{clause.number}</span>
                    <h3 className="text-sm font-bold text-slate-800">{clause.title}</h3>
                  </div>
                  <div className="space-y-3 sm:pl-8">
                    {clause.questions.map((q, qi) => {
                      const style = getStatusStyles(q.status)
                      return (
                        <div key={qi} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
                          <p className="text-xs font-medium text-slate-600 leading-relaxed">{q.text}</p>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold tracking-wide uppercase whitespace-nowrap self-start sm:self-center ${style.bg}`}>
                            {style.icon}
                            <span>{q.status}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── RESPONSES TABLE ── */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Responses (Table)</h2>
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Domain</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Sub-Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {responsesTable.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-6 py-3 text-teal-700 font-semibold">{row.domain}</td>
                  <td className="px-6 py-3 text-slate-500">{row.category}</td>
                  <td className="px-6 py-3 text-teal-600">{row.subCategory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}