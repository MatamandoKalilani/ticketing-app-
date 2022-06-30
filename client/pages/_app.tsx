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
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

MyApp.getInitialProps = async ({
  ctx,
  Component,
}: AppContext): Promise<Partial<MyAppProps>> => {
  const client = buildClient(ctx);
  const { data } = await client.get("/api/users/current-user");
  const currentUser: CurrentUser = data.currentUser;

  let pageProps = {};

  if (Component.getInitialProps) {
    //@ts-ignore
    pageProps = await Component.getInitialProps(ctx, client, currentUser);
  }

  return { currentUser, pageProps };
};
export default MyApp;
