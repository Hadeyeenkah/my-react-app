router.post('/addBill', async (req, res) => {
    const { userId, title, amount, dueDate, category } = req.body;
    try {
      const newBill = new Bill({
        userId,
        title,
        amount,
        dueDate,
        category
      });
  
      await newBill.save();
      res.status(201).json(newBill);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  