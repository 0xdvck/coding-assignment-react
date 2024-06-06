import { render } from '@testing-library/react';

import TicketAsigneeSelect from './ticket-asignee-select';

describe('TicketAsigneeSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TicketAsigneeSelect />);
    expect(baseElement).toBeTruthy();
  });
});
