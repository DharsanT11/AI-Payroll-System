import { useState, useEffect } from 'react';
import { employeeService } from '../../../services/api';
import { formatCurrency, getInitials, getAvatarColor, getBadgeClass, formatDate } from '../../../utils/helpers';
import { Plus, Search, X } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    department: 'Engineering', designation: '', dateOfJoining: '',
    dateOfBirth: '', gender: 'Male', employeeType: 'Full Time',
    salary: { ctc: '', basic: '', hra: '' },
  });

  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations', 'Support'];

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = () => {
    setLoading(true);
    employeeService.getAll()
      .then(res => setEmployees(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const salaryData = {
      ctc: Number(formData.salary.ctc),
      basic: Number(formData.salary.ctc) * 0.5,
      hra: Number(formData.salary.ctc) * 0.2,
      special: Number(formData.salary.ctc) * 0.15,
      conveyance: 19200,
      medical: 15000,
    };
    await employeeService.create({ ...formData, salary: salaryData });
    setShowModal(false);
    setFormData({
      firstName: '', lastName: '', email: '', phone: '',
      department: 'Engineering', designation: '', dateOfJoining: '',
      dateOfBirth: '', gender: 'Male', employeeType: 'Full Time',
      salary: { ctc: '', basic: '', hra: '' },
    });
    fetchEmployees();
  };

  const filtered = employees.filter(e => {
    const matchSearch = !searchQuery || `${e.firstName} ${e.lastName} ${e.email} ${e.id}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = !filterDept || e.department === filterDept;
    return matchSearch && matchDept;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{employees.length} total employees</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="topbar-search" style={{ width: 280, background: 'white', border: '1px solid var(--color-border)' }}>
          <Search size={14} />
          <input placeholder="Search by name, email, ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joined</th>
                <th>CTC</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="employee-name">
                      <div className="employee-avatar" style={{ background: getAvatarColor(`${emp.firstName} ${emp.lastName}`) }}>
                        {getInitials(`${emp.firstName} ${emp.lastName}`)}
                      </div>
                      <div>
                        <strong>{emp.firstName} {emp.lastName}</strong>
                        <small>{emp.email}</small>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{emp.id}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{formatDate(emp.dateOfJoining)}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(emp.salary.ctc)}</td>
                  <td><span className={`badge ${getBadgeClass(emp.status)}`}>{emp.status}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
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
