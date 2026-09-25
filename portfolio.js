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

  const locale = document.documentElement.lang || 'en';
  const demoCopy = {
    en: {
      inProgress: 'In progress', readyForReview: 'Ready for review',
      showClean: 'Show clean response view', showDetail: 'Show comparison detail',
      views: {
    priorities: [
      ['Supplier comparison underway', 'Commercial research · next review', 'In progress'],
      ['Buyer brief ready', 'Documentation · owner decision', 'Ready'],
      ['Market question assigned', 'Research · evidence gathering', 'In progress']
    ],
    research: [
      ['Define the decision question', 'Research · scope and context', 'In progress'],
      ['Compare source evidence', 'Market scan · review-ready', 'Ready'],
      ['Prepare a concise brief', 'Next step · owner review', 'In progress']
    ],
    follow: [
      ['Clarification prepared', 'Commercial desk · owner review', 'Ready'],
      ['Next action assigned', 'Human coordination · follow-through', 'In progress'],
      ['Decision point recorded', 'Management view · ready to review', 'In progress']
    ]}},
    id: {
      inProgress: 'Sedang berjalan', readyForReview: 'Siap ditinjau',
      showClean: 'Tampilkan tampilan respons yang rapi', showDetail: 'Tampilkan detail perbandingan',
      views: {
        priorities: [['Perbandingan pemasok sedang disusun', 'Riset komersial · tinjauan berikutnya', 'Sedang berjalan'], ['Ringkasan pembeli siap', 'Dokumentasi · keputusan pemilik', 'Siap'], ['Pertanyaan pasar ditugaskan', 'Riset · pengumpulan bukti', 'Sedang berjalan']],
        research: [['Tentukan pertanyaan keputusan', 'Riset · ruang lingkup dan konteks', 'Sedang berjalan'], ['Bandingkan bukti sumber', 'Pemindaian pasar · siap ditinjau', 'Siap'], ['Siapkan ringkasan singkat', 'Langkah berikutnya · tinjauan pemilik', 'Sedang berjalan']],
        follow: [['Klarifikasi disiapkan', 'Tim komersial · tinjauan pemilik', 'Siap'], ['Tindak lanjut ditugaskan', 'Koordinasi tim · tindak lanjut', 'Sedang berjalan'], ['Titik keputusan dicatat', 'Tampilan manajemen · siap ditinjau', 'Sedang berjalan']]
      }
    },
    ar: {
      inProgress: 'قيد التنفيذ', readyForReview: 'جاهز للمراجعة',
      showClean: 'عرض الرد المنظّم', showDetail: 'عرض تفاصيل المقارنة',
      views: {
        priorities: [['مقارنة الموردين قيد الإعداد', 'البحوث التجارية · المراجعة التالية', 'قيد التنفيذ'], ['ملخص المشتري جاهز', 'التوثيق · قرار المالك', 'جاهز'], ['تم تكليف فريق بسؤال السوق', 'البحث · جمع الأدلة', 'قيد التنفيذ']],
        research: [['تحديد سؤال القرار', 'البحث · النطاق والسياق', 'قيد التنفيذ'], ['مقارنة أدلة المصادر', 'مسح السوق · جاهز للمراجعة', 'جاهز'], ['إعداد موجز مختصر', 'الخطوة التالية · مراجعة المالك', 'قيد التنفيذ']],
        follow: [['تم إعداد الإيضاح', 'الفريق التجاري · مراجعة المالك', 'جاهز'], ['تم تكليف إجراء تالٍ', 'تنسيق الفريق · متابعة التنفيذ', 'قيد التنفيذ'], ['تم تسجيل نقطة القرار', 'عرض الإدارة · جاهز للمراجعة', 'قيد التنفيذ']]
      }
    }
  };
  const copy = demoCopy[locale] || demoCopy.en;
  const demoViews = copy.views;
  document.querySelectorAll('.ops-demo').forEach(panel => {
    const tasks = [...panel.querySelectorAll('[data-demo-task]')];
    const metas = [...panel.querySelectorAll('[data-demo-meta]')];
    const statuses = [...panel.querySelectorAll('[data-demo-status]')];
    const rows = [...panel.querySelectorAll('.ops-row')];
    panel.querySelectorAll('[data-demo-view]').forEach(button => button.addEventListener('click', () => {
      panel.querySelectorAll('[data-demo-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      const view = demoViews[button.dataset.demoView];
      view.forEach((item, i) => {
        tasks[i].textContent = item[0]; metas[i].textContent = item[1]; statuses[i].textContent = item[2];
        statuses[i].classList.toggle('ready', item[2] === 'Ready');
        rows[i].classList.remove('ready-moment');
      });
      panel.querySelector('[data-demo-cycle]').setAttribute('aria-pressed', 'false');
      panel.classList.remove('demo-updated');
    }));
    panel.querySelector('[data-demo-cycle]').addEventListener('click', event => {
      const button = event.currentTarget;
      const status = statuses[0];
      const ready = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(ready));
      status.textContent = ready ? copy.readyForReview : copy.inProgress;
      status.classList.toggle('ready', ready);
      rows[0].classList.toggle('ready-moment', ready);
      panel.classList.toggle('demo-updated', ready);
    });
  });

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
    button.textContent = comparison ? copy.showClean : copy.showDetail;
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
