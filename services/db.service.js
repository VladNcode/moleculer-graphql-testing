const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

let Email;
let User;
let Sms;
let sequelize;

const connect = async () => {
	try {
		const connection = mysql.createConnection({
			host: 'localhost',
			port: 3306,
			user: 'root',
			password: 'password',
		});

		connection.query(`CREATE DATABASE IF NOT EXISTS EMAIL;`);

		sequelize = new Sequelize('EMAIL', 'root', 'password', {
			host: 'localhost',
			dialect: 'mysql',
		});

		await sequelize.authenticate();
		console.log('Connection has been established successfully.');

		User = sequelize.define(
			'user',
			{
				id: {
					type: Sequelize.INTEGER,
					autoIncrement: true,
					allowNull: false,
					primaryKey: true,
				},
				name: { type: Sequelize.STRING, allowNull: false },
				email: { type: Sequelize.STRING, allowNull: false },
				phone: { type: Sequelize.STRING, allowNull: false },
			},
			{
				// don't add the timestamp attributes (updatedAt, createdAt)
				timestamps: false,
			}
		);

		Email = sequelize.define(
			'email',
			{
				id: {
					type: Sequelize.INTEGER,
					autoIncrement: true,
					allowNull: false,
					primaryKey: true,
				},
				reciever: { type: Sequelize.STRING, allowNull: false },
				body: { type: Sequelize.STRING, allowNull: false },
				when: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
			},
			{
				// don't add the timestamp attributes (updatedAt, createdAt)
				timestamps: false,
			}
		);

		Sms = sequelize.define(
			'sms',
			{
				id: {
					type: Sequelize.INTEGER,
					autoIncrement: true,
					allowNull: false,
					primaryKey: true,
				},
				reciever: { type: Sequelize.STRING, allowNull: false },
				body: { type: Sequelize.STRING, allowNull: false },
				when: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
			},
			{
				// don't add the timestamp attributes (updatedAt, createdAt)
				timestamps: false,
			}
		);

		// User.hasMany(Sms, { foreignKey: 'sms_id', sourceKey: 'id' });
		Sms.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

		Query = sequelize.define(
			'query',
			{
				id: {
					type: Sequelize.INTEGER,
					autoIncrement: true,
					allowNull: false,
					primaryKey: true,
				},
				reciever: { type: Sequelize.STRING, allowNull: false },
				body: { type: Sequelize.STRING, allowNull: false },
				when: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
			},
			{
				// don't add the timestamp attributes (updatedAt, createdAt)
				timestamps: false,
			}
		);

		sequelize.sync({ force: true });
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

connect();

module.exports = {
	name: 'db',

	events: {
		async 'db.called'(payload) {
			this.logger.info('****** DB event was caught! ******');
			this.logger.info(payload.type);

			if (payload.type === 'sms') {
				await Sms.create({
					reciever: payload.payload.to,
					body: payload.payload.msg,
					user_id: payload.payload.user_id,
				});
			} else if (payload.type === 'email') {
				await Email.create({
					reciever: payload.payload.to,
					body: payload.payload.msg,
				});
			} else if (payload.type === 'pg') {
				await sequelize.query(payload.payload.query, {
					replacements: {
						reciever: payload.payload.reciever,
						body: payload.payload.body,
					},
				});
			} else {
				await User.create({
					name: payload.payload.name,
					email: payload.payload.email,
					phone: payload.payload.phone,
				});
			}
		},

		async 'getUsers.called'(payload) {
			this.logger.info('****** GETUSERS event was caught! ******');
			const users = await User.findAll({ where: { id: payload } });
			return users;
		},

		async 'getSms.called'(payload) {
			this.logger.info('****** GETSMS event was caught! ******');
			const sms = await Sms.findAll({});
			return sms;
		},

		async 'getUserSms.called'(ctx) {
			this.logger.info('****** GETUSERSMS event was caught! ******');
			this.logger.info(ctx.params.id);
			const sms = await Sms.findAll({ where: { user_id: ctx.params.id } });
			return sms;
		},

		async 'userUpdate.called'(ctx) {
			this.logger.info('****** USERUPDATE event was caught! ******');
			const { id, name, email, phone } = ctx.params;
			const user = await User.findOne({ where: { id } });
			const updatedUser = await user.update({ name, email, phone });
			// console.log(updatedUser);
			return updatedUser;
		},
	},
};
