import React from 'react';

function AddBill() {
  return (
    <div>
      <h2>Add Bill</h2>
      <form>
        {/* Add your form fields for adding a bill here */}
        <input type="text" placeholder="Bill Name" />
        <input type="number" placeholder="Amount" />
        <button type="submit">Add Bill</button>
      </form>
    </div>
  );
}

export default AddBill;
