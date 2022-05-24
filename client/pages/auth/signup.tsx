import { FormEvent, useState } from "react";
import Router from "next/router";
import ErrorBox from "../../components/ErrorBox";
import useRequest from "../../hooks/use-request";

interface Error {
  message: string;
  field?: string;
}

const SignUpPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { doRequest, errors } = useRequest({
    url: "/api/users/sign-up",
    method: "post",
    body: { email, password },
    onSuccess: () => {
      Router.push("/");
    },
  });

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        doRequest();
      }}
    >
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          className="form-control"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          className="form-control"
        />
      </div>
      {errors && errors.length > 0 && <ErrorBox errors={errors} />}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default SignUpPage;
