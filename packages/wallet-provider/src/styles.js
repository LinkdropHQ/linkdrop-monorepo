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
    position: fixed;
    width: 100%;    
    top: 0px;
    z-index: 2147483647;
  }

  .ld-widget-iframe {
    position: relative;
    height: 450px;
    display: block;
    margin: 0px auto;
    border: none;
    background: white;
    padding: 15px;
    top: 20px;
    border: 0 transparent;
    
    overflow: hidden;
    z-index: 2147483000;
  }

.ld-widget-icon {
  z-index: 2147483647;        
  position: fixed;
  bottom: 60px;
  right: 30px;
  height: 50px;
  background: blue;
  border-radius: 50%;
  width: 50px;  
}

.ld-widget-icon:hover {

  background: darkblue;
  cursor: pointer;
}
`
