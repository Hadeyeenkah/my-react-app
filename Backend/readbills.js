router.get('/bills', async (req, res) => {
    const { userId } = req.query;
    try {
      const bills = await Bill.find({ userId });
      res.status(200).json(bills);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  