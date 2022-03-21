import createModal from './createModal.js';

(() => {
  const linkList = Object.values(document.querySelectorAll('h2[id]'))
        .map(e => ({ id: e.id, title: e.innerText }));

  if (linkList.length > 0) {
    const { body } = createModal();

    linkList.forEach(({ id, title }) => {
      const row = document.createElement('div');
      row.style.marginBottom = '7px';
      const link = document.createElement('a');
      link.innerText = title;
      link.href = '#' + id;
      row.appendChild(link);
      body.appendChild(row);
    });
  }
})();
