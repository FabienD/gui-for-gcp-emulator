import { Alert, Box } from '@mui/material';
import Title from './Title';

type NotYetImplementedProps = {
  readonly title: string;
  readonly icon: string;
};

function NotYetImplemented({
  title,
  icon,
}: NotYetImplementedProps): React.ReactElement {
  return (
    <Box>
      <Title title={title} icon={icon} />
      <Alert severity="error">Not implemented.</Alert>
    </Box>
  );
}

export default NotYetImplemented;
