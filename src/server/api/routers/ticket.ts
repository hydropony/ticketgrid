import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  create: publicProcedure
    .input(
        z.object({ title: z.string().min(1),
        content: z.string().min(1),
        user_id: z.string().min(1),
     }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ticket.create({
        data: {
            title: input.title,
            content: input.content,
            status: "Created",
            user_id: input.user_id
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const tickets = await ctx.db.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });

    return tickets ?? [];
  }),
  getById: publicProcedure
    .input(z.object({ ticketId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { ticket_id: Number(input.ticketId) },
      });
      return ticket;
    }),
//   getById: publicProcedure
//     .input(z.object({ ticketId: z.string() }))  // Validate ticketId parameter
//     .query(async ({ ctx, input }) => {
//       return ctx.db.ticket.findUnique({
//         where: {
//           ticket_id: Number(input.ticketId),  // Ensure we query by the correct ID type
//         },
//       });
//     }),
});
