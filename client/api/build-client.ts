import axios, { AxiosRequestHeaders } from "axios";
import { NextPageContext } from "next";
import { isServer } from "../tools/client-or-server";

const buildClient = ({ req }: NextPageContext) => {
  return axios.create({
    baseURL: isServer()
      ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
      : "/",
    headers: isServer() && req ? (req.headers as AxiosRequestHeaders) : {},
  });
};

export default buildClient;
