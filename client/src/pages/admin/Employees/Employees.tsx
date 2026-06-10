import { useState, useEffect } from 'react';
import { employeeService, payRunService } from '../../../services/api';
import { formatCurrency, getInitials, getAvatarColor, formatDate } from '../../../utils/helpers';
import { Plus, Search, X, IdCard, Filter, MoreVertical, TrendingUp } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function Employees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [payrollData, setPayrollData] = useState<any>(null);
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    department: 'Computer Science', designation: '', dateOfJoining: '',
    dateOfBirth: '', gender: 'Male', employeeType: 'Full Time',
    salary: { ctc: '', basic: '', hra: '' },
  });

  const departments = ['Computer Science', 'Mathematics', 'Administration', 'Finance', 'Human Resources', 'Examinations', 'Library', 'Student Affairs'];

  useEffect(() => { 
    fetchEmployees(); 
    fetchPayroll();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    employeeService.getAll()
      .then(res => setEmployees(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  
  const fetchPayroll = () => {
    // Just a quick way to get the total payroll without adding new APIs
    payRunService.getAll().then(res => {
        if(res.data?.data?.length > 0) setPayrollData(res.data.data[0]);
    }).catch(console.error);
  }

  const handleAdd = async (e: any) => {
    e.preventDefault();
    try {
      const salaryData = {
        ctc: Number(formData.salary.ctc),
        basic: Number(formData.salary.ctc) * 0.5,
        hra: Number(formData.salary.ctc) * 0.2,
        special: Number(formData.salary.ctc) * 0.15,
        conveyance: 19200,
        medical: 15000,
      };
      await employeeService.create({ ...formData, salary: salaryData });
      toast.success(`Employee ${formData.firstName} ${formData.lastName} added successfully!`);
      setShowModal(false);
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        department: 'Computer Science', designation: '', dateOfJoining: '',
        dateOfBirth: '', gender: 'Male', employeeType: 'Full Time',
        salary: { ctc: '', basic: '', hra: '' },
      });
      fetchEmployees();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add employee.');
    }
  };

  const filtered = employees.filter(e => {
    const matchSearch = !searchQuery || `${e.firstName} ${e.lastName} ${e.email} ${e.id}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = !filterDept || e.department === filterDept;
    return matchSearch && matchDept;
  });

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="animate-slide-up" style={{ padding: '0', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* Top Header Widgets */}
      <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0' }}>Employees</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2.5fr) minmax(200px, 1fr)', gap: '24px', marginBottom: '32px' }}>
        
        {/* Total Employees Card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Total Employees</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>{employees.length.toLocaleString()}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#3b25e7', fontSize: '12px', fontWeight: '700' }}>
               <TrendingUp size={14} /> +12 this month
            </div>
          </div>
          <div style={{ position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)', opacity: 0.1 }}>
            <IdCard size={120} strokeWidth={1.5} />
          </div>
        </div>

        {/* Active Payroll Card */}
        <div style={{ backgroundColor: '#3b25e7', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(59, 37, 231, 0.15)' }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#e0e7ff', marginBottom: '8px' }}>Active Payroll</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>{payrollData ? formatCurrency(payrollData.totalNetPay).replace(/\.00$/, '') : '₹4,82,500'}</div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#a5b4fc', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
               NEXT RUN: OCT 28
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '12px', padding: '0 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', width: '300px' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              placeholder="Search by name, ID, or email..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              style={{ border: 'none', padding: '14px 16px', width: '100%', outline: 'none', background: 'transparent', fontSize: '14px', color: '#334155' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={filterDept} 
              onChange={e => setFilterDept(e.target.value)}
              style={{ appearance: 'none', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 40px 12px 40px', fontSize: '13px', fontWeight: '600', color: '#334155', cursor: 'pointer', outline: 'none' }}
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <Filter size={14} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>

          {/* Quick Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Computer Science', 'Finance'].map(d => (
              <button 
                key={d}
                onClick={() => setFilterDept(filterDept === d ? '' : d)}
                style={{ backgroundColor: filterDept === d ? '#3b25e7' : '#fff', color: filterDept === d ? '#fff' : '#64748b', border: filterDept === d ? 'none' : '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: '#3b25e7', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(59, 37, 231, 0.2)' }}
        >
          <Plus size={16} strokeWidth={3} /> Add Employee
        </button>
      </div>

      {/* Table Section */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', padding: '16px 32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '16px 8px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>Employee</th>
                <th style={{ padding: '16px 8px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>Employee ID</th>
                <th style={{ padding: '16px 8px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>Department</th>
                <th style={{ padding: '16px 8px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>Designation</th>
                <th style={{ padding: '16px 8px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>CTC</th>
                <th style={{ padding: '16px 8px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>Status</th>
                <th style={{ padding: '16px 8px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: getAvatarColor(`${emp.firstName} ${emp.lastName}`), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.1)' }}>
                        {getInitials(`${emp.firstName} ${emp.lastName}`)}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{emp.firstName} {emp.lastName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>#{emp.id}</td>
                  <td style={{ padding: '16px 8px', fontSize: '13px', color: '#64748b' }}>{emp.department}</td>
                  <td style={{ padding: '16px 8px', fontSize: '13px', color: '#64748b' }}>{emp.designation}</td>
                  <td style={{ padding: '16px 8px', fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>{formatCurrency(emp.salary.ctc).replace(/\.00$/, '')}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: emp.status === 'Active' ? '#3b25e7' : '#94a3b8' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: emp.status === 'Active' ? '#3b25e7' : '#cbd5e1' }}></div>
                      {emp.status || 'Active'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                    <button onClick={() => toast.info(`Actions for ${emp.firstName}: Edit, View Profile, or Delete from the employee detail page.`)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '16px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
          <div>Showing 1 to {filtered.length} of {employees.length} employees</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b25e7', color: '#fff', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>1</span>
            <span style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', color: '#334155', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>2</span>
          </div>
        </div>
      </div>

      {/* Add Employee Modal (Restored structure & state, modernized styling) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button className="topbar-icon-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Department *</label>
                    <select required value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Designation *</label>
                    <input required value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date of Joining *</label>
                    <input type="date" required value={formData.dateOfJoining} onChange={e => setFormData({ ...formData, dateOfJoining: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Annual CTC (₹) *</label>
                    <input type="number" required value={formData.salary.ctc} onChange={e => setFormData({ ...formData, salary: { ...formData.salary, ctc: e.target.value } })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Employment Type</label>
                    <select value={formData.employeeType} onChange={e => setFormData({ ...formData, employeeType: e.target.value })}>
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Contract</option>
                      <option>Intern</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
