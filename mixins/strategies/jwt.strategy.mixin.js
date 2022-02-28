'use strict';

const passport = require('passport');

const providerName = 'jwt';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// passport.use(
// 	new JwtStrategy(opts, function (jwt_payload, done) {
// 		console.log('************************************************');
// 		// User.findOne({ id: jwt_payload.sub }, function (err, user) {
// 		// if (err) {
// 		// 	return done(err, false);
// 		// }
// 		// if (user) {
// 		// 	return done(null, user);
// 		// } else {
// 		// 	return done(null, false);
// 		// 	// or you could create a new account
// 		// }
// 		// });
// 	})
// );

module.exports = {
	methods: {
		registerJwtStrategy(setting, route) {
			setting = Object.assign(
				{},
				{
					scope: 'profile email',
				},
				setting
			);

			passport.use(
				new JwtStrategy(
					Object.assign(
						{
							jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
							secretOrKey: 'secret',
							issuer: 'accounts.examplesoft.com',
							audience: 'yoursite.net',
						},
						setting
					),
					(jwt, done) => {
						// this.logger.info(`Received '${providerName}' social profile: `, profile);
						this.logger.info('!!!!***********************!!!!!!!');
						this.signInSocialUser(
							{
								provider: providerName,
								jwt,
								// accessToken,
								// refreshToken,
								// profile: this.processGoogleProfile(profile),
							},
							done
						);
					}
				)
			);

			// Create route aliases
			const callback = this.socialAuthCallback(setting, providerName);

			route.aliases[`GET /${providerName}`] = (req, res) =>
				passport.authenticate(providerName, { scope: setting.scope })(req, res, callback(req, res));
			route.aliases[`GET /${providerName}/callback`] = (req, res) =>
				passport.authenticate(providerName, { session: false })(req, res, callback(req, res));
		},

		processGoogleProfile(profile) {
			const res = {
				provider: profile.provider,
				socialID: profile.id,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
			};
			if (profile.emails && profile.emails.length > 0) res.email = profile.emails[0].value;

			if (profile.photos && profile.photos.length > 0)
				res.avatar = profile.photos[0].value.replace('sz=50', 'sz=200');

			return res;
		},
	},
};
