import axios, { AxiosRequestHeaders } from "axios";
import { NextPageContext } from "next";
import { isServer } from "../tools/client-or-server";

//http://ingress-nginx-controller.ingress-nginx.svc.cluster.local

const buildClient = ({ req }: NextPageContext) => {
  return axios.create({
    baseURL: isServer()
      ? "https://www.builtdifferent.dev/"
      : "/",
    headers: isServer() && req ? (req.headers as AxiosRequestHeaders) : {},
  });
};

export default buildClient;
