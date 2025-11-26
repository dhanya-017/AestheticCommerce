const Contact = require('../models/Contact');

exports.createContactMessage = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: 'Contact message saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save contact message' });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    let messages;
    if (req.query.email) {
      messages = await Contact.find({ email: req.query.email }).sort({ createdAt: -1 });
    } else {
      messages = await Contact.find().sort({ createdAt: -1 });
    }
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve contact messages' });
  }
};

exports.respondToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { response, status } = req.body;
    const updatedMessage = await Contact.findByIdAndUpdate(id, { response, status }, { new: true });
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact message' });
  }
};

exports.deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
};
