import { useState, useRef } from "react";
import * as R from "ramda";
import {
  AppShell,
  Header,
  Button,
  Select,
  SelectItem,
  createStyles,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import GettingStartedNotification from "./GetStartedNotification";
import Robotplayground, { ORIENTATION } from "./RobotPlayground";
import type { RobotplaygroundRef } from "./RobotPlayground";

const useStyles = createStyles((theme) => ({
  main: {
    "> *": {
      height: "100%",
      width: "100%",
    },
  },
}));

const toDisplayLabelRow = R.subtract(5);
const toDisplayLabelColumn = R.subtract(R.__, 1);

const selectItemsRow = R.pipe(
  // @ts-ignore
  R.map((a: number) => ({
    value: a.toString(),
    label: toDisplayLabelRow(a).toString(),
  })),
  R.reverse
)(R.range(1, 6)) as SelectItem[];

const selectItemsColumn = R.map((a: number) => ({
  value: a.toString(),
  label: toDisplayLabelColumn(a).toString(),
}))(R.range(1, 6)) as SelectItem[];

const RobotControlCenter = () => {
  const { classes } = useStyles();
  const [selectedOrientation, setSelectedOrientation] = useState(
    ORIENTATION.NORTH
  );
  const [selectedRow, setSelectedRow] = useState(5);
  const [selectedColumn, setSelectedColumn] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  const controlCenterReference = useRef<RobotplaygroundRef>();

  const handleCommandPlace = () => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else {
      controlCenterReference.current!.orientRobot(selectedOrientation);
      controlCenterReference.current!.positionRobot({
        robotRow: selectedRow,
        robotColumn: selectedColumn,
      });
    }
  };

  return (
    <AppShell
      classNames={{ main: classes.main }}
      header={
        <Header height={120} p="xs">          
          <Select
            label="Orientation"
            style={{ width: 200, display: "inline-block" }}
            m="sm"
            data={R.map((a: number) => ({
              value: a.toString(),
              label: ORIENTATION[a],
            }))(R.range(0, 4))}
            value={selectedOrientation.toString()}
            onChange={(value: string) =>
              setSelectedOrientation(parseInt(value!))
            }
          />

          <Select
            label="Row"
            placeholder="Row"
            style={{ width: 200, display: "inline-block" }}
            m="sm"
            data={selectItemsRow}
            value={selectedRow.toString()}
            onChange={(value: string) => setSelectedRow(parseInt(value!))}
          />

          <Select
            label="Column"
            placeholder="Column"
            style={{ width: 200, display: "inline-block" }}
            m="sm"
            data={selectItemsColumn}
            value={selectedColumn.toString()}
            onChange={(value: string) => setSelectedColumn(parseInt(value!))}
          />
          <Button m="sm" onClick={handleCommandPlace}>
            Place
          </Button>
          <Button
            m="sm"
            disabled={!isInitialized}
            onClick={() => 
              showNotification({
                title: "Current position",
                message: `${toDisplayLabelRow(
                  controlCenterReference.current!.robotRow
                )}, ${toDisplayLabelColumn(
                  controlCenterReference.current!.robotColumn
                )}, ${
                  ORIENTATION[controlCenterReference.current!.orientation]
                }`                
              })
            }
          >
            Report
          </Button>
        </Header>
      }
    >
      {!isInitialized ? (
        <GettingStartedNotification />
      ) : (
        <Robotplayground
          initialOrientation={selectedOrientation}
          initialPosition={{
            robotRow: selectedRow,
            robotColumn: selectedColumn,
          }}
          ref={controlCenterReference}
        />
      )}
    </AppShell>
  );
};

export default RobotControlCenter;
