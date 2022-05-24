import type { NextPage, NextPageContext } from "next";

import buildClient from "../api/build-client";

interface CurrentUser {
  id: string;
  email: string;
}

interface HomeProps {
  currentUser: null | CurrentUser;
}

const Home: NextPage<HomeProps> = ({ currentUser }: HomeProps) => {
  return currentUser ? (
    <h1>You are signed in as {currentUser.email}</h1>
  ) : (
    <h1>You are not signed in </h1>
  );
};

Home.getInitialProps = async (context: NextPageContext): Promise<HomeProps> => {
  try {
    const { data } = await buildClient(context).get("/api/users/current-user");
    const currentUser: CurrentUser = data.currentUser;
    return { currentUser };
  } catch (err) {
    return { currentUser: null };
  }
};

export default Home;
