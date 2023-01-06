import { createTRPCRouter, publicProcedure } from "../trpc";
import { userAddInput } from "../../pages/index";
import { z } from "zod";

type User = z.output<typeof userAddInput> & { id: string };
const users: User[] = [
  {
    id: Math.random().toFixed(6),
    name: "Test",
    email: "test@test.com",
  },
];

const userRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return users;
  }),
  add: publicProcedure.input(userAddInput).mutation(({ input }) => {
    const user = {
      id: Math.random().toFixed(6),
      name: input.name,
      email: input.email,
    };
    users.push(user);
    return user;
  }),
});

export const appRouter = createTRPCRouter({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
