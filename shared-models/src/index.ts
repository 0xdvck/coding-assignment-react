export type User = {
  id: number;
  name: string;
};

export type Ticket = {
  id: number;
  description: string;
  assigneeId: null | number;
  completed: boolean
};

export type TicketClient = {
  id: number;
  description: string;
  assigneeId: null | number;
  completed: boolean;
  version: number;
};



export type TicketsReducerState = {  
    byIds: {  [index: number | string]: TicketClient;},
    allIds:  TicketClient["id"][];
}

export type UsersReducerState = {
    byIds: {  [index: number | string]: User;},
    allIds:  User["id"][]; 
}

export interface TicketsReducerStore {
    tickets: TicketsReducerState,
    users: UsersReducerState
}


export type TicketsActions = '' | '';
