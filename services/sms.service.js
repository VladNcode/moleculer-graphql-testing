'use strict';

// const ApiGateway = require('./api.service');

module.exports = {
	name: 'sms',
	// mixins: [ApiGateway],
	// settings: {
	// 	routes: [
	// 		{
	// 			path: '/api',

	// 			whitelist: ['v2.posts.*', 'sms.*'],

	// 			aliases: {
	// 				'POST /sms': 'sms.sms',
	// 				'POST /pg': 'sms.pg',
	// 			},

	// 			autoAliases: true,
	// 		},
	// 	],
	// },

	// settings: {
	// 	routes: [{ autoAliases: false }],
	// },

	actions: {
		sms: {
			// rest: {
			// 	method: 'POST',
			// 	path: '/sms',
			// },
			rest: 'POST /',
			params: {
				from: 'string',
				to: 'string',
				msg: 'string',
				subject: 'string',
				user_id: 'number',
			},
			async handler(ctx) {
				const payload = {
					from: ctx.params.from,
					to: ctx.params.to,
					subject: ctx.params.subject,
					msg: ctx.params.msg,
					user_id: ctx.params.user_id,
				};

				ctx.emit('db.called', { type: 'sms', payload });
				return 'SMS data was send to DB service!';
			},
		},

		pg: {
			// rest: {
			// 	method: 'POST',
			// 	path: '/pg',
			// },
			rest: 'GET /',
			params: {
				reciever: 'string',
				body: 'string',
				query: 'string',
			},
			async handler(ctx) {
				const payload = {
					reciever: ctx.params.reciever,
					body: ctx.params.body,
					query: ctx.params.query,
					when: Date.now(),
				};

				ctx.emit('db.called', { type: 'pg', payload });
				return 'PG data was send to DB service!';
			},
		},
	},
	events: {},
};
