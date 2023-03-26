import * as R from "ramda";
import { ORIENTATION } from "./types";
import type { RobotPosition } from "./types";
import Orientation from "./Orientation";
import { LAST_COLUMN, LAST_ROW } from "./consts";

export const onlyUpKeyClick: (e: KeyboardEvent) => boolean = R.anyPass([
  R.propEq("key", "ArrowUp"),
]);

export const onlyLeftRightClick: (e: KeyboardEvent) => boolean = R.anyPass([
  R.propEq("key", "ArrowRight"),
  R.propEq("key", "ArrowLeft"),
]);

const rightKeyClicked = ([e, orientation]: [e: KeyboardEvent, orientation: ORIENTATION]) =>
  R.propEq("key", "ArrowRight")(e);

const rotateClockwise = ([e, orientation]: [e: KeyboardEvent, orientation: ORIENTATION]) => Orientation.rotateClockwise(orientation);
const rotateCounterClockwise = ([e, orientation]: [e: KeyboardEvent, orientation: ORIENTATION]) =>
  Orientation.rotateCounterClockwise(orientation);

export const rotate = R.cond([
  [rightKeyClicked, rotateClockwise],
  [R.T, rotateCounterClockwise],
]);

const orientedNorthAndCanGoNorth = ([robotPosition, orientation]:readonly [robotPosition: RobotPosition, orientation: ORIENTATION]) =>
orientation === ORIENTATION.NORTH && robotPosition.robotRow > 1;
const moveNorth = ([robotPosition, orientation]: readonly [robotPosition: RobotPosition, orientation: ORIENTATION]) => ({
  ...robotPosition,
  robotRow: robotPosition.robotRow - 1,
});
const orientedSouthAndCanGoSouth = ([robotPosition, orientation]:readonly [robotPosition: RobotPosition, orientation: ORIENTATION]) =>
orientation === ORIENTATION.SOUTH && robotPosition.robotRow < LAST_ROW;
const moveSouth = ([robotPosition, orientation]:readonly [robotPosition: RobotPosition, orientation: ORIENTATION]) => ({
  ...robotPosition,
  robotRow: robotPosition.robotRow + 1,
});
const orientedWestAndCanGoWest = ([robotPosition, orientation]:readonly [robotPosition: RobotPosition, orientation: ORIENTATION]) => 
orientation === ORIENTATION.WEST && robotPosition.robotColumn > 1;

const moveWest = ([robotPosition, orientation]:readonly [robotPosition: RobotPosition, orientation: ORIENTATION]) => ({
  ...robotPosition,
  robotColumn: robotPosition.robotColumn - 1,
});

const orientedEastAndCanGoEast = ([robotPosition, orientation]:readonly [robotPosition: RobotPosition, orientation: ORIENTATION]) => 
orientation === ORIENTATION.EAST && robotPosition.robotColumn < LAST_COLUMN;



const moveEast = ([robotPosition, orientation]:readonly [robotPosition: RobotPosition, orientation: ORIENTATION]) => ({
  ...robotPosition,
  robotColumn: robotPosition.robotColumn + 1,
});
const dontMove = ([robotPosition, orientation]:readonly [robotPosition: RobotPosition, orientation: ORIENTATION]) => ({ ...robotPosition });

export const tryToMove = R.cond([
  [orientedNorthAndCanGoNorth, moveNorth],
  [orientedSouthAndCanGoSouth, moveSouth],
  [orientedWestAndCanGoWest, moveWest],
  [orientedEastAndCanGoEast, moveEast],
  [R.T, dontMove],
]);

export const pushPositionToCSS = (position: RobotPosition) => {
  document.documentElement.setAttribute('data-robot-column', position.robotColumn.toString());
  document.documentElement.style.setProperty(
    "--robot-column",
    position.robotColumn.toString()
  );

  document.documentElement.setAttribute('data-robot-row', position.robotRow.toString());
  document.documentElement.style.setProperty(
    "--robot-row",
    position.robotRow.toString()
  );  
};

export const pustOrientationToCSS = (orientation: ORIENTATION) => {  
  document.documentElement.setAttribute('data-robot-orientation', orientation.toString());
  document.documentElement.style.setProperty(
    "--robot-orinentation",
    Orientation.converOrientationToDeg(orientation)
  );
};
