import { useImperativeHandle, forwardRef } from "react";
import useRobotMove from "../hooks/UseRobotMove/UseRobotMove";
import Robot from "./Robot";
import { RobotPosition, ORIENTATION } from "../hooks/UseRobotMove";
import type { PositionRobot, OrientRobot } from "../hooks/UseRobotMove/types";

export type RobotplaygroundProps = {
  initialPosition: RobotPosition;
  initialOrientation: ORIENTATION;
};

export type RobotplaygroundRef = {
  orientRobot: OrientRobot;
  positionRobot: PositionRobot;
  robotColumn: number;
  robotRow: number;
  orientation: ORIENTATION;
};

const Robotplayground = forwardRef(
  ({ initialPosition, initialOrientation }: RobotplaygroundProps, ref) => {
    const { orientRobot, positionRobot, robotColumn, robotRow, orientation } =
      useRobotMove(initialPosition, initialOrientation);

    useImperativeHandle(ref, () => ({
      orientRobot,
      positionRobot,
      robotColumn,
      robotRow,
      orientation,
    }));

    return (
      <div className="c-robotplayground l-grid">
        <Robot />
      </div>
    );
  }
);

export { ORIENTATION };
export default Robotplayground;
