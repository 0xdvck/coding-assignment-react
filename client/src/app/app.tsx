import { useEffect, useReducer } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  TicketsReducerStore,
  Ticket,
  User,
  TicketClient,
} from '@acme/shared-models';

import Tickets from './tickets/tickets';
import TicketDetails from './ticket-details/ticket-details';
import { TicketReducerContextFragment } from './ticket-reducer-context/ticket-reducer-context';
import { CardFooter } from '@acme/ui-components/components/card';

//TODO: group  reducer to another file/folder
const initialTicketState: TicketsReducerStore = {
  tickets: {
    byIds: {},
    allIds: [],
  },
  users: {
    byIds: {},
    allIds: [],
  },
};

const ticketsReducer: React.Reducer<
  TicketsReducerStore,
  { type: string; value: any }
> = (state, action) => {
  if (
    //TODO: constant action type
    action.type === 'ticket/assign' ||
    action.type === 'ticket/complete' ||
    action.type === 'ticket/unassign'
  ) {
    const tickets = { ...state.tickets };
    const ticket = action.value;
    const prevTicket = tickets.byIds[ticket.id];
    //optimistic locking
    if (ticket.version >= prevTicket.version) {
      tickets.byIds[ticket.id] = ticket;
      state.tickets = tickets;
    }
    return { ...state };
  }

  if (action.type === 'tickets/add') {
    const tickets = { ...state.tickets };
    action.value.forEach((ticket: TicketClient) => {
      if (!ticket.version) ticket.version = 1;
      tickets.byIds[ticket.id] = ticket;
      tickets.allIds.push(ticket.id);
    });
    state.tickets = tickets;
    return { ...state };
  }

  if (action.type === 'users/add') {
    const users = { ...state.users };
    action.value.forEach((user: User) => {
      users.byIds[user.id] = user;
      users.allIds.push(user.id);
    });

    state.users = users;
    return { ...state };
  }

  return state;
};

const App = () => {
  //Redux is more optimal herer
  //ues Reducer for simplicity
  const [store, dispatch] = useReducer(ticketsReducer, initialTicketState);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  async function fetchTickets() {
    const data = await fetch('/api/tickets').then();
    dispatch({ type: 'tickets/add', value: await data.json() });
    forceUpdate();
  }

  async function fetchUsers() {
    const data = await fetch('/api/users').then();
    dispatch({ type: 'users/add', value: await data.json() });
    forceUpdate();
  }

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  return (
    <main className="flex min-h-screen justify-center items-center">
      <Routes>
        <Route
          path="/"
          element={
            <TicketReducerContextFragment value={{ store, dispatch }}>
              <Tickets />
            </TicketReducerContextFragment>
          }
        />
        <Route
          path="/:id"
          element={
            <TicketReducerContextFragment value={{ store, dispatch }}>
              <TicketDetails />
            </TicketReducerContextFragment>
          }
        />
      </Routes>
      <CardFooter></CardFooter>
    </main>
  );
};

export default App;
