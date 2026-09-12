// Highlight today's working hours row
(function () {
    const dayMap = [null, 'hr-mon', 'hr-tue', 'hr-wed', 'hr-thu', 'hr-fri', null, null];
    const id = dayMap[new Date().getDay()];
    if (id) {
      const el = document.getElementById(id);
      if (el) el.classList.add('today');
    }
  })();
  
  // Copy email to clipboard
  window.copyEmail = function () {
    const email = 'info-2000114@edu.mon.bg';
    const showSuccess = () => {
      const el = document.getElementById('copySuccess');
      if (el) {
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 3000);
      }
    };
  
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(showSuccess).catch(() => {
        fallbackCopy(email);
        showSuccess();
      });
    } else {
      fallbackCopy(email);
      showSuccess();
    }
  };
  
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  
  // Contact form: validate locally, then open the school mailbox.
  // There is no server endpoint in this project.
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const success = document.getElementById('formSuccess');
    const errorBox = document.getElementById('formError');
    const schoolEmail = 'info-2000114@edu.mon.bg';

    const showError = (message) => {
      if (!errorBox) return;
      errorBox.hidden = false;
      errorBox.textContent = message;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (errorBox) errorBox.hidden = true;
      if (success) success.hidden = true;

      if (!form.checkValidity()) {
        form.reportValidity();
        showError('Моля, попълнете задължителните полета коректно.');
        return;
      }

      const fname = form.fname.value.trim();
      const lname = form.lname.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        showError('Въведете валиден имейл адрес.');
        return;
      }

      const body = [
        `Име: ${fname} ${lname}`,
        `Имейл: ${email}`,
        phone ? `Телефон: ${phone}` : null,
        '',
        message
      ].filter(Boolean).join('\n');

      const mailto = `mailto:${schoolEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      if (success) success.hidden = false;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }