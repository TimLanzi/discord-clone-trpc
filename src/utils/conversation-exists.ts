import type { AuthorizedTRPCContext } from "../server/api/trpc";

export async function conversationExists(ctx: AuthorizedTRPCContext, userIds: string[]) {
  const ids = [ctx.session.user.id, ...userIds]
  
  const potentials = await ctx.prisma.conversation.findMany({
    where: {
      users: {
        every: {
          id: {
            in: [...ids],
          },
        },
      },
    },
    include: {
      users: true,
    }
  });
  
  const normalizedIds = ids.sort().join()

  return potentials.find(conv => {
    return conv.users.map(user => user.id).sort().join() === normalizedIds
  });
}