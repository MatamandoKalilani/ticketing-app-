import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  //Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  //Save a Ticket
  await ticket.save();

  //fetch two instances
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make two separate changes to the tickets
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  //Save the first fetched ticket
  await firstInstance!.save();

  // Save the second fetched ticket and expect fail.
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not get this far!");
});

it("it increments the version number on multiple saves", async () => {
  //Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  //First Save of a Ticket
  await ticket.save();
  expect(ticket.version).toEqual(0);

  //Second Save of a Ticket
  await ticket.save();
  expect(ticket.version).toEqual(1);

  //Third Save of a Ticket
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
