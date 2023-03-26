import { waitFor, fireEvent, renderHook, act } from "@testing-library/react";

import useRobotMove, {
  ORIENTATION,
  LAST_ROW,
  LAST_COLUMN,
} from "../UseRobotMove";

const ORIGIN = {robotColumn: 1, robotRow: 5}

describe("[HOOK][useRobotMove]", () => {
  
  
  test("starts at origin, orientation NORTH", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));
    const { orientation, robotColumn, robotRow } = result.current;

    expect(orientation).toEqual(0);
    expect(robotColumn).toEqual(1);
    expect(robotRow).toEqual(5);
  });

  test("rotates EAST on RIGHT click", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowRight", code: "ArrowRight" });
    });

    expect(result.current.orientation).toEqual(ORIENTATION.EAST);
    expect(result.current.robotColumn).toEqual(1);
    expect(result.current.robotRow).toEqual(LAST_ROW);
  });

  test("rotates SOUTH on double LEFT click", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });
    });

    expect(result.current.orientation).toEqual(ORIENTATION.SOUTH);
    expect(result.current.robotColumn).toEqual(1);
    expect(result.current.robotRow).toEqual(LAST_ROW);
  });

  test("moves UP on NORTH from ORIGIN", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
    });

    await waitFor(() =>
      expect(result.current.orientation).toEqual(ORIENTATION.NORTH)
    );
    await waitFor(() => expect(result.current.robotColumn).toEqual(1));
    await waitFor(() => expect(result.current.robotRow).toEqual(LAST_ROW - 1));
  });

  test("moves UP to NORTH on 5 clicks from ORIGIN", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
    });

    const { orientation, robotColumn, robotRow } = result.current;

    await waitFor(() => expect(orientation).toEqual(ORIENTATION.NORTH));
    await waitFor(() => expect(robotColumn).toEqual(1));
    await waitFor(() => expect(robotRow).toEqual(1));
  });

  test("moves UP to NORTH LIMIT on 6 clicks from ORIGIN", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
    });

    const { orientation, robotColumn, robotRow } = result.current;

    await waitFor(() => expect(orientation).toEqual(ORIENTATION.NORTH));
    await waitFor(() => expect(robotColumn).toEqual(1));
    await waitFor(() => expect(robotRow).toEqual(1));
  });

  test("moves WEST LIMIT on 6 clicks from ORIGIN", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowRight", code: "ArrowRight" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
    });

    const { robotColumn } = result.current;

    await waitFor(() => expect(robotColumn).toEqual(LAST_COLUMN));
  });

  test("cannot cross WEST LIMIT from ORIGIN", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
    });

    const { robotColumn } = result.current;

    await waitFor(() => expect(robotColumn).toEqual(1));
  });

  test("cannot cross SOUTH LIMIT from ORIGIN", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "ArrowLeft", code: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });
    });

    const { robotColumn } = result.current;

    await waitFor(() => expect(robotColumn).toEqual(1));
  });

  test("can set ORIENTATION from ORIGIN", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    const { orientRobot  } = result.current;

    act(() => {
      orientRobot(ORIENTATION.SOUTH)
    });

    await waitFor(() => expect(result.current.orientation).toEqual(ORIENTATION.SOUTH));
  });

  test("can set ORIENTATION after move", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    const { orientRobot  } = result.current;

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });      
    });

    await waitFor(() => expect(result.current.robotRow).toEqual(LAST_ROW-1));

    act(() => {      
      orientRobot(ORIENTATION.SOUTH)
    });

    await waitFor(() => expect(result.current.orientation).toEqual(ORIENTATION.SOUTH));    
  });

  test("can set POSITION from ORIGIN", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    const { positionRobot  } = result.current;

    act(() => {
      positionRobot({robotRow: 3, robotColumn:3})
    });

    await waitFor(() => expect(result.current.robotRow).toEqual(3));
    await waitFor(() => expect(result.current.robotColumn).toEqual(3));    
  });

  test("can set POSITION after move", async () => {
    const { result } = renderHook(() => useRobotMove(ORIGIN, ORIENTATION.NORTH));

    const { positionRobot  } = result.current;

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowUp", code: "ArrowUp" });      
    });

    await waitFor(() => expect(result.current.robotRow).toEqual(LAST_ROW-1));

    act(() => {      
      positionRobot({robotRow: 3, robotColumn:3})
    });

    await waitFor(() => expect(result.current.robotRow).toEqual(3));
    await waitFor(() => expect(result.current.robotColumn).toEqual(3));
  });
});
