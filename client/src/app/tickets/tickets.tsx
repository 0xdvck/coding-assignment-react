import { Ticket } from '@acme/shared-models';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@acme/ui-components/components/card';
import { Input } from '@acme/ui-components/components/input';
import { TicketItem } from '../ticket-item/ticket-item';

import {
  useContext,
  useReducer,
  useState,
  ChangeEvent,
  MouseEvent,
} from 'react';

import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@acme/ui-components/components/table';

import { ScrollArea } from '@acme/ui-components/components/scroll-area';

import { Button } from '@acme/ui-components/components/button';
import { Separator } from '@acme/ui-components/components/separator';

import {
  SelectTrigger,
  SelectValue,
} from '@acme/ui-components/components/select';
import { TicketReducerContext } from '../ticket-reducer-context/ticket-reducer-context';
import TicketAsigneeSelect from '../ticket-asignee-select/ticket-asignee-select';

export function Tickets() {
  const { store, dispatch } = useContext(TicketReducerContext);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const [selectedAssignee, setselectedAssignee] = useState(-1);
  const [title, setTitle] = useState('');

  const isAllowSubmit = title && selectedAssignee !== -1;

  async function addTicket(data: { description: string }) {
    return await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    }).then();
  }

  async function updateAssignee(data: {
    ticketId: number;
    assigneeId: number;
  }) {
    return await fetch(
      `/api/tickets/${data.ticketId}/assign/${data.assigneeId}`,
      {
        method: 'PUT',
        referrerPolicy: 'no-referrer',
      }
    ).then();
  }

  async function onTicketSubmit(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    //optimistic update
    //not UI responsive friendly, but data is insync with server
    //asumming server always on, always right
    //should use redux middleware for sideeffect
    e.preventDefault();

    const resp = await addTicket({ description: title });
    const ticket = await resp.json();
    dispatch({ type: 'tickets/add', value: [ticket] });

    await updateAssignee({ ticketId: ticket.id, assigneeId: selectedAssignee });
    dispatch({
      type: 'ticket/assign',
      value: { ...ticket, assigneeId: selectedAssignee },
    });
    forceUpdate();
  }

  async function onTitleChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setTitle(e.target.value);
  }

  async function onSelectChange(value: string) {
    setselectedAssignee(Number(value));
  }

  const tickets = store.tickets.allIds.map((ticketId: Ticket['id']) => {
    const ticket = store.tickets.byIds[ticketId];
    const assginee = ticket.assigneeId
      ? store.users.byIds[ticket.assigneeId]
      : undefined;
    return (
      <TicketItem
        key={ticket.id}
        assginee={assginee}
        ticket={ticket}
        dispatch={dispatch}
      />
    );
  });

  return (
    <div className=" p-2 font-mono w-[80rem] h-[45rem]">
      <Card>
        <CardHeader>
          <CardTitle>Tickets Board</CardTitle>
          <CardDescription>Manage Your Tickets</CardDescription>
        </CardHeader>
        <Separator></Separator>
        <CardContent className="pt-6">
          {/* TODO: Split this component to another folder */}
          <div className="flex gap-x-4">
            <div className="flex gap-x-4">
              <div>
                <p>Title</p>
                <Input
                  className="focus-visible:ring-transparent"
                  onChange={onTitleChange}
                ></Input>
              </div>
              <div>
                <p>Assignee</p>
                <TicketAsigneeSelect
                  users={store.users}
                  onValueChange={onSelectChange}
                  selectTrigger={
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select assginee" />
                    </SelectTrigger>
                  }
                  selectedAssignee={selectedAssignee}
                ></TicketAsigneeSelect>
              </div>
            </div>
            {isAllowSubmit ? (
              <Button className="self-end" onClick={onTicketSubmit}>
                Submit
              </Button>
            ) : (
              <Button className="self-end" onClick={onTicketSubmit} disabled>
                Submit
              </Button>
            )}
          </div>
        </CardContent>
        <CardContent>
          <ScrollArea className="h-[32rem] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Ticket</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{tickets}</TableBody>
              <TableFooter> </TableFooter>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}

export default Tickets;
