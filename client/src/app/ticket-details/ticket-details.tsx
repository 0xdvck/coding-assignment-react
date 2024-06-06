import { Button } from '@acme/ui-components/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@acme/ui-components/components/card';
import { Input } from '@acme/ui-components/components/input';
import { Label } from '@acme/ui-components/components/label';
import { Skeleton } from '@acme/ui-components/components/skeleton';
import { MoveLeft } from 'lucide-react';

import {
  SelectTrigger,
  SelectValue,
} from '@acme/ui-components/components/select';
import { Link, useParams } from 'react-router-dom';
import { TicketReducerContext } from '../ticket-reducer-context/ticket-reducer-context';
import { useContext, useState } from 'react';
import TicketAsigneeSelect from '../ticket-asignee-select/ticket-asignee-select';

/* eslint-disable-next-line */
export interface TicketDetailsProps {}

export function TicketDetails(props: TicketDetailsProps) {
  const { store, dispatch } = useContext(TicketReducerContext);
  const { id } = useParams();
  const [selectedAssginee, setSelectedAssginee] = useState(-1);

  const ticket = id ? store.tickets.byIds[id] : undefined;
  const assginee = ticket?.assigneeId
    ? store.users.byIds[ticket.assigneeId]
    : undefined;

  if (assginee && selectedAssginee === -1)
    setSelectedAssginee(Number(assginee.id));

  let completeButton = <Skeleton className="h-10 px-4 py-2 w-full"></Skeleton>;
  if (ticket)
    completeButton = ticket.completed ? (
      <Button variant="destructive" onClick={editComplete} className="w-full">
        Mark as incomplete
      </Button>
    ) : (
      <Button onClick={editComplete} className="w-full">
        Mark as complete
      </Button>
    );

  async function editAssignee({
    ticketId,
    assigneeId,
  }: {
    ticketId: number;
    assigneeId: number;
  }) {
    let url: string;
    let method: string;

    url = `/api/tickets/${ticketId}/assign/${assigneeId}`;
    method = 'POST';
    if (assigneeId === -1) {
      url = `/api/tickets/${ticketId}/unassign`;
      method = 'PUT';
    }

    return await fetch(url, {
      method,
      referrerPolicy: 'no-referrer',
    }).then();
  }
  async function editComplete() {
    let url: string;
    let method: string;

    if (!ticket?.id) return;

    url = `/api/tickets/${ticket.id}/complete`;
    method = 'PUT';
    if (ticket.completed) {
      url = `/api/tickets/${ticket.id}/complete`;
      method = 'DELETE';
    }
    await fetch(url, {
      method,
      referrerPolicy: 'no-referrer',
    }).then();

    dispatch({
      type: 'ticket/complete',
      value: {
        ...ticket,
        completed: !ticket.completed,
        version: ticket.version + 1,
      },
    });
  }

  async function onSelectChange(value: string) {
    const assigneeId = Number(value);
    if (ticket && !globalThis.isNaN(assigneeId)) {
      await editAssignee({ ticketId: ticket.id, assigneeId });
      dispatch({
        type: 'ticket/assign',
        value: {
          ...ticket,
          assigneeId: assigneeId,
          version: ticket.version + 1,
        },
      });
      setSelectedAssginee(Number(value));
    }
  }

  return (
    <div className="font-mono w-[40rem] h-[22rem]">
      <Card>
        <CardHeader className=" space-y-0 flex flex-row space">
          <div className="basis-1/2">
            <CardTitle className="pb-1.5">Tickets Board</CardTitle>
            <CardDescription>Edit Your Ticket</CardDescription>
          </div>
          <div className="basis-1/2 flex flex-row-reverse mt-0">
            <Link to={`/`}>
              <MoveLeft className="cursor-pointer"></MoveLeft>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="id">Id</Label>
                <Input
                  id="id"
                  disabled
                  placeholder={ticket?.id ? `${ticket.id}` : undefined}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  disabled
                  placeholder={
                    ticket?.description ? `${ticket.description}` : undefined
                  }
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="id">Asignee</Label>
                <TicketAsigneeSelect
                  selectTrigger={
                    <SelectTrigger>
                      <SelectValue placeholder="Select assginee" />
                    </SelectTrigger>
                  }
                  onValueChange={onSelectChange}
                  selectedAssignee={selectedAssginee}
                  users={store.users}
                ></TicketAsigneeSelect>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>{completeButton}</CardFooter>
      </Card>
    </div>
  );
}

export default TicketDetails;
