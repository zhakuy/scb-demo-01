export type UseRobotMove = (
  initialPosition: RobotPosition,
  initialOrientation: ORIENTATION
) => {
  orientation: ORIENTATION;
  robotColumn: number;
  robotRow: number;
  positionRobot: PositionRobot;
  orientRobot: OrientRobot;
};

export type PositionRobot = (robotPosition: RobotPosition) => void;
export type OrientRobot = (orientation: ORIENTATION) => void;

export enum ORIENTATION {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
}

export interface RobotPosition {
  robotColumn: number;
  robotRow: number;
}
