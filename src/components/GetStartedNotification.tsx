import { Center, Alert } from "@mantine/core";
import { BiErrorCircle } from "react-icons/bi";

const GettingStartedNotification = () => {
  return (
    <Center>
      <Alert
        color="blue"
        title="To get started"
        icon={<BiErrorCircle size={16} />}
        closeButtonLabel="Dismiss"
      >
        select the initial orientation and position, then click
        the Place button
      </Alert>
    </Center>
  );
};

export default GettingStartedNotification;
