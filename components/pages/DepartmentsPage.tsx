import React, { useEffect, useState } from 'react';
import { Department, Employee } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import DepartmentForm from '../departments/DepartmentForm';
import Dialog from '../common/Dialog';
import { useToast } from '../../hooks/useToast';
import { departmentsApi } from '../../utils/api';

interface DepartmentsPageProps {
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  employees: Employee[];
}

const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ departments, setDepartments, employees }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingDeptId, setDeletingDeptId] = useState<string | null>(null);
  const { addToast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // optional: could be triggered on auth instead; kept here for safety
    // Do not auto-load if there are already departments in memory to avoid overriding demo data
    (async () => {
      if (departments.length > 0) return;
      try {
        const { data } = await departmentsApi.list();
        // Map backend shape -> frontend shape
        const mapped: Department[] = data.map(d => ({ id: d._id, name: d.name, managerId: d.managerId?._id || undefined }));
        if (mapped.length > 0) setDepartments(mapped);
      } catch {}
    })();
  }, [departments.length, setDepartments]);

  const getDepartmentStats = (deptId: string) => {
    const employeeCount = employees.filter(e => e.departmentId === deptId).length;
    return { employeeCount };
  };

  const handleSaveDepartment = async (deptData: Department) => {
    try {
      setIsSyncing(true);
      if (editingDepartment) {
        const { data } = await departmentsApi.update(editingDepartment.id, {
          name: deptData.name,
          managerId: deptData.managerId || null,
        });
        const updated: Department = { id: data._id, name: data.name, managerId: data.managerId?._id || undefined };
        setDepartments(departments.map(d => d.id === updated.id ? updated : d));
        addToast({ type: 'success', message: 'Department updated successfully!' });
      } else {
        const { data } = await departmentsApi.create({
          name: deptData.name,
          managerId: deptData.managerId || null,
        });
        const created: Department = { id: data._id, name: data.name, managerId: data.managerId?._id || undefined };
        setDepartments(prev => [created, ...prev]);
        addToast({ type: 'success', message: 'Department created successfully!' });
      }
    } catch (e: any) {
      addToast({ type: 'error', message: e?.message || 'Failed to save department' });
    } finally {
      setIsSyncing(false);
      setEditingDepartment(null);
      setIsFormOpen(false);
    }
  };
  
  const openEditForm = (dept: Department) => {
    setEditingDepartment(dept);
    setIsFormOpen(true);
  };
  
  const openAddForm = () => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  };

  const openConfirmDelete = (id: string) => {
    setDeletingDeptId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingDeptId) return;
    try {
      setIsSyncing(true);
      await departmentsApi.remove(deletingDeptId);
      setDepartments(departments.filter(d => d.id !== deletingDeptId));
      addToast({ type: 'success', message: 'Department deleted successfully.' });
    } catch (e: any) {
      addToast({ type: 'error', message: e?.message || 'Failed to delete department' });
    } finally {
      setIsSyncing(false);
      setIsConfirmOpen(false);
      setDeletingDeptId(null);
    }
  };


  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Departments</h1>
          <Button onClick={openAddForm} disabled={isSyncing}>Create Department</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => {
            const manager = employees.find(e => e.id === dept.managerId);
            const stats = getDepartmentStats(dept.id);
            return (
              <Card key={dept.id} className="flex flex-col" footer={
                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => openEditForm(dept)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => openConfirmDelete(dept.id)}>Delete</Button>
                </div>
              }>
                  <h3 className="text-xl font-semibold text-foreground">{dept.name}</h3>
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>Manager: {manager ? manager.name : 'Not Assigned'}</p>
                    <p>Employees: {stats.employeeCount}</p>
                  </div>
              </Card>
            );
          })}
        </div>
      </div>
      
      {isFormOpen && (
        <DepartmentForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveDepartment}
          department={editingDepartment}
          employees={employees}
        />
      )}

      {isConfirmOpen && (
         <Dialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Confirm Deletion">
            <p className="text-muted-foreground mt-2">Are you sure you want to delete this department? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3 mt-6">
                <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
         </Dialog>
      )}
    </>
  );
};

export default DepartmentsPage;
