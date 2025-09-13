import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="pb-12">
        <Outlet />
      </main>
      <footer className="bg-white shadow-inner py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} ForumDiskusi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;