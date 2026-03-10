import React, { useState, useEffect } from "react";
import { Trash2, UserPlus, Shield, Briefcase, CheckCircle2, XCircle } from "lucide-react";
import { Staff, StaffRole, StaffJob } from "../types";
import { staffService } from "../services/staffService";
import ConfirmationModal from "./ConfirmationModal";

export default function AdminPanel() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");
  const [job, setJob] = useState<StaffJob>("DESIGNER");
  const [isActive, setIsActive] = useState(true);

  // Confirmation state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = staffService.subscribeToStaff((data) => {
      setStaffList(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await staffService.createStaff({
        email,
        name,
        role,
        job,
        active: isActive
      });
      // Reset form
      setEmail("");
      setName("");
      setPassword("");
      setRole("staff");
      setJob("DESIGNER");
      setIsActive(true);
    } catch (error) {
      console.error("Error creating staff:", error);
    }
  };

  const handleUpdateRole = async (id: string, newRole: StaffRole) => {
    await staffService.updateStaff(id, { role: newRole });
  };

  const handleUpdateJob = async (id: string, newJob: StaffJob) => {
    await staffService.updateStaff(id, { job: newJob });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await staffService.updateStaff(id, { active: !currentStatus });
  };

  const handleRemoveStaff = (id: string) => {
    setStaffToRemove(id);
    setIsConfirmOpen(true);
  };

  const confirmRemoveStaff = async () => {
    if (!staffToRemove) return;
    try {
      await staffService.deleteStaff(staffToRemove);
      setStaffToRemove(null);
    } catch (error) {
      console.error("Error removing staff:", error);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-mono">Shop ID: shop_udx95p30mk5etzci</p>
              <p className="text-[10px] text-slate-400 font-mono">Your role: <span className="text-indigo-600 font-bold">subadmin</span></p>
            </div>
          </div>
          <p className="text-sm text-slate-500">Create staff accounts and assign roles/jobs.</p>
        </header>

        {/* Create / Update Staff Section */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserPlus size={16} className="text-indigo-600" />
              Create / Update Staff
            </h2>
          </div>
          <form onSubmit={handleCreateStaff} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              <div className="lg:col-span-1">
                <input
                  type="email"
                  placeholder="staff@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="lg:col-span-1">
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="lg:col-span-1">
                <input
                  type="password"
                  placeholder="Temp password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="lg:col-span-1">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="staff">staff</option>
                  <option value="subadmin">subadmin</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="lg:col-span-1">
                <select
                  value={job}
                  onChange={(e) => setJob(e.target.value as StaffJob)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="DESIGNER">DESIGNER</option>
                  <option value="SUBADMIN">SUBADMIN</option>
                  <option value="PACKING">PACKING</option>
                  <option value="PRINTER">PRINTER</option>
                  <option value="SEWER">SEWER</option>
                  <option value="CUTTER">CUTTER</option>
                </select>
              </div>
              <div className="lg:col-span-1">
                <button
                  type="submit"
                  className="w-full px-6 py-2.5 bg-slate-400 hover:bg-slate-500 text-white font-bold rounded-xl transition-all active:scale-95 text-sm"
                >
                  Create / Update
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Active</span>
              </label>
            </div>
          </form>
        </section>

        {/* Staff Table Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Active</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                      Loading staff accounts...
                    </td>
                  </tr>
                ) : staffList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                      No staff accounts found.
                    </td>
                  </tr>
                ) : (
                  staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{staff.email}</span>
                          <span className="text-[10px] text-slate-400">{staff.name || staff.email.split('@')[0]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={staff.role}
                          onChange={(e) => handleUpdateRole(staff.id, e.target.value as StaffRole)}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer min-w-[120px]"
                        >
                          <option value="staff">staff</option>
                          <option value="subadmin">subadmin</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={staff.job}
                          onChange={(e) => handleUpdateJob(staff.id, e.target.value as StaffJob)}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer min-w-[120px]"
                        >
                          <option value="DESIGNER">DESIGNER</option>
                          <option value="SUBADMIN">SUBADMIN</option>
                          <option value="PACKING">PACKING</option>
                          <option value="PRINTER">PRINTER</option>
                          <option value="SEWER">SEWER</option>
                          <option value="CUTTER">CUTTER</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(staff.id, staff.active)}
                          className="inline-flex items-center justify-center transition-transform active:scale-90"
                        >
                          {staff.active ? (
                            <CheckCircle2 size={20} className="text-indigo-600" />
                          ) : (
                            <div className="w-5 h-5 rounded border-2 border-slate-300" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRemoveStaff(staff.id)}
                          className="px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all active:scale-95"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRemoveStaff}
        title="Remove Staff Member"
        message="Are you sure you want to remove this staff member? This action will permanently delete their account access."
        confirmText="Remove Staff"
      />
    </div>
  );
}
