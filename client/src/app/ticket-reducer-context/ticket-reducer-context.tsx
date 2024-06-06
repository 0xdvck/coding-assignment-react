/* eslint-disable @typescript-eslint/no-empty-function */
import { TicketsReducerStore } from '@acme/shared-models';
import { ReactElement, createContext } from 'react';

type TicketReducerContextType = {
  store: TicketsReducerStore;
  dispatch: (action: any) => void;
};

export const TicketReducerContext = createContext<TicketReducerContextType>({
  store: {
    tickets: {
      byIds: {},
      allIds: [],
    },
    users: {
      byIds: {},
      allIds: [],
    },
  },
  dispatch: (action: any) => {},
});

/* eslint-disable-next-line */
export interface TicketReducerContextProps {
  children: ReactElement | ReactElement[];
  value: TicketReducerContextType
}

export function TicketReducerContextFragment({
  children,
  value,
}: TicketReducerContextProps) {
  return (
    <TicketReducerContext.Provider value={value}>
      {children}
    </TicketReducerContext.Provider>
  );
}
