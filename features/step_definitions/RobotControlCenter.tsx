const { Given, When, Then } = require("@cucumber/cucumber");
const React = require("react");
const assert = require("assert");
const {
  render,
  screen,  
  waitFor,
  fireEvent,
  act,  
  cleanup
} = require("@testing-library/react");
const userEvent = require( "@testing-library/user-event");
const { MantineProvider } = require("@mantine/core");
const { Notifications } = require ("@mantine/notifications");
const ResizeObserver = require ('resize-observer-polyfill');
global.ResizeObserver = ResizeObserver;

const ORIENTATION = require("../../src/components/RobotPlayground").ORIENTATION;
const RobotControlCenter = require("../../src/components/RobotControlCenter").default;

  Given('robot control center is loaded', function () {    
    cleanup();
    render(      
        React.createElement(MantineProvider, {
              withNormalizeCSS: true,
              withGlobalStyles: true
    }, React.createElement(Notifications, null), React.createElement(RobotControlCenter, null))
    )
  });

  Given('orientation is set to {string}', async function (ORIENTATION) {
    const selectOrientation = screen.getByLabelText("Orientation");
    
    act(() => {
      fireEvent.mouseDown(selectOrientation);
    });

    await waitFor(() => {
      assert.ok(screen.queryByText(ORIENTATION));      
      userEvent.default.click(screen.queryByText(ORIENTATION)!);
      userEvent.default.click(selectOrientation);
    });
  });

  Then('Orientation, Position can be set, Report command is not available', function () {
    assert.ok(screen.getByLabelText('Orientation'))    
    assert.ok(screen.getByLabelText('Row'))    
    assert.ok(screen.getByLabelText('Column'))    
    assert.ok(screen.getByRole("button", { name: /Place/i }))
    assert.ok(screen.getByRole("button", { name: /Report/i }))
    assert.ok(screen.getByRole("button", { name: /Report/i }).disabled)    
  });    

  Then('Orientation selection is set to NORTH and Postition selection is set to ORIGIN', function () {
    assert.equal(screen.getByLabelText('Orientation').value, "NORTH")        
  });    

  
  When('Place command is triggered', function () {
    const btnPlace = screen.getByRole("button", { name: /Place/i });

    act(() => {
      fireEvent.click(btnPlace);
    });
  });    

  When('Report command is triggered', function () {
    const btnReport = screen.getByRole("button", { name: /Report/i });

    act(() => {
      fireEvent.click(btnReport);
    });
  });    

  Then('robot is oriented NORTH in Postition ORIGIN', async function () {
    await waitFor(() => {
      assert.equal(document.documentElement.getAttribute("data-robot-row"),"5")        
      assert.equal(document.documentElement.getAttribute("data-robot-column"),"1")                           
      assert.equal(document.documentElement.getAttribute("data-robot-orientation"),"0")
    });    
  });    

  Then('robot is oriented {string}', async function (RESULT) {
    await waitFor(() => {      
      assert.equal(
        ORIENTATION[document.documentElement.getAttribute("data-robot-orientation")!], RESULT)      
    });    
  });    

  Then('notification {string} is displayed', async function (NOTIFICATION) {         
    await waitFor(() => {      
      assert.ok(screen.queryByText(NOTIFICATION))      
    });
  });                                                                    
  