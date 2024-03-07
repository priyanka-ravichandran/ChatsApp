const Contacts = require('../models/contactModel');
const User = require('../models/userModel');

const contactsController = {
    async getContacts(req, res) {
        try {
            const loggedInUserId = req.user.id;

            const userContacts = await Contacts.findOne({ userId: loggedInUserId })
                .populate('contacts', 'username'); // Assuming you want to fetch only usernames

            res.json(userContacts ? userContacts.contacts : []);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    async addContact(req, res) {
        try {
            const loggedInUserId = req.user.id;
            const contactUsername = req.body.contactUsername;
            // Find the contact user by username
            const contactUser = await User.findOne({ username: contactUsername });
            if (!contactUser) {
                return res.status(404).send('Contact user not found');
            }

            // Add contact to the logged-in user's contact list
            await Contacts.findOneAndUpdate(
                { userId: loggedInUserId },
                { $addToSet: { contacts: contactUser.id } },
                { upsert: true }
            );

            // Add logged-in user to the contact's contact list
            await Contacts.findOneAndUpdate(
                { userId: contactUser.id },
                { $addToSet: { contacts: loggedInUserId } },
                { upsert: true }
            );

            res.status(200).send({_id:contactUser.id});
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    async deleteContact(req, res) {
        try {
            const loggedInUserId = req.user.id;
            const contactUsername = req.body.contactUsername;

            const contactUser = await User.findOne({ username: contactUsername });
            if (!contactUser) {
                return res.status(404).send('Contact user not found');
            }

            await Contacts.updateOne(
                { userId: loggedInUserId },
                { $pull: { contacts: contactUser.id } }
            );

            res.status(200).send('Contact removed');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = contactsController;
