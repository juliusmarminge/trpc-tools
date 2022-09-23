import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useTRPCForm } from "trpc-forms";

// import { PostValidator } from "./api/trpc/[trpc]";

const Home: NextPage = () => {
  const { handleSubmit, register } = useTRPCForm(trpc.post.add);

  return (
    <form onSubmit={handleSubmit}>
      <input {...register("author")} />
      <input {...register("title")} />
      <input {...register("body")} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Home;
