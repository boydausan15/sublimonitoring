import { X, Upload, Save, Trash2, Calendar, User, Phone, Package, Hash, Info, ShoppingCart } from "lucide-react";
import { Project, ProjectStatus, STAGES } from "../types";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<Project>) => void;
  onDelete?: (id: number) => void;
  project?: Project | null;
  mode: 'create' | 'edit' | 'view';
}

export default function ProjectModal({ isOpen, onClose, onSubmit, onDelete, project, mode }: ProjectModalProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    project_name: '',
    customer_name: '',
    contact_number: '',
    order_type: 'Jersey',
    quantity: 1,
    sizes: '',
    design_proof_image: '',
    order_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(), 'yyyy-MM-dd'),
    assigned_staff: '',
    status: 'Design',
    created_by: 'Byron Boyd Ausan'
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        project_name: '',
        customer_name: '',
        contact_number: '',
        order_type: 'Jersey',
        quantity: 1,
        sizes: '',
        design_proof_image: '',
        order_date: format(new Date(), 'yyyy-MM-dd'),
        due_date: format(new Date(), 'yyyy-MM-dd'),
        assigned_staff: '',
        status: 'Design',
        created_by: 'Byron Boyd Ausan'
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, design_proof_image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isView = mode === 'view';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isView ? 'Project Details' : mode === 'edit' ? 'Edit Project' : 'New Production Project'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isView ? `Tracking: ${project?.tracking_number}` : 'Fill in the details to start production'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Info size={14} /> Basic Information
                </h3>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Project Name</label>
                  <input 
                    disabled={isView}
                    required
                    type="text" 
                    placeholder="e.g., Team Alpha Jerseys 2024"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-70"
                    value={formData.project_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Customer Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        disabled={isView}
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-70"
                        value={formData.customer_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        disabled={isView}
                        type="tel" 
                        placeholder="+1 234 567 890"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-70"
                        value={formData.contact_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart size={14} /> Order Details
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Order Type</label>
                    <select 
                      disabled={isView}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-70"
                      value={formData.order_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, order_type: e.target.value }))}
                    >
                      <option>Jersey</option>
                      <option>T-shirt</option>
                      <option>Hoodie</option>
                      <option>Polo</option>
                      <option>Shorts</option>
                      <option>Banner</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Quantity</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        disabled={isView}
                        type="number" 
                        min="1"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-70"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Sizes & Breakdown</label>
                  <textarea 
                    disabled={isView}
                    placeholder="S: 5, M: 10, L: 5, XL: 2"
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-70 resize-none"
                    value={formData.sizes}
                    onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} /> Timeline & Staff
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Order Date</label>
                    <input 
                      disabled={isView}
                      type="date" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-70"
                      value={formData.order_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, order_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Due Date</label>
                    <input 
                      disabled={isView}
                      type="date" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-70"
                      value={formData.due_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Assigned Staff</label>
                    <input 
                      disabled={isView}
                      type="text" 
                      placeholder="Designer Name"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-70"
                      value={formData.assigned_staff}
                      onChange={(e) => setFormData(prev => ({ ...prev, assigned_staff: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Current Status</label>
                    <select 
                      disabled={isView}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-70"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
                    >
                      {STAGES.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Upload size={14} /> Design Proof
                </h3>
                
                <div className="relative aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center group transition-all hover:border-indigo-300">
                  {formData.design_proof_image ? (
                    <>
                      <img 
                        src={formData.design_proof_image} 
                        alt="Design Proof" 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      {!isView && (
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="p-3 bg-white text-slate-900 rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-xl">
                            <Upload size={20} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                          </label>
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, design_proof_image: '' }))}
                            className="p-3 bg-white text-red-600 rounded-2xl hover:scale-110 transition-transform shadow-xl"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Upload size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-600">Upload Design Proof</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG or SVG up to 10MB</p>
                      {!isView && (
                        <label className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                          Browse Files
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <div>
            {(mode === 'edit' || mode === 'view') && project && onDelete && (
              <button 
                type="button"
                onClick={() => {
                  onDelete(project.id);
                  onClose();
                }}
                className="px-4 py-2.5 text-red-600 hover:bg-red-50 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Project
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            {!isView && (
              <button 
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 active:scale-95"
              >
                <Save size={18} />
                {mode === 'edit' ? 'Update Project' : 'Create Project'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
