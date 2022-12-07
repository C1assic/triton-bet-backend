const { ApolloServer } = require('@apollo/server');
const { WebSocketServer } = require('ws');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { useServer } = require('graphql-ws/lib/use/ws');
const depthLimit = require('graphql-depth-limit');
const express = require('express');
const { expressMiddleware } = require('@apollo/server/express4');
const { json } = require('body-parser');
const http = require('http');
const cors = require('cors');

const { modules: directiveModules, transformer: directiveTransformer } = require('./directives');
const appModules = require('./modules');

const authService = require('../services/auth');

const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const modules = [...Object.values(appModules), ...directiveModules];

  let schema = makeExecutableSchema({
    typeDefs: modules.map((module) => module.typeDefs),
    resolvers: modules.map((module) => module.resolvers),
  });
  schema = directiveTransformer(schema);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/ws',
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => ({
        authToken: ctx?.extra?.authToken,
        userId: ctx?.extra?.userId,
      }),
      onConnect: async (ctx) => {
        ctx.extra.authToken = ctx?.connectionParams?.authentication;
        ctx.extra.userId = await authService.getUserIdByToken(ctx.extra.authToken);
      },
    },
    wsServer,
  );

  const apolloServer = new ApolloServer({
    schema,
    validationRules: [depthLimit(7)],
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    introspection: (process.env.NODE_ENV || 'development') === 'development',
    playground: {
      settings: {
        'schema.polling.enable': false,
        'editor.fontSize': 18,
      },
    },
  });
  await apolloServer.start();

  app.use(
    '/api',
    cors(),
    json(),
    expressMiddleware(apolloServer, {
      context: ({ req }) => {
        const authToken = req.headers.authorization;
        return {
          req,
          authToken,
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        };
      },
    }),
  );

  httpServer.listen(8080, () => {
    console.info(`Express server running on port (8080)`);

    if (process.send) {
      process.send('ready');
    }
  });
};

main();
