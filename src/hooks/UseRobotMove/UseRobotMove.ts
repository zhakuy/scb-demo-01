import { useState, useEffect, useRef, useCallback } from "react";
import { fromEvent, BehaviorSubject } from "rxjs";
import { map, filter, withLatestFrom } from "rxjs/operators";
import { ORIENTATION } from "./types";
import type { RobotPosition, UseRobotMove } from "./types";
import {
  onlyUpKeyClick,
  onlyLeftRightClick,
  rotate,
  tryToMove,
  pushPositionToCSS,
  pustOrientationToCSS,
} from "./utilities";

const useRobotMove: UseRobotMove = (initialPosition, initialOrientation) => {
  const [position, setPosition] = useState<RobotPosition>(initialPosition);
  const [orientation, setOrientation] = useState(initialOrientation);

  const cellOrientation = useRef(
    new BehaviorSubject<ORIENTATION>(initialOrientation)
  );

  const orientRobot = useCallback((orientation: ORIENTATION) => {
    cellOrientation.current.next(orientation);
    setOrientation(cellOrientation.current.value);
  }, []);

  const orientation$ = useRef(
    fromEvent<KeyboardEvent>(window, "keydown").pipe(
      filter(onlyLeftRightClick),
      withLatestFrom(cellOrientation.current),
      map(rotate)
    )
  );

  const cellPosition = useRef(
    new BehaviorSubject<RobotPosition>(initialPosition)
  );

  const positionRobot = useCallback((robotPosition: RobotPosition) => {
    cellPosition.current.next(robotPosition);
    setPosition(cellPosition.current.value);
  }, []);

  const position$ = useRef(
    fromEvent<KeyboardEvent>(window, "keydown").pipe(
      filter(onlyUpKeyClick),
      withLatestFrom(cellOrientation.current, cellPosition.current),
      map(([, orientation, position]) => [position, orientation] as const),
      map(tryToMove)
    )
  );

  useEffect(() => {
    const subscription = position$.current.subscribe((position) => {
      cellPosition.current.next(position); //sink stream into the cell
      setPosition(cellPosition.current.value); // sync the cell with the state
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = orientation$.current.subscribe((orientation) => {
      cellOrientation.current.next(orientation); //sink stream into the cell
      setOrientation(cellOrientation.current.value); // sync the cell with the state
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    pushPositionToCSS(position);
  }, [position]);

  useEffect(() => {
    pustOrientationToCSS(orientation);
  }, [orientation]);

  return { ...position, orientation, positionRobot, orientRobot };
};

export default useRobotMove;
