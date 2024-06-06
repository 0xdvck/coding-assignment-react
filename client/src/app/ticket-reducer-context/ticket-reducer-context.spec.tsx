import { render } from '@testing-library/react';

import TicketReducerContext from './ticket-reducer-context';

describe('TicketReducerContext', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TicketReducerContext />);
    expect(baseElement).toBeTruthy();
  });
});
