import { User, UsersReducerState } from '@acme/shared-models';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@acme/ui-components/components/select';
import { Separator } from '@acme/ui-components/components/separator';
import { ReactElement, useRef } from 'react';
/* eslint-disable-next-line */
export interface TicketAsigneeSelectProps {
  users: UsersReducerState;
  selectTrigger: ReactElement;
  selectedAssignee: number;
  onValueChange: (value: string) => void;
  value?: string;
}

export function TicketAsigneeSelect({
  users,
  selectTrigger,
  onValueChange,
  selectedAssignee,
}: TicketAsigneeSelectProps) {
  const selectKey = useRef(performance.now());
  if (selectedAssignee === -1) selectKey.current = performance.now();

  const usersSelectIem = users.allIds.map((userId: User['id']) => {
    const user = users.byIds[userId];
    return (
      <SelectItem key={user.id} value={`${user.id}`}>
        {user.name}
      </SelectItem>
    );
  });

  return (
    <Select
      value={selectedAssignee === -1 ? undefined : `${selectedAssignee}`}
      onValueChange={onValueChange}
      key={`${selectKey.current}`}
    >
      {selectTrigger}
      <SelectContent>
        <SelectGroup>
          {usersSelectIem}
          {selectedAssignee !== -1 ? (
            <>
              <Separator></Separator>
              <SelectItem value={'-1'}>Clear</SelectItem>
            </>
          ) : null}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default TicketAsigneeSelect;
