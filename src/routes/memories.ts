import fastify, { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createAt: "asc",
      },
    });

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.converUrl,
        excerpt: memory.content.substring(0, 115).concat("..."),
      };
    });
  });

  app.get("/memories:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return memory;
  });

  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      converUrl: z.string(),
      ispUBLIC: z.coerce.boolean().default(false),
    });

    const { content, converUrl, ispUBLIC } = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        converUrl,
        ispUBLIC,
        userId: "",
      },
    });
  });

  app.put("/memories:id", async () => {});

  app.delete("/memories:id", async () => {});
}
