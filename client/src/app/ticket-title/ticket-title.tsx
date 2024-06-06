import styles from './ticket-title.module.css';

/* eslint-disable-next-line */
export interface TicketTitleProps {}

export function TicketTitle(props: TicketTitleProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TicketTitle!</h1>
    </div>
  );
}

export default TicketTitle;
