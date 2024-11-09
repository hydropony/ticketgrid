import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  create: publicProcedure
    .input(
        z.object({ title: z.string().min(1),
        content: z.string().min(1),
        user_id: z.string().min(1),
        fullname: z.string().min(1),
        imageUrl: z.string().min(1)
     }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ticket.create({
        data: {
            title: input.title,
            content: input.content,
            status: "Created",
            user_id: input.user_id,
            fullname: input.fullname,
            imageUrl: input.imageUrl
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const tickets = await ctx.db.ticket.findMany({
      orderBy: { createdAt: "desc" },
      include: { comments: true, updates: true }
    });

    return tickets ?? [];
  }),
  getById: publicProcedure
    .input(z.object({ ticketId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { ticket_id: Number(input.ticketId) },
        include: {comments: true, updates: true },
      });
      return ticket ?? null;
    }),
    updateStatus: publicProcedure
    .input(
      z.object({
        ticket_id: z.number().int().positive(),
        newStatus: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { ticket_id, newStatus } = input;

      // Update the ticket's status
      const updatedTicket = await ctx.db.ticket.update({
        where: { ticket_id },
        data: { status: newStatus },
      });

      return updatedTicket;
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
