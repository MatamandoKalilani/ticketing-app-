import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/Header";
import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import buildClient from "../api/build-client";

interface CurrentUser {
  id: string;
  email: string;
}

interface MyAppProps extends AppProps {
  currentUser: null | CurrentUser;
  pageProps: any;
}

const MyApp = ({ Component, pageProps, currentUser }: MyAppProps) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

MyApp.getInitialProps = async ({
  ctx,
  Component,
}: AppContext): Promise<Partial<MyAppProps>> => {
  const { data } = await buildClient(ctx).get("/api/users/current-user");
  const currentUser: CurrentUser = data.currentUser;

  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { currentUser, pageProps };
};
export default MyApp;
