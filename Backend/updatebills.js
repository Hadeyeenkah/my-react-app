router.put('/updateBill/:id', async (req, res) => {
    const { title, amount, dueDate, category } = req.body;
    try {
      const updatedBill = await Bill.findByIdAndUpdate(
        req.params.id,
        { title, amount, dueDate, category },
        { new: true }
      );
  
      res.status(200).json(updatedBill);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  