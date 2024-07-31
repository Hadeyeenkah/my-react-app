document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = './signup.html';
        return;
    }

      // Fetch user details
      async function fetchUserDetails() {
        try {
            const response = await fetch('http://localhost:5000/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const user = await response.json();
                document.getElementById('username').textContent = user.name;
            } else {
                console.error('Error fetching user details:', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Initial call to populate user details
    fetchUserDetails();

    const addBillForm = document.getElementById('add-bill-form');
    const payBillsForm = document.getElementById('pay-bills-form');
    const billSelect = document.getElementById('bill-id');
    const payAmountField = document.getElementById('pay-amount'); // Renamed to avoid confusion with the add bill form

    // Add Bill Form Submission
    addBillForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const accountType = document.getElementById('accountType').value;
        const accountNumber = document.getElementById('accountNumber').value;
        const provider = document.getElementById('provider').value;
        const amount = document.getElementById('add-amount').value; // Renamed to avoid confusion with the pay bill form
        const status = document.getElementById('status').value;

        try {
            const response = await fetch('http://localhost:5000/api/bill-account/add-bill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ accountType, accountNumber, provider, amount, status })
            });

            if (response.ok) {
                const result = await response.json();
                alert('Bill added successfully');
                populateBillSelect(); // Refresh bill dropdown
            } else {
                const result = await response.json();
                alert('Error adding bill: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    });

    // Populate Bill Dropdown
    async function populateBillSelect() {
        try {
            const response = await fetch('http://localhost:5000/api/bill-account/get', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const bills = await response.json();
                billSelect.innerHTML = ''; // Clear existing options
                bills.forEach(bill => {
                    const option = document.createElement('option');
                    option.value = bill._id;
                    option.textContent = `${bill.accountType}`;
                    option.dataset.amount = bill.amount; // Store amount in data attribute
                    billSelect.appendChild(option);
                });
            } else {
                const result = await response.json();
                alert('Error fetching bills: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    }

    // Handle Bill Selection Change
    billSelect.addEventListener('change', (event) => {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const selectedAmount = selectedOption.dataset.amount;
        console.log('Selected Amount:', selectedAmount); // Debugging statement
        payAmountField.value = selectedAmount; // Update pay amount field
        console.log('Amount Field Value:', payAmountField.value);
    });

    // Pay Bill Form Submission
    payBillsForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const billId = billSelect.value;
        const amount = payAmountField.value;

        console.log('Submitting payment request with:', { billId, amount });

        try {
            const response = await fetch('http://localhost:5000/api/payment/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ billId, amount })
            });

            const result = await response.json(); // Ensure JSON parsing before checking status

            if (response.ok) {
                console.log('Payment result:', result); // Log the result for debugging
                const paymentUrl = result.authorization_url;
                if (paymentUrl) {
                    alert('Payment initiated successfully. Redirecting to Paystack...');
                    window.location.href = paymentUrl; // Redirect to Paystack payment URL
                } else {
                    alert('Error: Payment URL not found.');
                }
                fetchPaymentHistory();
            } else {
                alert('Error initiating payment: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    });

     // Fetch and populate payment history
     async function fetchPaymentHistory() {
        try {
            const response = await fetch('http://localhost:5000/api/payment/history', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const paymentHistory = await response.json();
                console.log('Fetched payment history:', paymentHistory);
                populatePaymentHistoryTable(paymentHistory);
            } else {
                const result = await response.json();
                alert('Error fetching payment history: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    }

    // Populate payment history table
    function populatePaymentHistoryTable(paymentHistory) {
        const historyTable = document.getElementById('history-table');
        historyTable.innerHTML = '';

        paymentHistory.forEach(payment => {
            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            const descriptionCell = document.createElement('td');
            const amountCell = document.createElement('td');

            dateCell.textContent = new Date(payment.createdAt).toLocaleDateString();
            descriptionCell.textContent = `Payment for ${payment.billId.accountType} (${payment.billId.provider})`;
            amountCell.textContent = payment.amount;

            row.appendChild(dateCell);
            row.appendChild(descriptionCell);
            row.appendChild(amountCell);
            historyTable.appendChild(row);
        });
    }

    // Initial population of bill dropdown and payment history table
    populateBillSelect();
    fetchPaymentHistory();
});
