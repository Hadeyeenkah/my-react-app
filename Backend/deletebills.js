router.get('/expenseByCategory', async (req, res) => {
    const { userId } = req.query;
    try {
      const bills = await Bill.find({ userId });
      const expensesByCategory = bills.reduce((acc, bill) => {
        if (!acc[bill.category]) {
          acc[bill.category] = 0;
        }
        acc[bill.category] += bill.amount;
        return acc;
      }, {});
      res.status(200).json(expensesByCategory);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  