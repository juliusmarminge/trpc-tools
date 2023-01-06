import { createTRPCRouter, publicProcedure } from "../trpc";
import { UserAddValidator } from "../../pages/index";
import { z } from "zod";

type User = z.output<typeof UserAddValidator> & { id: string };
const users: User[] = [
  {
    id: "1",
    name: "Julius",
    email: "julius@test.com",
  },
];

const userRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return users;
  }),
  add: publicProcedure.input(UserAddValidator).mutation(({ input }) => {
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
