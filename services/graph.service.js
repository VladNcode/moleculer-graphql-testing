module.exports = {
	name: 'graph',
	settings: {
		graphql: {
			resolvers: {
				User: {
					sms: {
						// Call the `graph.resolve` action with `id` params ctx.params.id = id
						action: 'graph.resolve',
						rootParams: {
							id: 'id',
						},
					},
				},
			},
		},
	},

	actions: {
		getusers: {
			graphql: {
				query: `getusers(id: Int): [User]`,
			},
			rest: 'GET /',
			async handler(ctx) {
				// console.log(ctx.params.id);
				const { id } = ctx.params;
				const result = await ctx.emit('getUsers.called', ctx.params.id);
				// console.log(result);
				return result[0];
				// const users = await User.findAll();
				// this.logger.info(users);
			},
		},

		getsms: {
			rest: 'GET /',
			graphql: {
				query: `getsms: [Sms]`,
			},
			async handler(ctx) {
				const result = await ctx.emit('getSms.called', {});
				return result[0];
			},
		},

		resolve: {
			rest: 'GET /',
			async handler(ctx) {
				this.logger.info('HELLO**************************');
				console.log(ctx.params.id);

				const result = await ctx.emit('getUserSms.called', { id: ctx.params.id });
				return result[0];
			},
		},
	},
};
