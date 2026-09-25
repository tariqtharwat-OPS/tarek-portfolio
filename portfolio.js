(() => {
  document.documentElement.classList.add('js-motion');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.hero > div, .section-head, .service, .workcard, .case-top > *, .case-block, .evidence, .case-value, .related, .split > *');
  revealTargets.forEach((node, i) => {
    node.dataset.reveal = '';
    if (node.matches('.service, .workcard, .case-block')) node.style.setProperty('--reveal-delay', `${Math.min(i % 4, 3) * 65}ms`);
  });
  if (!reduce && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    revealTargets.forEach(node => observer.observe(node));
  } else revealTargets.forEach(node => node.classList.add('is-visible'));

  document.querySelectorAll('[data-demo-cycle]').forEach(button => button.addEventListener('click', () => {
    const panel = button.closest('.ops-demo');
    const status = panel.querySelector('[data-demo-status]');
    const task = panel.querySelector('[data-demo-task]');
    const ready = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(ready));
    status.textContent = ready ? 'Ready for review' : 'In progress';
    status.classList.toggle('ready', ready);
    task.textContent = ready ? 'Supplier comparison prepared' : 'Supplier comparison underway';
    panel.classList.toggle('demo-updated', ready);
  }));

  const steps = [...document.querySelectorAll('[data-research-step]')];
  steps.forEach(step => step.addEventListener('click', () => {
    steps.forEach(item => { item.classList.remove('active'); item.removeAttribute('aria-current'); });
    step.classList.add('active'); step.setAttribute('aria-current', 'step');
    const output = document.querySelector('[data-research-detail]');
    if (output) output.textContent = step.dataset.detail;
  }));

  document.querySelectorAll('[data-doc-toggle]').forEach(button => button.addEventListener('click', () => {
    const panel = button.closest('.document-demo');
    const comparison = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(comparison));
    panel.classList.toggle('show-detail', comparison);
    button.textContent = comparison ? 'Show clean response view' : 'Show comparison detail';
  }));

  const hero = document.querySelector('.hero-art');
  if (hero && !reduce && matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const box = hero.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      hero.style.setProperty('--tilt-x', `${-y * 2.2}deg`);
      hero.style.setProperty('--tilt-y', `${x * 2.8}deg`);
    });
    hero.addEventListener('pointerleave', () => { hero.style.setProperty('--tilt-x', '0deg'); hero.style.setProperty('--tilt-y', '0deg'); });
  }
})();
