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
  getLatestWithFavorites: publicProcedure
    .input(z.object({ userId: z.string().nonempty("User ID is required") }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      // Fetch the latest tickets with their favorite status for the user
      const tickets = await ctx.db.ticket.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          favorites: {
            where: { userId }, // Check if the user has favorited this ticket
            select: {  favorite_id: true }, // Only select the favorite ID to determine if it's favorited
          },
          comments: true, 
          updates: true 
        },
      });

      // Map each ticket to include an `isFavorited` boolean based on the favorites array
      return tickets.map(ticket => ({
        ...ticket,
        isFavorited: ticket.favorites.length > 0, // If there are any favorites, the user has favorited this ticket
      }));
    }),
    toggleFavorite: publicProcedure
    .input(
      z.object({
        ticketId: z.number().int(),
        userId: z.string().nonempty("User ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { ticketId, userId } = input;

      // Check if a favorite already exists for this user and ticket
      const existingFavorite = await ctx.db.favorite.findUnique({
        where: {
          userId_ticketId: {
            userId,
            ticketId,
          },
        },
      });

      if (existingFavorite) {
        // If it exists, delete the favorite (unfavorite the ticket)
        await ctx.db.favorite.delete({
          where: {
            favorite_id: existingFavorite.favorite_id,
          },
        });
        return { isFavorited: false }; // Return `isFavorited` status as false
      } else {
        // If it doesn't exist, create a new favorite
        await ctx.db.favorite.create({
          data: {
            userId,
            ticketId,
          },
        });
        return { isFavorited: true }; // Return `isFavorited` status as true
      }
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
