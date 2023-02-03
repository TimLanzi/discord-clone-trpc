import { z } from "zod";
import { computeMostRecentMessage } from "../../../utils/compute-most-recent-message";
import { computeUnreadMessages } from "../../../utils/compute-unread-messages";
import { conversationExists } from "../../../utils/conversation-exists";
import { MESSAGE_CHANNEL, NEW_CONVERSATION_EVENT, NEW_MESSAGE_EVENT } from "../../../utils/pusher-channels-events";
import { pusher } from "../../../utils/pusher-server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const messagingRouter = createTRPCRouter({
  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: {
          id: input.conversationId,
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          },
          messages: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              user: true,
            },
          },
        },
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      return conversation;
    }),

  getConversations: protectedProcedure
    .query(async ({ ctx }) => {
      const conversations = await ctx.prisma.conversation.findMany({
        where: {
          users: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
        include: {
          users: {
            where: {
              id: {
                not: ctx.session.user.id,
              }
            },
          },
          messages: {
            include: {
              readBy: true
            }
          },
        },
      });

      const computedConverations = conversations.map((conversation) => ({
        ...computeMostRecentMessage(conversation),
        ...computeUnreadMessages(conversation, ctx.session.user.id),
        messages: undefined,
      }))
      .sort((a, b) => 
        b.mostRecentMessage.createdAt.valueOf() - a.mostRecentMessage.createdAt.valueOf()
      );

      return computedConverations
    }),

  createConversation: protectedProcedure
    .input(z.object({
      userId: z.string(),
      message: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // check if a conversation already exists with only these two users
      const exists = await conversationExists(ctx, [input.userId]);

      const conversation = await ctx.prisma.conversation.upsert({
        where: {
          id: exists?.id || "",
        },
        create: {
          users: {
            connect: [
              {
                id: ctx.session.user.id,
              },
              {
                id: input.userId,
              },
            ],
          },
          messages: {
            create: {
              text: input.message,
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
        },
        update: {
          messages: {
            create: {
              text: input.message,
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
        },
      });

      pusher.trigger(MESSAGE_CHANNEL, NEW_CONVERSATION_EVENT, {
        conversationId: conversation.id,
      });

      return conversation;
    }),

  searchUser: protectedProcedure
    .input(z.object({
      query: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.user.findMany({
        where: {
          name: {
            contains: input.query,
            not: ctx.session.user.name,
          }
        },
      });

      return users;
    }),

  sendMessage: protectedProcedure
    .input(z.object({
        conversationId: z.string(),
        text: z.string(),
      }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.create({
        data: {
          userId: ctx.session.user.id,
          text: input.text,
          conversationId: input.conversationId,
        },
        include: {
          user: true,
        }
      });

      console.log("hi")
      pusher.trigger(MESSAGE_CHANNEL, NEW_MESSAGE_EVENT(input.conversationId), {
        conversationId: input.conversationId,
        message,
      });

      return message;
    }),
});