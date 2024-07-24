import React from 'react';
import { Link } from 'react-router-dom';

function FeaturesDashboard() {
  return (
    <div>
      <h1>Paymate Features</h1>
      <ul>
        <li><Link to="/add-bill">Add Bill</Link></li>
        <li><Link to="/manage-bills">Manage Bills</Link></li>
        <li><Link to="/view-categories">View Categories</Link></li>
        <li><Link to="/pay-bills">Pay Bills</Link></li>
        {/* Add links to other features as needed */}
      </ul>
    </div>
  );
}

export default FeaturesDashboard;
