interface Error {
  message: string;
  field?: string;
}

interface ErrorBoxInput {
  errors: Error[];
}

const ErrorBox = ({ errors }: ErrorBoxInput) => {
  return (
    <div className="alert alert-danger">
      <h4>Ooops....</h4>
      <ul className="my-0">
        {errors.map((err) => (
          <li key={err.message}>{err.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorBox;
