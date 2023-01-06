import { t } from "../trpc";
import { UserValidator } from "../../pages/index";
import { z } from "zod";

export type User = Omit<
  z.output<typeof UserValidator> & { id: string },
  "confirmPassword"
>;

const users: User[] = [
  {
    id: "0",
    name: "Julius",
    email: "julius@test.com",
    password: "supersecret",
  },
];

const userRouter = t.router({
  list: t.procedure.query(() =>
    users.map((user) => ({ id: user.id, name: user.name, email: user.email })),
  ),
  add: t.procedure.input(UserValidator).mutation(({ input }) => {
    const id = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .slice(0, 6);
    const user = {
      id,
      name: input.name,
      email: input.email,
      password: input.password,
    };
    users.push(user);
    return user;
  }),
});

export const appRouter = t.router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
