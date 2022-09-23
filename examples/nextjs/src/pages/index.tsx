import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const useMyHook = (mutation: unknown) => {
  const mutate = mutation.useMutation();
};

const Home: NextPage = () => {
  useMyHook(trpc.post.add);
  //                ^?

  return <div />;
};

export default Home;
