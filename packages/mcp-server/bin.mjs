#!/usr/bin/env node
import { startServer } from './server.mjs';

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
