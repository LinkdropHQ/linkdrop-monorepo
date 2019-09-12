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
  height: 100%;
  z-index: 2147483647;
}

.ld-widget-iframe {
  position: absolute;
  height: 450px;
  display: block;
  bottom: 85px;
  right: 20px;
  border: none;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  padding: 15px;
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
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAT2SURBVHgB3Vj/ceI6EF4Y/o+vAusqwKkgvgrgVYBfBSEVhKsgpAJIBZAKMBUAFWAqiFOBnjb+drRWbEN+3Myb2xmN1pa0+2lX0mrVo0+QtXbqqtIV40rsyqsrQ1cO6CI8t23Rl3q93pL+Nuqd6+CsFbmKLTZ35cGVE5rYSoUrCVUWioKh8q/A9wn8yFnyH3hh5fgTfQVgCNYJLF1tyLu4REld2YNPFDB2beHGJK7eiwy6kHodYBIoWlNlwT0ARfQ1kgkZqrwyZtkMvqnz4IywtQByAtYO9M6xTwAeo09K7UB4bA4wXPOGmThZv5ysmeOvoMO0yHhvQViuVMr3AERQKLMv8D9Cnxvyu1jaubYAJv8iJV9k5yK/zZIa4JjXiSuZK0teb7Yi5o/gX+zHScYcXZmDjyE3g85xFzCDOgKoBHXqygI8C39wZQWFKyjaNQCSf7rvPf4bAEsDXZFgaAI4RT1DyZSCP0Ub1JnoFQxdlsyktnUXs4Cj/TodIYsphg7ROQ4t2FfAVmhgF2+oWsy88FfoMiG/25aoH125w/e1K/+i/KRqd/5GnxLfBBkT8Dl0sE4+IcTND9RhOXFvpix3Cb2c+W4i2Sysa2obXDzgRgTx2FZHDGFWJ8x8qOaxRduSfBR5pmaS42SE71dYji0puzVGnxjyThabFUBv+0qgUWdQSv7MSlUfASvhjM+9KyjMAf4G/AiKD5AhZ58+SlLoOJFfPtoor31SoUuhLxSwXAl8kslQtbZY0A+qDtwMik7g2bI99HkkH3kelbyc6hMX2XKBMAMAmVM93PC/JXg9Y7HCMxQenNVn1EFYT7IUWFahmkW2eErujgLYsAWPgXLhRZAOPUPyMTYJxnTRjeITxe+DWnSL3Jc+1eOsaeC1wCn5xX9Hl99s7pTyOb0Hm6p/qZKbMMCDatQzabpI/lL8PV1O0lcsH1IbhkM/6HhFl9OHLrtnyCq+tmwYoN5B14of0nvaKQEzupx+Kz5vaDeK1xYeaheXweAtam1yWYNM78NRM5XoGymeAtkSFJgKxb+5WNwaUd3FYkE9o0PDBM5RhHGl4imQHVN9wwkfD8hvBp7ND/A5VaGJaU3+vDKoR1A0VOdc246WHHkUKA9l5+p/gXrbVx+G6oeoDntCt0rALXlr6Pgcg5czk/vwLhZDTJS8VIBg7FsGqNpLHer2ii/IXwZyNWCNWpIhyY23UJYr/pl8VOD/V0qPUE7+svCmBxeWQjoMHOK5fCB/JaqvGX0eijuy4F/o4i6Xp4o/YLzEcIPcOQGepT4Hf+KyyMIn5F8FZO0Uqu+afFSYUTV7vqTKhZUPdL5Y3JGPHE9qfNEwOdZZAsOIQrI+YRmj5kvkwvor/739viv/PfgYOjLRSW3Eg1CHSdPG/jmShCwD6BkwTLss2JV27gD+M2knv0zwFf9oz6edpsuSOnFfWO/ihf2+xH0BPgbfmrh/9emD23nb8w6Uh0x9tFzje0/NTx879MlF/tmnDw3UenfL+txYny8frV+fXRbdoCxcubVVevm25mHByPpkjc5aUAOk+vNbgdm3nW+XUkn+4YmPIHZr6/PbZx8w5THSqGbmJRqx8pz8hAqq3FfY73rAVKCMq8YccRzPrwzPAGPQRXLb0LL69iLpp/TnA5y9Mv8I2P8lferabv2JzxeAlPyaknXEvCT13Ma7PNJx/1L6DwYUNQZzFX6bAAAAAElFTkSuQmCC') 50% 50% no-repeat;
  background-color: #0025FF;
  cursor: pointer;
}

`
