import axios, { AxiosRequestHeaders } from "axios";
import { NextPageContext } from "next";
import { isServer } from "../tools/client-or-server";

//http://ingress-nginx-controller.ingress-nginx.svc.cluster.local

const buildClient = ({ req }: NextPageContext) => {
  return axios.create({
    baseURL: isServer()
      ? "http://157.245.17.29.nip.io/"
      : "/",
    headers: isServer() && req ? (req.headers as AxiosRequestHeaders) : {},
  });
};

export default buildClient;
