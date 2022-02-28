'use strict';

// const PassportMixin = require('../mixins/passport.mixin');
const passportMixin = require('../mixins/passport.mixin');

module.exports = {
	name: 'user',
	mixins: [passportMixin],
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
				// console.log(ctx.params.name, ctx.params.email, ctx.params.phone);

				// const test = passport.authenticate('jwt', { session: false });
				// console.log(test);
				// console.log(ctx);

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
				// console.log(updatedUser[0]);

				this.broker.broadcast('graphql.publish', { tag: 'TEST', payload: updatedUser[0] });
				return updatedUser[0];
			},
		},

		updatedevent: {
			params: { payload: 'object' },
			graphql: {
				subscription: `updatedevent(id: Int!): User`,
				tags: ['TEST'],
				filter: 'user.user.filter',
			},
			handler(ctx) {
				return ctx.params.payload;
			},
		},

		'user.filter': {
			params: { id: 'number', payload: 'object' },
			handler(ctx) {
				console.log(ctx.params.payload.id, ctx.params.id);
				return ctx.params.payload.id === ctx.params.id;
			},
		},
		socialLogin: {
			params: {
				// provider: { type: 'string' },
				// profile: { type: 'object' },
				// jwt: { type: 'string' },
				// refreshToken: { type: 'string', optional: true },
			},
			async handler(ctx) {
				this.logger.info('hello');
				return 'hello';
			},
		},
	},

	events: {},
};
