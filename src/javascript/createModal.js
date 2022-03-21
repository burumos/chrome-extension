import '../stylesheet/modal.css';

export default function createModal() {
  const modal = document.createElement('div');
  modal.classList.add('something-extension-modal');

  const modalHead = document.createElement('div');
  modalHead.classList.add('modal-head');
  modalHead.draggable = true;
  modal.appendChild(modalHead);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  modal.appendChild(modalBody);

  const resizeElement = document.createElement('div');
  resizeElement.classList.add('ex-resize');
  resizeElement.draggable = true;
  modal.appendChild(resizeElement);

  document.body.appendChild(modal);

  addDragAction(modalHead, modal);
  addResizeAction(resizeElement, modal);

  return { modal, body: modalBody };
}

function addDragAction(head, modal) {
  let dragStartPointerPosition = {};
  head.addEventListener('dragstart', (e)=> {
    const { left, top } =  e.target.getBoundingClientRect();
    dragStartPointerPosition = { y: e.clientY - top, x: e.clientX - left };
    e.dataTransfer.setDragImage(modal, e.clientX - left, e.clientY - top);
  }, false);

  head.addEventListener('dragend', (e) => {
    const { x, y } = dragStartPointerPosition;
    modal.style.top = inWindowY(e.clientY - y)  + 'px';
    modal.style.left = inWindowX(e.clientX - x) + 'px';
    dragStartPointerPosition = {};
  });
}
const inWindowY = (y) => {
  if (0 > y) {
    return 0;
  }
  if (y > window.innerHeight - 100) {
    return window.innerHeight - 100;
  }
  return y;
}
const inWindowX = (x) => {
  if (0 > x) {
    return 0;
  }
  if (x > window.innerWidth - 100) {
    return window.innerWidth - 100;
  }
  return x;
}


function addResizeAction(resizeElement, modal) {
  let recentY = null;
  resizeElement.addEventListener('dragstart', (e)=> {
    recentY = e.clientY;
    const crt = e.target.cloneNode(true);
    crt.style.display = 'none';
    crt.classList = 'drag-dummy';
    document.body.appendChild(crt)
    e.dataTransfer.setDragImage(crt, 0, 0);
  }, false);
  document.addEventListener('dragover', (e) => {
    if (recentY !== null) {
      modal.style.height = modal.getBoundingClientRect().height
        + e.clientY - recentY + 'px';
      recentY = e.clientY;
    }
  })
  resizeElement.addEventListener('dragend', () => {
    document.querySelectorAll('.drag-dummy').forEach(e => e.remove());
    recentY = null;
  });
}
