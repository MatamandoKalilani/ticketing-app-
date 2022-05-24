import { NextPage } from "next";
import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

const SignOutPage: NextPage = () => {
  const { doRequest } = useRequest({
    url: "/api/users/sign-out",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);
  
  return (
    <div>
      <h1>Signing Out....</h1>
    </div>
  );
};

export default SignOutPage;
