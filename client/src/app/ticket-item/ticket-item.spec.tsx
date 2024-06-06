import { render } from '@testing-library/react';

import TicketItem from './ticket-item';

describe('TicketItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TicketItem />);
    expect(baseElement).toBeTruthy();
  });
});
