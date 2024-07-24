document.addEventListener('DOMContentLoaded', function() {
    var purchaseHistory = [
      { date: '2024-07-22', description: 'Electric Bill Payment', amount: 50.00 },
      { date: '2024-07-21', description: 'Airtime Purchase', amount: 20.00 },
      { date: '2024-07-20', description: 'Subscription Payment', amount: 15.00 },
      { date: '2024-07-19', description: 'Water Bill Payment', amount: 30.00 }
    ];

    var historyTable = document.getElementById('history-table');
    
    purchaseHistory.forEach(function(transaction) {
      var row = document.createElement('tr');
      
      var dateCell = document.createElement('td');
      dateCell.textContent = transaction.date;
      row.appendChild(dateCell);
      
      var descriptionCell = document.createElement('td');
      descriptionCell.textContent = transaction.description;
      row.appendChild(descriptionCell);
      
      var amountCell = document.createElement('td');
      amountCell.textContent = `N${transaction.amount.toFixed(2)}`;
      row.appendChild(amountCell);
      
      historyTable.appendChild(row);
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    const username = 'Hadeyeenkah';  // Replace with dynamic username
    document.getElementById('username').textContent = username;
});
