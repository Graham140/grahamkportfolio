/**
 * Graham K Portfolio — main.js
 */
(function () {
  'use strict';

  /* --------------------------------------------------------
     Active nav link
  -------------------------------------------------------- */
  var currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#site-header nav a').forEach(function (link) {
    if (link.getAttribute('href') === currentFile) link.classList.add('active');
  });

  /* --------------------------------------------------------
     Project grid builder
     Each project page sets MANIFEST + FOLDER before this loads
  -------------------------------------------------------- */
  var grid = document.getElementById('project-grid');
  var imageList = []; // flat ordered list of src strings for lightbox

  if (grid && typeof MANIFEST !== 'undefined' && typeof FOLDER !== 'undefined') {
    buildGrid(FOLDER, MANIFEST);
  }

  function buildGrid(folder, files) {
    var fragment = document.createDocumentFragment();
    files.forEach(function (filename, index) {
      var src = folder + '/' + filename;
      imageList.push(src);

      var item = document.createElement('div');
      item.className = 'grid-item';
      item.setAttribute('data-index', index);

      var img = document.createElement('img');
      img.alt = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      img.loading = 'lazy';
      img.src = src;
      img.addEventListener('load', function () { img.classList.add('loaded'); });
      img.addEventListener('error', function () { item.style.display = 'none'; });
      if (img.complete) img.classList.add('loaded');

      item.appendChild(img);
      fragment.appendChild(item);
    });
    grid.appendChild(fragment);

    // Attach lightbox click after items are in DOM
    grid.addEventListener('click', function (e) {
      var item = e.target.closest('.grid-item');
      if (!item) return;
      var index = parseInt(item.getAttribute('data-index'), 10);
      openLightbox(index);
    });
  }

  /* --------------------------------------------------------
     Lightbox
  -------------------------------------------------------- */
  var lb        = document.getElementById('lightbox');
  var lbImg     = document.getElementById('lightbox-img');
  var lbClose   = document.getElementById('lb-close');
  var lbPrev    = document.getElementById('lb-prev');
  var lbNext    = document.getElementById('lb-next');
  var lbCounter = document.getElementById('lb-counter');
  var currentIndex = 0;

  if (!lb) return; // no lightbox on this page

  function openLightbox(index) {
    currentIndex = index;
    showImage(currentIndex);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function showImage(index) {
    lbImg.classList.remove('loaded');
    lbImg.src = imageList[index];
    lbImg.onload = function () { lbImg.classList.add('loaded'); };
    if (lbCounter) lbCounter.textContent = (index + 1) + ' / ' + imageList.length;
    // Hide arrows if only one image
    if (lbPrev) lbPrev.style.display = imageList.length > 1 ? '' : 'none';
    if (lbNext) lbNext.style.display = imageList.length > 1 ? '' : 'none';
  }

  function prev() {
    currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    showImage(currentIndex);
  }

  function next() {
    currentIndex = (currentIndex + 1) % imageList.length;
    showImage(currentIndex);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
  lbNext.addEventListener('click', function (e) { e.stopPropagation(); next(); });

  // Click backdrop to close
  lb.addEventListener('click', function (e) {
    if (e.target === lb) closeLightbox();
  });

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape')     closeLightbox();
  });

})();
