import type { NextPage, NextPageContext } from "next";
import Link from "next/link";

interface CurrentUser {
  id: string;
  email: string;
}

interface HomeProps {
  currentUser: null | CurrentUser;
  tickets: any;
}

// @ts-ignore
const Home: NextPage<HomeProps> = ({ currentUser, tickets }: HomeProps) => {
  console.log(tickets);
  return currentUser ? (
    <div>
      {/* <h2>You are signed in as {currentUser.email}</h2> */}
      <h1>Tickets Home</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            return (
              <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{"$" + ticket.price}</td>
                <td>
                  <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                    <a>View</a>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <h2>You are not signed in </h2>
  );
};
// @ts-ignore
Home.getInitialProps = async (
  context: NextPageContext,
  client,
  currentUser
): Promise<HomeProps> => {
  const { data } = await client.get("/api/tickets");
  return { currentUser, tickets: data };
};

export default Home;
