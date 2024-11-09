import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const updateRouter = createTRPCRouter({
  create: publicProcedure
    .input(
        z.object({ ticket_id: z.number(),
        content: z.string().min(1),
        status: z.string().min(1),
     }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update.create({
        data: {
            content: input.content,
            status: input.status,
            ticket_id: input.ticket_id
        },
      });
    }),
});
