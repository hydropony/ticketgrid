import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  create: publicProcedure
    .input(
        z.object({
        ticket_id: z.number(),
        content: z.string().min(1),
        user_id: z.string().min(1),
        fullname: z.string().min(1),
        imageUrl: z.string().min(1)
     }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
            content: input.content,
            user_id: input.user_id,
            fullname: input.fullname,
            imageUrl: input.imageUrl,
            ticket: { connect: { ticket_id: input.ticket_id } }
        },
      });
    }),

//   getLatest: publicProcedure.query(async ({ ctx }) => {
//     const tickets = await ctx.db.ticket.findMany({
//       orderBy: { createdAt: "desc" },
//     });

//     return tickets ?? [];
//   }),
//   getById: publicProcedure
//     .input(z.object({ ticketId: z.string().min(1) }))
//     .query(async ({ ctx, input }) => {
//       const ticket = await ctx.db.ticket.findUnique({
//         where: { ticket_id: Number(input.ticketId) },
//       });
//       return ticket ?? null;
//     }),
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
