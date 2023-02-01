import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";

import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  const { status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/chat");
    }

    if (status === "unauthenticated") {
      signIn()
    }
  }, [status]);

  return null;
};

export default Home;