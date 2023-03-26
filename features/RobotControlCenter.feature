Feature: Robot control center
  Controlling position and orientation of the robot
  
Scenario Template: Orientation, Position can be set, Report command is not available 
    Given robot control center is loaded    
    Then Orientation, Position can be set, Report command is not available  
    Then Orientation selection is set to NORTH and Postition selection is set to ORIGIN

Scenario Template: Position to ORIGIN 
    Given robot control center is loaded
    When Place command is triggered
    Then robot is oriented NORTH in Postition ORIGIN

Scenario Template: Positioning and Orienting 
    Given robot control center is loaded
    Given orientation is set to "<ORIENTATION>"
    When Place command is triggered
    Then robot is oriented "<RESULT>" 
Examples:
    | ORIENTATION |RESULT |
    | NORTH       |NORTH  |
    | EAST        |EAST   |
    | SOUTH       |SOUTH  |
    | WEST        |WEST   |

Scenario Template: Report location 
    Given robot control center is loaded
    When Place command is triggered
    When Report command is triggered    
    Then notification "0, 0, NORTH" is displayed 
    