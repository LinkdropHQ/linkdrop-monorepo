// @media (max-width: 576px) {
//     .ld-container {
//       bottom: 0;
//       top: auto;
//     }
// }
// @media (max-width: 576px) {
//     .por_portis-widget-frame {
//       bottom: 0;
//       top: auto;
//       width: 100%;
//       right: 0;
//       left: 0;
//       border-bottom-left-radius: 0;
//       border-bottom-right-radius: 0;
//     }
// }

export const styles = `
.ld-widget-container {
  width: 100%;    
  top: 0px;
  height: 100%;
  z-index: 2147483647;
}

.ld-widget-iframe {
  position: fixed;
  height: 450px;
  display: none;
  bottom: 85px;
  right: 10px;
  border: none;
  width: calc(100% - 20px);
  max-width: 395px;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  border: 0 transparent;
  overflow: hidden;
  z-index: 2147483000;
}

.ld-widget-icon {
  z-index: 2147483647;        
  position: fixed;
  bottom: 10px;
  right: 10px;
  height: 60px;
  border-radius: 60px;
  width: 60px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAbCAYAAABr/T8RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAErSURBVHgB7ZbhbcIwEIWfUQfoBvUI7QQNE5QVmKDtBt2gZYJ2BDpBwgSMQDbAG5j3iIETAokfnP/AJz1ZuUh5ce58F4DknN+pVfZjSU1gCDLl+kN1VA8fGipS4xBCh7LblQRH+PxHak3NbVD8whl6tHaDo7JOGIyoiHKczXUHP57L+sI89zvjBYbCeoIvDZWocbUcC6WzFFk7QkX0ibn8U01VY8vtGT/AAXUqLmrFEUMVz0p+fY1Ji8O5FWpQOr9pF7j6p6ZBc2QqosxtwCPH8ZK4h7EmUDoR/4OnccnjFIfZruvPKsVFE+16XiZeskXlamxeoD93794yqxr3OH/2PHiVp4prRn1rOGOYlQk+qH+/YdjkdBuh6Vf5M/BGHh/yDPaVsv+f5v5MbwAM7039gyk2JgAAAABJRU5ErkJggg==') 50% 50% no-repeat;
  background-color: #0025FF;
  cursor: pointer;
  transition: background-color .3s;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
}

.ld-widget-icon.ld-widget-icon-opened {
  background-color: #979797;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACWSURBVHgBpdQLCoAgDAZg6aLtZnYzj+AR/hwqVOheDQax8sNwMwHILUvLMwWD17asbKXxMMONDmxG4QLhHWb0g3HQfOFGt9jjAzOqYh7UjFlQNyahYUxA45iCkrTm0ExjzbS7U/hl30StDgDRiZJO043C0BpmFI4+U1EEmnaL4scELFH029qNbdDKhQv91qYUjIHyxvINGgF+mDav5JQAAAAASUVORK5CYII=');
}

`
