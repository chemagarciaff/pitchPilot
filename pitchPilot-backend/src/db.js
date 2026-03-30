import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "chema",
  password: "Ventilador97.",
  database: "pitchpilot",
});

const prisma = new PrismaClient({ adapter });

export default prisma;