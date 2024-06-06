import {  TicketClient, User } from '@acme/shared-models';
import { useState } from 'react';
import { TableRow, TableCell } from '@acme/ui-components/components/table';
import { Checkbox } from '@acme/ui-components/components/checkbox';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';


/* eslint-disable-next-line */
export interface TicketItemProps {
  ticket: TicketClient;
  assginee: User | undefined;
  dispatch: any;
}

export function TicketItem({ ticket, assginee, dispatch }: TicketItemProps) {
  const [isChecked, setIsChecked] = useState(ticket.completed);

  async function onCheckBoxClick(e: any) {
    e.preventDefault();
    //because toggle checked
    const method = isChecked === true ? 'DELETE' : 'PUT';

    //if success then update state (optimistic update)
    await fetch(`/api/tickets/${ticket.id}/complete`, {
      method,
      referrerPolicy: 'no-referrer',
    }).then();

    dispatch({
      type: 'ticket/complete',
      value: {
        ...ticket,
        completed: !isChecked,
        version: ticket.version + 1,
      },
    });
    setIsChecked(!isChecked);
  }

  return (
    <TableRow key={ticket.id}>
      {/*TODO: optimize render with memo, useMemo, children ref */}
      <TableCell className="font-medium">{ticket.id}</TableCell>
      <TableCell>{ticket.description}</TableCell>
      <TableCell>{assginee ? assginee.name : null}</TableCell>
      {/*TODO: optimize render with memo, useMemo, children ref */}

      <TableCell>
        <div className="flex items-center space-x-2">
          <Checkbox id="status" onClick={onCheckBoxClick} checked={isChecked} />
          <label
            htmlFor="status"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {isChecked ? 'Done' : 'In Progress'}
          </label>
        </div>
      </TableCell>
      <TableCell>
        <Link to={`/${ticket.id}`}>
          <Edit className="cursor-pointer " size={20} />
        </Link>
      </TableCell>
    </TableRow>
  );
}

export default TicketItem;
