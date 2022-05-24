import axios, { AxiosError } from "axios";
import { useState } from "react";

interface RequestInput {
  url: string;
  method: "get" | "post" | "patch";
  body: object;
  onSuccess?: (results?: any) => void;
}

interface Error {
  message: string;
  field?: string;
}

const useRequest = ({ url, method, body, onSuccess }: RequestInput) => {
  const [errors, setErrors] = useState<Error[] | null>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors as Error[]);
        }
      }
    }
  };

  return { doRequest, errors };
};

export default useRequest;
