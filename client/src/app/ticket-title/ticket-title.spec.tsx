import { render } from '@testing-library/react';

import TicketTitle from './ticket-title';

describe('TicketTitle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TicketTitle />);
    expect(baseElement).toBeTruthy();
  });
});
