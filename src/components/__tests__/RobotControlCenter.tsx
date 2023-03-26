import {
  render,
  screen,  
  waitFor,
  fireEvent,
  act,  
  cleanup
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import RobotControlCenter from "../RobotControlCenter";

describe("[COMPONENT][RobotControlCenter]", () => {
  afterEach(() => {
    cleanup();    
  });

  test("[STRUCTURE] core structure", async () => {
    render(<RobotControlCenter />);

    expect(screen.getByLabelText("Orientation")).toBeInTheDocument();
    expect(screen.getByLabelText("Row")).toBeInTheDocument();
    expect(screen.getByLabelText("Column")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Place/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Report/i })).toBeInTheDocument();
  });

  test("[BEHAVIOR] report is disabled after loading and orientation is NORTH and position is (0,0)", async () => {
    render(<RobotControlCenter />);

    expect(screen.getByLabelText("Orientation")).toHaveValue("NORTH");
    expect(screen.getByLabelText("Row")).toHaveValue("0");
    expect(screen.getByLabelText("Column")).toHaveValue("0");
    expect(screen.getByRole("button", { name: /Place/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Report/i })).toBeDisabled();
  });

  test("[BEHAVIOR] getting started message is displayed after loading", async () => {
    render(<RobotControlCenter />);

    expect(screen.getByText("To get started")).toBeDefined();
  });

  test("[BEHAVIOR] on Place command, the robot is set to given location with given orientation", async () => {
    render(<RobotControlCenter />);

    const btnPlace = screen.getByRole("button", { name: /Place/i });

    act(() => {
      fireEvent.click(btnPlace);
    });

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-robot-row", "5");
      expect(document.documentElement).toHaveAttribute(
        "data-robot-column",
        "1"
      );
    });
  });

  test("[BEHAVIOR] on Place command, Get started message is gone", async () => {
    render(<RobotControlCenter />);

    const btnPlace = screen.getByRole("button", { name: /Place/i });

    act(() => {
      fireEvent.click(btnPlace);
    });

    await waitFor(() => {
      expect(screen.queryByText("To get started")).toBeNull();
    });
  });

  test("[BEHAVIOR] on Place (2,2) SOUTH command , the robot is set accordingly", async () => {
    render(<RobotControlCenter />);

    const btnPlace = screen.getByRole("button", { name: /Place/i });
    const selectOrientation = screen.getByLabelText("Orientation");
    const selectRow = screen.getByLabelText("Row");
    const selectColumn = screen.getByLabelText("Column");

    act(() => {
      fireEvent.mouseDown(selectOrientation);
    });

    await waitFor(() => {
      expect(screen.queryByText("SOUTH")).toBeTruthy();
      userEvent.click(screen.queryByText("SOUTH")!);
      userEvent.click(selectOrientation);
    });

    act(() => {
      fireEvent.mouseDown(selectRow);
    });

    await waitFor(() => {
      expect(screen.queryByText("2")).toBeTruthy();
      userEvent.click(screen.queryByText("2")!);
      userEvent.click(selectRow);
    });

    act(() => {
      fireEvent.mouseDown(selectColumn);
    });

    await waitFor(() => {
      expect(screen.queryByText("2")).toBeTruthy();
      userEvent.click(screen.queryByText("2")!);
      userEvent.click(selectRow);
    });

    act(() => {
      fireEvent.click(btnPlace);
    });

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute(
        "data-robot-orientation",
        "2"
      );
      expect(document.documentElement).toHaveAttribute("data-robot-row", "3");
      expect(document.documentElement).toHaveAttribute(
        "data-robot-column",
        "3"
      );
    });
  });

  test("[BEHAVIOR] on Place (2,2) SOUTH command , Report command displays '2, 2, SOUTH'", async () => {
    render(
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <Notifications />
        <RobotControlCenter />
      </MantineProvider>
    );

    const btnPlace = screen.getByRole("button", { name: /Place/i });
    const btnReport = screen.getByRole("button", { name: /Report/i });
    const selectOrientation = screen.getByLabelText("Orientation");
    const selectRow = screen.getByLabelText("Row");
    const selectColumn = screen.getByLabelText("Column");

    act(() => {
      fireEvent.mouseDown(selectOrientation);
    });

    await waitFor(() => {
      expect(screen.queryByText("SOUTH")).toBeTruthy();
      userEvent.click(screen.queryByText("SOUTH")!);
      userEvent.click(selectOrientation);
    });

    act(() => {
      fireEvent.mouseDown(selectRow);
    });

    await waitFor(() => {
      expect(screen.queryByText("2")).toBeTruthy();
      userEvent.click(screen.queryByText("2")!);
      userEvent.click(selectRow);
    });

    act(() => {
      fireEvent.mouseDown(selectColumn);
    });

    await waitFor(() => {
      expect(screen.queryByText("2")).toBeTruthy();
      userEvent.click(screen.queryByText("2")!);
      userEvent.click(selectRow);
    });

    act(() => {
      userEvent.click(btnPlace);
    });

    act(() => {
      userEvent.click(btnReport);
    });

    await waitFor(() => {
      const notification = screen.getByRole("alert");
      expect(notification).toHaveTextContent("2, 2, SOUTH");      
    });
  });

  test("[BEHAVIOR] on ArrowUp moves up", async () => {
    render(<RobotControlCenter />);

    const btnPlace = screen.getByRole("button", { name: /Place/i });

    act(() => {
      userEvent.click(btnPlace);
      //screen.debug(document.documentElement)
    });

    act(() => {
      userEvent.keyboard("{ArrowUp}");
    });

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-robot-row", "4");
      expect(document.documentElement).toHaveAttribute(
        "data-robot-column",
        "1"
      );
    });
  });

  test("[BEHAVIOR] cannot move WEST from ORIGIN", async () => {
    render(<RobotControlCenter />);

    const btnPlace = screen.getByRole("button", { name: /Place/i });

    act(() => {
      userEvent.click(btnPlace);
    });

    act(() => {
      userEvent.keyboard("{ArrowLeft}[ArrowUp]");
    });

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-robot-row", "5");
      expect(document.documentElement).toHaveAttribute(
        "data-robot-column",
        "1"
      );
    });
  });

  test("[BEHAVIOR] cannot move SOUTH from ORIGIN", async () => {
    render(<RobotControlCenter />);

    const btnPlace = screen.getByRole("button", { name: /Place/i });

    act(() => {
      userEvent.click(btnPlace);
    });

    act(() => {
      userEvent.keyboard("{ArrowLeft}{ArrowLeft}{ArrowUp}");
    });

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-robot-row", "5");
      expect(document.documentElement).toHaveAttribute(
        "data-robot-column",
        "1"
      );
    });
  });

  test("[BEHAVIOR] cannot move NORTH from 4th row", async () => {
    render(<RobotControlCenter />);

    const btnPlace = screen.getByRole("button", { name: /Place/i });

    act(() => {
      userEvent.click(btnPlace);
    });

    act(() => {
      userEvent.keyboard(
        "{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}"
      );
    });

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-robot-row", "1");
      expect(document.documentElement).toHaveAttribute(
        "data-robot-column",
        "1"
      );
    });
  });

  test("[BEHAVIOR] cannot move WEST from 4th column", async () => {
    render(<RobotControlCenter />);

    const btnPlace = screen.getByRole("button", { name: /Place/i });

    act(() => {
      userEvent.click(btnPlace);
    });

    act(() => {
      userEvent.keyboard(
        "{ArrowRight}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}"
      );
    });

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-robot-row", "5");
      expect(document.documentElement).toHaveAttribute(
        "data-robot-column",
        "5"
      );
    });
  });
});
