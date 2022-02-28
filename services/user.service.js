'use strict';

// const ApiGateway = require('./api.service');

module.exports = {
	name: 'user',
	actions: {
		user: {
			// rest: {
			// 	method: 'POST',
			// 	path: '/pg',
			// },
			rest: 'GET /',
			params: {
				name: 'string',
				email: 'string',
				phone: 'string',
			},
			graphql: {
				mutation: `createuser(name: String!, email: String!, phone: String!): User`,
			},
			async handler(ctx) {
				console.log(ctx.params.name, ctx.params.email, ctx.params.phone);

				const payload = {
					name: ctx.params.name,
					email: ctx.params.email,
					phone: ctx.params.phone,
				};

				ctx.emit('db.called', { type: 'user', payload });
				// return 'USER data was send to DB service!';
				return payload;
			},
		},

		update: {
			// rest: {
			// 	method: 'POST',
			// 	path: '/pg',
			// },
			rest: 'GET /',
			params: {
				id: 'number',
				name: 'string',
				email: 'string',
				phone: 'string',
			},
			graphql: {
				mutation: `updateuser(id: Int, name: String!, email: String!, phone: String!): User`,
			},
			async handler(ctx) {
				const payload = {
					id: ctx.params.id,
					name: ctx.params.name,
					email: ctx.params.email,
					phone: ctx.params.phone,
				};

				const updatedUser = await ctx.emit('userUpdate.called', payload);
				// return 'USER data was send to DB service!';
				console.log(updatedUser[0]);

				this.broker.broadcast('graphql.publish', { tag: 'TEST', payload: updatedUser[0] });
				return updatedUser[0];
			},
		},

		updatedevent: {
			params: { payload: 'object' },
			graphql: {
				subscription: `updatedevent: User`,
				tags: ['TEST'],
			},
			handler(ctx) {
				return ctx.params.payload;
			},
		},
	},

	events: {},
};
