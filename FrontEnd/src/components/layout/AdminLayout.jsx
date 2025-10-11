import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './Sidebar';


export default function AdminLayout () {


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Sidebar */}
            <AdminSidebar />

            {/* Main Content Area - shifted right on large screens */}
            <div className="lg:ml-64">
                
                {/*  child routes  */}
                <Outlet />
            </div>
        </div>
    );
};