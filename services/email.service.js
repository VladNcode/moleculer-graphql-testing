require('dotenv').config({ path: './config.env' });
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
	name: 'email',
	events: {
		'email.called'(payload) {
			this.logger.info('****** Email event was caught! ******');
			this.logger.info(payload);

			const msg = {
				to: payload.to, // Change to your recipient
				from: payload.from, // Change to your verified sender
				subject: payload.subject,
				text: payload.msg,
				html: payload.msg,
			};
			sgMail
				.send(msg)
				.then(() => {
					this.broker.emit('db.called', { type: 'email', payload });
				})
				.catch(error => {
					console.error(error);
				});
		},
	},
};
